<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Shop;
use App\CartRule;
use App\Variant;
use DB;
use App\Stats;
use App\DashBoard;
use OhMyBrew\ShopifyApp\Facades\ShopifyApp;
use App\CartRuleDetail;

class CartRuleController extends Controller
{
    public $page_number = 1;
    protected $items_per_page = 10;
    public $post_code = 'SPT';

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function save (Request $request)
    {
        $status = true;
        $msg = trans('label.update_successfully');
        $validator = \Validator::make($request->all(), [
            'name' => 'required|unique:cart_rule,name',
        ]);
        if($validator->fails()){
            $msg = $validator->errors();
            $status = false;
        }
        if($status){
            try{
                $shop_info = Shop::getShopByDomain($request->shopify_domain);
                session(['shopify_domain' => $request->shopify_domain]);
                $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                $code = '';
                for( $i = 0; $i < 8; $i++ ) {
                    $code .= $chars[ rand( 0, strlen($chars) - 1 ) ];
                }
                if($shop_info){
                    if($request->products){
                        $products = array();
                        $id_main_product = '';
                        $id_related_product = array();
                        foreach($request->products as $product){
                            if(($product['isMainProduct']) == true){
                                $id_main_product = $product['id_shopify_product'];
                            }else{
                                $id_related_product[] = $product['id_shopify_product'];
                            }
                        }
                        $discount = CartRule::saveCartRuleOnShopify(
                            $id_main_product,
                            $id_related_product,
                            $this->post_code.$code,
                            $request->reduction_percent,
                            $request->start_date, 
                            $request->end_date
                        );
                        $cart_rule = CartRule::saveCartRule(
                            $shop_info->id,
                            $request->name,
                            $this->post_code.$code,
                            $id_main_product,
                            $request->reduction_percent,
                            date_format(date_create($request->start_date),"Y-m-d H:i:s"),
                            date_format(date_create($request->end_date),"Y-m-d H:i:s"),
                            (string)$discount->price_rule_id
                        );
                        if($cart_rule){
                            foreach($request->products as $product){
                                $products[] = array(
                                    'id_cart_rule' => $cart_rule->id,
                                    'id_shop' => $shop_info->id,
                                    'id_product' => $product['id_shopify_product'],
                                    'is_main_product' => $product['isMainProduct'],
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                );
                            }
                            CartRuleDetail::saveCartRuleDetail($products);
                        }
                    }
                }
            }
            catch(\Exception $e){
                $status = false;
                $msg = $e->getMessage();
            }
        }
        return response()->json([
            'message' => $msg,
            'status' => $status,
        ], 200); 
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function updateCartRule(Request $request)
    {   
        $status = true;
        $msg = trans('label.update_successfully');
        $id_cart_rule = $request->id_cart_rule;
        try {
            $shop = Shop::getShopByDomain($request->shopify_domain);
            session(['shopify_domain' => $request->shopify_domain]);
            if($shop){
                if($id_cart_rule){
                    $cart_rule = CartRule::updateCartRule($id_cart_rule, $request->reduction_percent, $request->start_date, $request->end_date);
                    $cart_rule_detail = CartRuleDetail::getByIdCartRule($id_cart_rule);
                    $id_related_product = array();
                    foreach($request->products as $product){
                        if(!in_array($product['id_shopify_product'], array_column($cart_rule_detail, 'id_product'))){
                            CartRuleDetail::add($id_cart_rule, $shop->id, $product['id_shopify_product'], 0);
                        }
                        if(!$product['is_main_product']){
                            $id_related_product[] = $product['id_shopify_product'];
                        }
                    }
                    foreach($cart_rule_detail as $value){
                        if(!in_array($value->id_product, array_column($request->products, 'id_shopify_product'))){
                            CartRuleDetail::destroy($value->id);
                        }
                    }
                    CartRule::updateRuleOnShopify($cart_rule['id_price_rule_shopify'], $id_related_product, $request->reduction_percent, $request->start_date, $request->end_date);
                }
            }   
        }
        catch(\Exception $e){
            $status = false;
            $msg = $e->getMessage();
        }
        return response()->json([
            'message' => $msg,
            'status' => $status,
        ], 200);
    }
    
    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function get (Request $request) 
    {
        $domain = $request->shopify_domain;
        $id_product = $request->id_product;
        $shop = Shop::getShopByDomain($domain);
        $cart_rules = CartRule::getCartRule($shop->id, $id_product);
        if($cart_rules){
            DashBoard::addNBCartRule($cart_rules[0]->id, $shop->id, 'nb_view');
        }
        foreach($cart_rules as $key=>$cart_rule){
            $cart_rules[$key]->variants = Variant::getVariant($cart_rule->id_product);
        }
        return response()->json([
            'data' => $cart_rules,
        ], 200); 
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function getRulesList (Request $request) 
    {
        $this->page_number = ($request->page_number) ? (int)$request->page_number : $this->page_number;
        $data = [];
        $status = true;
        $msg = trans('label.successfully');
        $shop = Shop::getShopByDomain($request->shopify_domain);
        try{
            $data = CartRule::getRules($this->page_number, $this->items_per_page, $shop->id);
            foreach($data['items'] as $key=>$cart_rule){
                $data['items'][$key]->is_selected = false;
            }
        }
        catch(\Exception $e){
            $status = false;
            $msg = $e->getMessage();
        }
        return response()->json([
                'status' => $status,
                'message'=> $msg,
                'data' => $data
        ], 200);
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function search (Request $request) 
    {
        $this->page_number = ($request->page_number) ? (int)$request->page_number : $this->page_number;
        $msg = '';
        $data = array();
        $status = true;
        $key_word = preg_replace('/[^A-Za-z0-9\-]/', '', isset($request->key_word) ? $request->key_word : null);
        $shop = Shop::getShopByDomain($request->shopify_domain);
        if(!empty($key_word)){
            $data = CartRule::search($key_word, $this->page_number, $this->items_per_page, $shop->id);
            $status = $data['items'] ? true : false;
            $msg = $data['items'] ? trans('label.find').' '.count($data['items']).' '.trans('label.record') : trans('label.rule_not_found') ;
        }
        return response()->json([
                'message'=> $msg,
                'data' => $data,
                'status' => $status,
        ], 200);
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function changeStatus ( Request $request){
        $msg = trans('label.update_successfully');
        $status = true;
        $id_cart_rules = $request->id_cart_rules;
        try{
            DB::table('cart_rule')->whereIn('id', $id_cart_rules)->update([
                'status' => (int)$request->status,
            ]); 
        }
            catch(\Exception $e){
                $msg = $e->getMessage();
                $status = false;
            }
            return response()->json([
                'message'=> $msg,
                'status' => $status,
            ], 200);
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function deleteRule(Request $request){
        $msg = trans('label.delete_successfully');
        $status = true;
        $id_cart_rules = is_array($request->id_cart_rules) ? $request->id_cart_rules : array($request->id_cart_rules);
        $id_price_rules_shopify = is_array($request->id_price_rule_shopify) ? $request->id_price_rule_shopify : array($request->id_price_rule_shopify);
        try{
            session(['shopify_domain' => $request->shopify_domain]);
            $shop = ShopifyApp::shop();
            foreach($id_price_rules_shopify as $value){
                $shop->api()->request('DELETE', '/admin/price_rules/'.$value.'.json')->body;
            }
            CartRule::deleteRule($id_cart_rules);
        }
        catch(\Exception $e){
            $msg = $e->getMessage();
            $status = false;
        }
        return response()->json([
            'message'=> $msg,
            'status' => $status,
        ], 200);
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function getDetail (Request $request)
    {   
        $data = [];
        if($request->id){
            $data = CartRule::getRuleById($request->id);
        }
        return response()->json([
            'message'=> $data ? trans('label.successfully') : trans('label.un_successfully'), 
            'data' => $data
        ], 200);
    }
}