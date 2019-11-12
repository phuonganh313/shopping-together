<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;
use OhMyBrew\ShopifyApp\Facades\ShopifyApp;

class CartRule extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'cart_rule';
    protected $fillable=['id_shop','name','code','id_product','status','reduction_percent','start_date','end_date','updated_at','created_at'];

     /**
     * @param int $id_shop
     * @param string $name
     * @param int $id_product
     * @param int $reduction_percent
     * @param int $id_price_rule_shopify
     * @param string $code
     * @param string $value
     * @param string $start_date
     * @param string $end_date
     * @return array
     * <pre>
     *  array (
     *  'id' => int,
     *  'id_shop' => int,
     *  'reduction_percent' => int,
     *  'id_product' => varchar,
     *  'is_main_product' => varchar,
     *  'name' => varchar,
     *  'code' => varchar,
     *  'status' => tinyint,
     *  'start_date' => timestamp,
     *  'end_date' => timestamp,
     * )    
     */
    public static function saveCartRule($id_shop, $name, $code, $id_product, $reduction_percent, $start_date, $end_date, $id_price_rule_shopify){
        $cart_rule = new CartRule();
        $cart_rule->id_shop = $id_shop;
        $cart_rule->name = $name;
        $cart_rule->code = $code;
        $cart_rule->id_product = $id_product;
        $cart_rule->reduction_percent = $reduction_percent;
        $cart_rule->start_date = $start_date;
        $cart_rule->end_date = $end_date;
        $cart_rule->id_price_rule_shopify = $id_price_rule_shopify;
        $cart_rule->save();
        return $cart_rule;
    }

    /**
     * @param int $id_shop
     * @param string $id_product
     * @return array
     * <pre>
     *  array (
     *  'id' => int,
     *  'id_shop' => int,
     *  'reduction_percent' => int,
     *  'id_product' => varchar,
     *  'is_main_product' => varchar,
     *  'name' => varchar,
     *  'code' => varchar,
     *  'status' => tinyint,
     *  'start_date' => timestamp,
     *  'end_date' => timestamp,
     * )    
     */
    public static function getCartRule($id_shop, $id_product) {
        $sql = DB::table('cart_rule');
        $sql->select('cart_rule.id','cart_rule.id_shop', 'cart_rule_detail.id_product', 'cart_rule_detail.is_main_product','cart_rule.name','cart_rule.code','cart_rule.status','cart_rule.reduction_percent',
                    'cart_rule.start_date','cart_rule.end_date');
        $sql->join('cart_rule_detail', 'cart_rule_detail.id_cart_rule', '=', 'cart_rule.id');
        $sql->where('cart_rule.status', 1);
        $sql->where('cart_rule.id_shop', $id_shop);
        $sql->where('cart_rule.id_product', $id_product);
        return $sql->get()->toArray();
    }

    /**
     * @param int $page_number
     * @param int $items_per_page 
     * @param int $id_shop 
     * @return array
     * <pre>
     * array (
     *  'page_limit' => int,
     *  'current_page' => int,
     *  'items_per_page' => int,
     *  'total_items' => int,
     *  'items' => array(
     *       'name' => varchar,
     *       'status' => tinyint,
     *  )
     * )
     */
    public static function getRules($page_number, $items_per_page, $id_shop)
    {
        $data = [];
        $query = DB::table('cart_rule');
        $query->where('cart_rule.id_shop', $id_shop);
        $number_record = count($query->get());
        $data['page_limit'] = ceil($number_record / $items_per_page);
        $data['current_page'] = $page_number;
        $offset = ($page_number - 1)  * $items_per_page;
        $data['items_per_page'] = $items_per_page;
        $data['total_items'] = $number_record;
        if($offset >=0 && $items_per_page){
            $data['items'] = $query->offset($offset)->limit($items_per_page)->get();
        }else{
            $data['items'] = $query->get();
        }
        return $data;
    }

    /**
     * @param string $key_word
     * @param int $page_number
     * @param int $items_per_page
     * @param int $id_shop
     * @return array
     * <pre>
     * array (
     *  'page_limit' => int,
     *  'current_page' => int,
     *  'items_per_page' => int,
     *  'total_items' => int,
     *  'items' => array(
     *       'name' => varchar,
     *       'status' => tinyint,
     *  )
     * )
     */
    public static function search($key_word, $page_number, $items_per_page, $id_shop){
        $data = [];
        $query =  DB::table('cart_rule');
        $query->where('cart_rule.id_shop', $id_shop); 
        $query->where('cart_rule.name', 'like', '%'.$key_word.'%'); 
        $number_record = count($query->get());
        $data['page_limit'] = ceil($number_record / $items_per_page);
        $data['current_page'] = $page_number;
        $offset = ($page_number - 1)  * $items_per_page;
        $data['items_per_page'] = $items_per_page;
        $data['total_items'] = $number_record;
        if($offset >=0 && $items_per_page){
            $data['items'] = $query->offset($offset)->limit($items_per_page)->get()->toArray();
        }else{
            $data['items'] = $query->get()->toArray();
        }
        return $data;
    }

    /**
     * @param int $id_shop
     * @param string $name
     * @param int $id_product
     * @param int $reduction_percent
     * @param int $id_price_rule_shopify
     * @param string $code
     * @param string $value
     * @param string $start_date
     * @param string $end_date
     * @return array
     * <pre>
     *  array (
     *  'id' => int,
     *  'id_shop' => int,
     *  'reduction_percent' => int,
     *  'id_product' => varchar,
     *  'is_main_product' => varchar,
     *  'name' => varchar,
     *  'code' => varchar,
     *  'status' => tinyint,
     *  'start_date' => timestamp,
     *  'end_date' => timestamp,
     * )    
     */
    public static function saveCartRuleOnShopify ($id_main_product, $id_related_product, $code, $value, $start_date, $end_date) {
        $shop = ShopifyApp::shop();
        $price_rule = $shop->api()->request('POST', '/admin/price_rules.json',
            [
                "price_rule" => [
                    "title" => $code,
                    "value_type" => "percentage",
                    "value" => "-$value",
                    "customer_selection" => "all",
                    "target_type" => "line_item",
                    "target_selection"=> "entitled",
                    "allocation_method"=> "each",
                    "starts_at"=> $start_date,
                    "ends_at"=> $end_date,
                    "prerequisite_product_ids" => [
                        $id_main_product
                    ],
                    "entitled_product_ids" => $id_related_product,
                    "prerequisite_to_entitlement_quantity_ratio" => [
                        "prerequisite_quantity" => 1,
                        "entitled_quantity" => count($id_related_product)
                    ],
                    "allocation_limit"=> null
                ]
            ]
        )->body->price_rule;
        return $shop->api()->request('POST', '/admin/price_rules/'.$price_rule->id.'/discount_codes.json',["discount_code" => ["code" => $price_rule->title]])->body->discount_code;
    }

    /**
     * @param int $price_rule_id
     * @param int $id_related_product
     * @param string $value
     * @param string $start_date
     * @param string $end_date
     * @return array
     * <pre>
     *  array (
     *  'id' => int,
     *  'id_shop' => int,
     *  'reduction_percent' => int,
     *  'id_product' => varchar,
     *  'is_main_product' => varchar,
     *  'name' => varchar,
     *  'code' => varchar,
     *  'status' => tinyint,
     *  'start_date' => timestamp,
     *  'end_date' => timestamp,
     * )    
     */
    public static function updateRuleOnShopify ($price_rule_id, $id_related_product, $value, $start_date, $end_date) {
        $shop = ShopifyApp::shop();
        $shop->api()->request('PUT', '/admin/price_rules/'.$price_rule_id.'.json',
            [
                "price_rule" => [
                    "id" => $price_rule_id,
                    "value_type" => "percentage",
                    "value" => "-$value",
                    "customer_selection" => "all",
                    "target_type" => "line_item",
                    "target_selection"=> "entitled",
                    "allocation_method"=> "each",
                    "starts_at"=> $start_date,
                    "ends_at"=> $end_date,
                    "entitled_product_ids" => $id_related_product,
                    "prerequisite_to_entitlement_quantity_ratio" => [
                        "prerequisite_quantity" => 1,
                        "entitled_quantity" => count($id_related_product)
                    ],
                    "allocation_limit"=> null
                ]
            ]
        );
    }   

    /**
     * @param int $id_shop
     * @return array
     * <pre>
     * array (
     *      'name' => varchar,
     * )
     */
    public static function getRuleName ($id_shop) {
        return DB::table('cart_rule')->select('name')->where('id_shop', $id_shop)->get()->toArray();
    }

    /**
     * @param int $id
     * @return array
     * <pre>
     *  array (
     *  'id' => int,
     *  'id_product' => varchar,
     *  'name' => varchar,
     *  'reduction_percent' => int,
     *  'is_main_product' => varchar,
     *  'name' => varchar,
     *  'code' => varchar,
     *  'status' => tinyint,
     *  'src_image' => tinyint,
     *  'title' => varchar,
     *  'price' => decimal,
     *  'currency' => varchar,
     *  'start_date' => timestamp,
     *  'end_date' => timestamp,
     * )    
     */
    public static function getRuleById ($id) 
    {   
        $sql = DB::table('cart_rule');
        $sql->select('cart_rule_detail.id_product as id_shopify_product', 'cart_rule_detail.is_main_product','cart_rule.id','cart_rule.name','cart_rule.code','cart_rule.status','cart_rule.reduction_percent',
                    'cart_rule.start_date','cart_rule.end_date','products.src_image as src','products.title','products.price', 'currency.currency');
        $sql->join('cart_rule_detail', 'cart_rule_detail.id_cart_rule', '=', 'cart_rule.id');
        $sql->join('products', 'products.id_shopify_product', '=', 'cart_rule_detail.id_product');
        $sql->join('currency', 'currency.id_shop', '=', 'cart_rule.id_shop');
        $sql->where('cart_rule.id', $id);
        $sql->groupBy('cart_rule_detail.id_product');
        return $sql->get()->toArray();
    }
  
    /**
     * @param int $id_cart_rule
     * @param int $reduction_percent
     * @param string $start_date
     * @param string $end_date
     * @return array
     * <pre>
     *  array (
     *  'id' => int,
     *  'id_shop' => int,
     *  'reduction_percent' => int,
     *  'id_product' => varchar,
     *  'is_main_product' => varchar,
     *  'name' => varchar,
     *  'code' => varchar,
     *  'status' => tinyint,
     *  'start_date' => timestamp,
     *  'end_date' => timestamp,
     * )    
     */
    public static function updateCartRule ($id_cart_rule, $reduction_percent, $start_date, $end_date) {
        $cart_rule = CartRule::find($id_cart_rule);
        $cart_rule->reduction_percent = $reduction_percent;
        $cart_rule->start_date = $start_date;
        $cart_rule->end_date = $end_date;
        $cart_rule->save();
        return $cart_rule;
    }

    /**
     * @param  int $id_shop
     */
    public static function deleteRule ($id_cart_rules) {
        DB::table('cart_rule')->whereIn('id', $id_cart_rules)->delete(); 
        DB::table('stats')->whereIn('id_cart_rule', $id_cart_rules)->delete(); 
        DB::table('cart_rule_detail')->whereIn('id_cart_rule', $id_cart_rules)->delete(); 
    }

    public static function getRuleByCode ($code) {
        return DB::table('cart_rule')->where('code', $code)->first();
    }
}
