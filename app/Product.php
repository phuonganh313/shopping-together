<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;
use App\Variant;
use App\Image;

class Product extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'products';
    protected $fillable=['id','id_shopify_product','id_shop','title','created_at','updated_at','handle','price','quantity'];
    
    /**
     * @param
     * array(
     *  array (
     *  'id_shopify_product' => string,
     *  'id_shop' => int,
     *  'title' => string,
     *  'handle' => string,
     *  'src_img' => string,
     * ))
     */
    public static function saveProduct($array_products){
        return DB::table('products')->insert($array_products);
    }   

    /**
     * @param string $id_shopify_product
     * @return array
     * <pre>
     * array (
     *  'id' => int,
     *  'id_shopify_product' => int,
     *  'id_shop' => varchar,
     *  'title' => varchar,
     *  'handle' => varchar,
     *  'created_at' => timestamp,
     *  'updated_at' => timestamp
     * )
     */
    public static function getProduct($id_shopify_product){
        return DB::table('products')->where('id_shopify_product', $id_shopify_product)->get();
    }

    /**
     * @param int $id_shop
     * @return array
     * <pre>
     * array (
     *  'id' => int,
     *  'id_shopify_product' => int,
     *  'id_shop' => varchar,
     *  'title' => varchar,
     *  'handle' => varchar,
     *  'created_at' => timestamp,
     *  'updated_at' => timestamp
     * )
     */
    public static function getFirstProduct($id_shop){
        $sql = DB::table('products');
        $sql->where('id_shop', $id_shop);
        $sql->orderBy('title', 'ASC');
        return $sql->first();
    }
    
    /**
     * @param int $page_number
     * @param int $items_per_page
     * @return array
     * <pre>
     *  array (
     *  'page_limit' => int,
     *  'current_page' => int,
     *  'items_per_page' => string,
     *  'handle' => string,
     *  'total_items' => string,
     *  'items' => array(
     *      'title' => string,
     *       ......
     *  )
     * )
     */
    public static function getProducts($page_number, $items_per_page, $id_shop, $is_main_product = false)
    {
        $data = [];
        $query = DB::table('products');
        $query->select('products.id','products.quantity', 'products.id_shopify_product', 'products.title', 'products.src_image as src', 'products.price', 'currency.currency');
        $query->join('currency', 'currency.id_shop', '=', 'products.id_shop');
        $query->where('products.id_shop', $id_shop);
        if($is_main_product){
            $query->whereNotIn('products.id_shopify_product', function($q) use ($id_shop){
                $q->select('id_product')->from('cart_rule')->where('id_shop', $id_shop);
            });
        }
        $query->groupBy('products.id_shopify_product');
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
     * @param string $id_shopify_product
     * @return array
     * <pre>
     *  array (
     *  'title' => string,
     *  'src' => varchar,
     *  'price' => varchar,
     *  'option1' => varchar,
     *  'option1' => varchar,
     *  'option1' => varchar,
     * )    
     */
    public static function get($id_shopify_product){
        return DB::table('products')
                    ->select('products.title', 'products.quantity', 'products.id_shopify_product', 'products.src_image as src', 'variants.price', 'variants.option1', 
                            'variants.option2', 'variants.option3')
                    ->join('variants', 'products.id_shopify_product', '=', 'variants.id_product')
                    ->where('id_shopify_product', $id_shopify_product)
                    ->first();
    }
    

    /**
     * @param int $page_number
     * @param int $items_per_page
     * @param string $key_word
     * @param int $id_shop
     * @return array
     * <pre>
     *  array (
     *  'page_limit' => int,
     *  'current_page' => int,
     *  'items_per_page' => string,
     *  'handle' => string,
     *  'total_items' => string,
     *  'items' => array(
     *      'title' => string,
     *       ......
     *  )
     * )
     */
    public static function search($key_word, $page_number, $items_per_page, $id_shop, $is_main_product = false){
        $data = [];
        $query =  DB::table('products');
        $query->select('products.id', 'products.id_shopify_product', 'products.quantity', 'products.title', 'products.src_image as src', 'variants.price', 'currency.currency');
        $query->join('variants', 'variants.id_product', '=', 'products.id_shopify_product');
        $query->join('currency', 'currency.id_shop', '=', 'products.id_shop');
        $query->where('products.id_shop', $id_shop);
        if($is_main_product){
            $query->whereNotIn('products.id_shopify_product', function($q) use ($id_shop){
                $q->select('id_product')->from('cart_rule')->where('id_shop', $id_shop);
            });
        }
        $query->where('products.title', 'like', '%'.$key_word.'%');
        $query->groupBy('products.id_shopify_product');
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
     * @param array $products
     * @param int $id_shop
     */
    public static function cloneProducts ($products, $id_shop) {
        if($products){
            foreach($products as $product){
                self::importProduct($product, $id_shop);
            }
        }
    }

     /**
     * @param object $product
     * @param int $id_shop
     */
    public static function importProduct ($product, $id_shop) {
        $arr_products = array();
        $arr_variants  = array();
        $arr_imgs= array();
        $qty = 0;
        foreach($product->variants as $value){
            $arr_variants[] = array(
                'id_variant' => (string)$value->id,
                'id_product' => (string)$value->product_id,
                'id_shop' => $id_shop,
                'title' => $value->title,
                'price' => $value->price,
                'product_name' => $product->title,
                'option1' => $value->option1,
                'option2' => $value->option2,
                'option3' => $value->option3,
                'quantity' => ($value->inventory_management == "shopify") ? (($value->inventory_policy == "deny") ? $value->inventory_quantity : 10) : 1000,
                'id_image' => isset($value->image_id) ? (string)$value->image_id : (isset($product->image) ? (string)$product->image->id : ''),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            );
            $qty += ($value->inventory_management == "shopify") ? (($value->inventory_policy == "deny") ? $value->inventory_quantity : 10) : 10;
        }
        if($product->images){
            foreach($product->images as $value){
                $arr_imgs[] = array(
                    'id_image' => (string)$value->id,
                    'id_product' => (string)$value->product_id,
                    'src' => $value->src,
                    'id_shop'=> $id_shop,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                );
            }
        }
        $arr_products[] = array(
            'id_shopify_product' => (string)$product->id,
            'id_shop' => $id_shop,
            'title' => $product->title,
            'handle' => $product->handle,
            'src_image' => isset($product->image) ? $product->image->src : '',
            'price' => ($product->variants)[0]->price,
            'quantity' => $qty,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        );
        Product::saveProduct($arr_products);
        Variant::saveVariant($arr_variants);
        if($arr_imgs){
            Image::saveImage($arr_imgs);
        }
    }

    /**
     * @param int $id_product
     */
    public static function deleteProduct ($id_product) {
        DB::table('products')->where('id_shopify_product', (string)$id_product)->delete();
        DB::table('variants')->where('id_product', (string)$id_product)->delete();
        DB::table('images')->where('id_product', (string)$id_product)->delete();
    }
}
