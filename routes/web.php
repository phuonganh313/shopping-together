<?php
use App\Product;
use App\Image;
use App\Variant;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

if(config('shopify-app.mode')){
    Route::group(['middleware' => ['auth.shop', 'billable']], function () {
        Route::get('/', function () {
            return view('app');
        });
        Route::get('/stats', function () {
            return view('app');
        });
        Route::get('/manage', function () {
            return view('app');
        });
        Route::get('/cart-rule/add', function () {
            return view('app');
        });
        Route::get('/cart-rule/edit/{p}', function () {
            return view('app');
        });
        Route::get('/home', 'SettingController@index')->name('home');
    });
}else{
    
    Route::get('/', function () {
        return view('app');
    });
    Route::get('/stats', function () {
        return view('app');
    });
    Route::get('/manage', function () {
        return view('app');
    });
    Route::get('/cart-rule/add', function () {
        return view('app');
    });
    Route::get('/cart-rule/edit/{p}', function () {
        return view('app');
    });
    Route::get('/home', 'SettingController@index')->name('home');
}

Route::match(
    ['get', 'post'],
    '/authenticate',
    'AuthController@authenticate'
)
->name('authenticate');

Route::get(
    '/install',
    'AuthController@index'
)->name('login');
