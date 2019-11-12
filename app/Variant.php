<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'variants';
    protected $fillable=['id_variant','id_product','id_shop','product_name','title','created_at','updated_at','price','option1','option2','option3','currency_code','quantity', 'id_image'];
    
    /**
     * @param
     * array(
     *  array (
     *  'id_variant' => string,
     *  'id_product' => int,
     *  'title' => string,
     *  'price' => string,
     *  'option1' => string,
     *  'option2' => string,
     *  'option3' => string,
     *  'currency_code' => string,
     *  'quantity' => string,
     * ))
     */
    public static function saveVariant($array_variants){
        DB::table('variants')->insert($array_variants);
    }   
    
    
    /**
     * @param
     * array(
     *  array (
     *  'id_variant' => string,
     *  'id_product' => int,
     *  'title' => string,
     *  'price' => string,
     *  'option1' => string,
     *  'option2' => string,
     *  'option3' => string,
     *  'currency_code' => string,
     *  'quantity' => string,
     * ))
     */
    public static function updatedVariant($id_variants, $array_variants){
        DB::table('variants')->whereIn('id_variant', $id_variants)->update($array_variants);
    }       

    /**
     * @param string $id_product
     * @return array
     * <pre>
     *  array (
     *  'handle' => string,
     *  'product_name' => string,
     *  'title' => string,
     *  'price' => float,
     *  'id_variant' => string,
     *  'id_image' => string,
     *  'src' => string,
     * )    
     */
    public static function getVariant($id_product) {
        $sql = DB::table('variants');
        $sql->select('products.handle','variants.product_name', 'variants.title', 'variants.price','variants.id_variant', 'variants.id_image', 'images.src');
        $sql->join('products', 'products.id_shopify_product', '=', 'variants.id_product');
        $sql->join('images', 'images.id_image', '=', 'variants.id_image');
        $sql->where('variants.id_product', $id_product);
        return $sql->get()->toArray();
    }


     /**
     * @param string $id_product
     * @return array
     * <pre>
     *  array (
     *  'option1' => string,
     *  'option1' => string,
     *  'option1' => string,
     *  'title' => string,
     * )    
     */
    public static function getOptions ($id_product) {
        $sql = DB::table('variants');
        $sql->select('option1', 'option2', 'option3', 'title');
        $sql->where('variants.id_product', $id_product);
        return $sql->get()->toArray();
    }
}
