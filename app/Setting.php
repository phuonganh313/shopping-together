<?php

namespace App;
use DB;

use Illuminate\Database\Eloquent\Model;
 
class Setting extends Model
{
     /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'settings';
    protected $fillable=['id','id_shop', 'product_font_family', 'product_font_style', 'product_font_color', 'amount_font_family', 'amount_font_style',
    'amount_font_color', 'new_price_font_family', 'new_price_font_style', 'new_price_font_color','old_price_font_family', 'old_price_font_style',
    'old_price_font_color', 'title_font_family', 'title_font_style','title_font_color', 'cart_font_family','cart_font_style', 'cart_font_color',
    'back_ground_color', 'product_text', 'cart_text','active_PC', 'active_mobile', 'show_product_qty', 'created_at','updated_at' ];

    /**
     * @param int $shop_id
     * @return array
     * <pre>
     *  array (
     *  'id' => int,
     *  'id_shop' => int,
     *  'product_font_family' => enum,
     *  'product_font_style' => enum,
     *  'product_font_color' => varchar,
     *  'amount_font_family' => enum,
     *  'amount_font_style' => enum,
     *  'amount_font_color' => varchar,
     *  'new_price_font_family' => enum,
     *  'new_price_font_style' => enum,
     *  'new_price_font_color' => varchar,
     *  'old_price_font_family' => enum,
     *  'old_price_font_style' => enum,
     *  'old_price_font_color' => varchar,
     *  'title_font_family' => enum,
     *  'title_font_style' => enum,
     *  'title_font_color' => varchar,
     *  'cart_font_family' => enum,
     *  'cart_font_style' => enum,
     *  'cart_font_color' => varchar,
     *  'back_ground_color' => varchar,
     *  'cart_text' => varchar,
     *  'product_text' => varchar,
     *  'active_PC' => tinyint,
     *  'active_mobile' => tinyint,
     *  'show_product_qty' => int,
     *  'start_date' => timestamp,
     *  'end_date' => timestamp,
     * )    
     */
    public static function getSettingByShopId($shop_id){
        return DB::table('settings')->where('id_shop', $shop_id)->first();
    }
}