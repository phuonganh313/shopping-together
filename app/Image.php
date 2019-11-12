<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'images';
    protected $fillable=['id_image','id_product','id_shop','src','updated_at','created_at'];
    
    /**
     * @param
     * array(
     *  array (
     *  'id_image' => string,
     *  'id_product' => string,
     *  'id_shop' => int,
     *  'src' => string,
     * ))
     */
    public static function saveImage($array_img){
        DB::table('images')->insert($array_img);
    }   
}
