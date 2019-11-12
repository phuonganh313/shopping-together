<?php

namespace App;
use DB;
use App\ShopOwner;
use App\Shop;
use App\Currency;
use Illuminate\Database\Eloquent\Model;
use OhMyBrew\ShopifyApp\Facades\ShopifyApp;

class Authentication extends Model
{
    /**
     * @param array $shop
     */
    public static function updateShop($shop){
        $shop_owner = new ShopOwner();
        $shop_owner->email = $shop->email;
        $shop_owner->name = $shop->name;
        $shop_owner->phone = $shop->phone;
        $shop_owner->address = $shop->address1;
        $shop_owner->save();
        return $shop_owner->id;
    }

    /**
     * @param  int $id_shop
     * @param  int $id_shop_owner
     */
    public static function updateShopOwner($id_shop, $id_shop_owner){
        $shop = Shop::find($id_shop);
        $shop->id_shop_owner = $id_shop_owner;
        $shop->save();
    }

    /**
     * @param  int $id_shop
     * @param  string $sign
     */
    public static function updateCurrency($id_shop, $sign) {
        $currency = new Currency();
        $currency->id_shop = $id_shop;
        $currency->currency = $sign;
        $currency->save();
    }

    /**
     * @param  int $id_shop
     */
    public static function uninstall ($id_shop) {
        DB::table('shops')->where('id', $id_shop)->delete();
        DB::table('products')->where('id_shop', $id_shop)->delete();
        DB::table('variants')->where('id_shop', $id_shop)->delete();
        DB::table('images')->where('id_shop', $id_shop)->delete();
        DB::table('currency')->where('id_shop', $id_shop)->delete();
        DB::table('settings')->where('id_shop', $id_shop)->delete();
        DB::table('stats')->where('id_shop', $id_shop)->delete();
        DB::table('cart_rule')->where('id_shop', $id_shop)->delete();
        DB::table('cart_rule_detail')->where('id_shop', $id_shop)->delete();
    }
}