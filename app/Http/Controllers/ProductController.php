<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;
use App\Variant;
use App\Image;
use App\Shop;
use Mail;
use DB;

class ProductController extends Controller
{
    protected $page_number = 1;
    protected $items_per_page = 12;

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
    */
    public function renderList(Request $request){
        $this->page_number = ($request->page_number) ? (int)$request->page_number : $this->page_number;
        $data = [];
        $status = true;
        $msg = trans('label.successfully');
        $shop = Shop::getShopByDomain($request->shopify_domain);
        try{
            $data = Product::getProducts($this->page_number, $this->items_per_page, $shop->id, $request->is_main_product);
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
    public function save (Request $request){
        $domain = request()->header('x-shopify-shop-domain');
        session(['shopify_domain' => $domain]);
        $product = json_decode(file_get_contents('php://input'));
        $shop = Shop::getShopByDomain($domain);
        Product::deleteProduct($product->id);
        Product::importProduct($product, $shop->id);          
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
    */
    public function delete (Request $request){
        $response = json_decode(file_get_contents('php://input'));
        Product::deleteProduct($response->id);
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
    */
    public function search(Request $request){
        $this->page_number = ($request->page_number) ? (int)$request->page_number : $this->page_number;
        $msg = '';
        $data = array();
        $status = false;
        $key_word = preg_replace('/[^A-Za-z0-9\-]/', '', isset($request->key_word) ? $request->key_word : null);
        $shop = Shop::getShopByDomain($request->shopify_domain);
        if(!empty($key_word)){
            $data = Product::search($key_word, $this->page_number, $this->items_per_page, $shop->id, $request->is_main_product);
            $status = $data['items'] ? true : false;
            $msg = $data['items'] ? trans('label.find').' '.count($data['items']).' '.trans('label.record') : trans('label.record_not_found') ;
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
    public function get(Request $request){
        $shop = Shop::getShopByDomain($request->shopify_domain);
        $product = $shop ? Product::getFirstProduct($shop->id) : null;
        if($product){
            $product->variants = Variant::getOptions($product->id_shopify_product);
        }   
        return response()->json([
            'message'=> $product ? trans('label.update_successfully') : trans('label.un_successfully'),
            'data' => $product
        ], 200);
    }
}
