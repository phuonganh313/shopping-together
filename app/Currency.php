<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'currency';
    protected $fillable=['id_shop','currency','updated_at','created_at'];

}