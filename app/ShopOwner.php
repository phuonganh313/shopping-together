<?php

namespace App;
use DB;

use Illuminate\Database\Eloquent\Model;

class ShopOwner extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'shop_owner';
    protected $fillable=['id','name','email','phone','address','created_at','updated_at'];

    /**
     * Relationship: shops
     * @return Collection Shops
     */
    public function shops() {
        return $this->hasMany('App\Shop','id_shop_owner');
    }

    /**
     * @param string $email
     * @return array
     * <pre>
     * array (
     *  'id' => int,
     *  'name' => string,
     *  'email' => string,
     *  'address' => string,
     *  'phone' => int,
     *  'created_at' => timestamp,
     *  'updated_at' => timestamp
     * )
     */
    public static function getShopOwnerByDomain($email){
        return DB::table('shop_owner')->where('email', $email)->first();
    }

    /**
     * @param string $shop_owner_id
     * @return array
     * <pre>
     * array (
     *  'id' => int,
     *  'name' => string,
     *  'email' => string,
     *  'address' => string,
     *  'phone' => varchar,
     *  'created_at' => timestamp,
     *  'updated_at' => timestamp
     * )
     */
    public static function getShopOwnerByShopId($shop_owner_id){
        return DB::table('shop_owner')->where('id', $shop_owner_id)->first();
    }
}
