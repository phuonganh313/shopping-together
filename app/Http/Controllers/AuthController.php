<?php

namespace App\Http\Controllers;

use OhMyBrew\ShopifyApp\Facades\ShopifyApp;
use OhMyBrew\ShopifyApp\Jobs\ScripttagInstaller;
use OhMyBrew\ShopifyApp\Jobs\WebhookInstaller;
use App\ShopOwner;
use App\Shop;
use App\Product;
use App\Variant;
use App\Image;
use App\Currency;
use App\Authentication;
use Illuminate\Http\Request;
use OhMyBrew\ShopifyApp\Traits\AuthControllerTrait;
use DB;

class AuthController extends Controller
{
    use AuthControllerTrait;
    protected function authenticationWithoutCode()
    {
        $shopDomain = session('shopify_domain');
        $api = ShopifyApp::api();
        $api->setShop($shopDomain);
        // Grab the authentication URL
        $api_redirect = urlencode(url(config('shopify-app.api_redirect')));
        if(config('shopify-app.mode')){
            $authUrl = $api->getAuthUrl(
                config('shopify-app.api_scopes'),
                url(config('shopify-app.api_redirect'))
            );
            $new_api_redirect = (!strpos(url(config('shopify-app.api_redirect')), "s:")) ? urlencode(substr_replace(url(config('shopify-app.api_redirect')), "s", 4, 0)) : $api_redirect;
        }else{
            $authUrl = $api->getAuthUrl(
                config('shopify-app.api_scopes'),
                config('shopify-app.domain')
            );
            $new_api_redirect = config('shopify-app.domain');
        }

        $scope = urlencode(config('shopify-app.api_scopes'));
        $key = config('shopify-app.api_key');
        // Do a fullpage redirect
        return view('auth.fullpage_redirect', [
            'scope' => $scope,
            'key' => $key,
            'api_redirect' => $new_api_redirect,
            'authUrl'    => $authUrl,
            'shopDomain' => $shopDomain,
        ]);
    }
    protected function authenticationWithCode()
    {
        $shop_domain = session('shopify_domain');
        $api = ShopifyApp::api();
        $api->setShop($shop_domain);

        // Check if request is verified
        if (!$api->verifyRequest(request()->all())) {
            // Not valid, redirect to login and show the errors
            return redirect()->route('login')->with('error', trans('label.Invalid_signature'));
        }
      
        // Save token to shop
        $shop = ShopifyApp::shop();
        if ($shop->trashed()) {
            $shop->restore();
            $shop->charges()->restore();
        }
        $shop->shopify_token = $api->requestAccessToken(request('code'));
        $shop->save();
        $id_shop = $shop->id;
        // Install webhooks and scripttags
        $this->installWebhooks();
        $this->installScripttags();

        // Run after authenticate job
        $this->afterAuthenticateJob();
        $shop = ShopifyApp::shop();
        $request = $shop->api()->request('GET', '/admin/shop.json');
        $shop_owner_info = ShopOwner::getShopOwnerByDomain($request->body->shop->email);
        $id_shop_owner = !empty($shop_owner_info) ? $shop_owner_info->id : Authentication::updateShop($request->body->shop);
        Authentication::updateCurrency($id_shop, $request->body->shop->currency);
        $id_shop_owner ? Authentication::updateShopOwner($id_shop, $id_shop_owner) : '';
        // Go to homepage of app
        return redirect()->route('home');
    }

    public function uninstall(Request $request) {
        $shop_domain = request()->header('x-shopify-shop-domain');
        $shop_info = Shop::getShopByDomain($shop_domain);
        if($shop_info){
            Authentication::uninstall($shop_info->id);
        }
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function cloneProducts(Request $request){
        $status = true;
        $msg = trans('label.update_successfully');
        session(['shopify_domain' => $request->shopify_domain]);
        $shop = ShopifyApp::shop();
        $id_shop = $shop->id;
        $count = $shop->api()->request('GET', '/admin/products/count.json')->body->count;
        if($count > 0) {
            $pages = ceil($count / 250);
            for ($i=0; $i<$pages; $i++) {
                $products = $shop->api()->request("GET", "/admin/products.json?limit=250&page=".($i+1))->body->products;
                try{
                    Product::cloneProducts($products, $id_shop);                
                } 
                catch(\Exception $e){
                    $status = false;
                    $msg = $e->getMessage();
                }
            }
        }
        return response()->json([
            'message' => $msg,
            'status' => $status,
        ], 200);
    }
}
