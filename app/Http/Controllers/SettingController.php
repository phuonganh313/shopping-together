<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Setting;
use App\Shop;
use App\CartRule;
use App\Currency;
use DB;

class SettingController extends Controller
{   

    public function index()
    {
        return view('app');
    }

    public function validateData($request)
    {
        $errors = array();
        $validator = \Validator::make($request->all(), [
            'product_font_color' =>'required', 
            'title_font_color' =>'required', 
            'amount_font_color' =>'required', 
            'new_price_font_color' =>'required', 
            'cart_text' =>'required', 
            'product_text' =>'required', 
            'old_price_font_color' =>'required', 
            'cart_font_color' =>'required', 
            'back_ground_color' =>'required', 
        ]);

        if($validator->fails()){
            $errors = $validator->errors();
        }

        return $errors;
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function save(Request $request)
    {
        $errors = $this->validateData($request);
        $result = '';

        if(!$errors)
        {
            $shop_info = Shop::getShopByDomain($request->shopify_domain);
            $shop = $shop_info ? Shop::find($shop_info->id) : null;

            if($shop && $shop->settings){
                $result = $shop->settings->update($request->all());

            }else{
                $settings = new Setting($request->all());
                $result = $shop->settings()->save($settings);
            }
        }
        return response()->json([
            'message'=>$errors ? $errors: trans('label.update_successfully'),
            'data' => $result,
        ], 200);
        
    }
    
    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function get(Request $request){
        $setting_folder = './settings';
        $setting = '';
        $rules_name = '';
        if($request->shopify_domain){
            $shop_info = Shop::getShopByDomain($request->shopify_domain);
            if($shop_info){
                $shop_setting = Setting::getSettingByShopId($shop_info->id);
                $setting = $shop_setting ? $shop_setting : json_decode(file_get_contents($setting_folder.'/defaultSetting.json'), true);
                $rules_name = CartRule::getRuleName($shop_info->id);
                $currency = DB::table('currency')->select('currency')->where('id_shop', $shop_info->id)->first();
            }
        }
        return response()->json([
            'message'=> $setting ? trans('label.update_successfully') : trans('label.un_successfully'),
            'data' => array(
                'setting' => $setting,
                'rules_name' => $rules_name,
                'currency' => $currency
            )
        ], 200);
    }
}
