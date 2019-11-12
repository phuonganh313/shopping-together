<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/uninstall',['as'=>'uninstall', 'uses'=>'AuthController@uninstall']);
Route::post('/product/save','ProductController@save');
Route::post('/product/delete','ProductController@delete');
Route::post('/setting/init', 'SettingController@init');
Route::post('/setting/save', 'SettingController@save');
Route::post('/setting/get', 'SettingController@get');

Route::post('/product/search', 'ProductController@search');
Route::post('/product/get-list', 'ProductController@renderList');
Route::post('/product/get', 'ProductController@get');
Route::post('/cart-rule/save', 'CartRuleController@save');
Route::post('/product/clone', 'AuthController@cloneProducts');
Route::post('/cart-rule/get', 'CartRuleController@get');
Route::post('/cart-rule/get-list', 'CartRuleController@getRulesList');
Route::post('/cart-rule/search', 'CartRuleController@search');
Route::post('/dashboard', 'DashBoardController@getData');
Route::post('/cart-rule/delete', 'CartRuleController@deleteRule');
Route::post('/cart-rule/change-status', 'CartRuleController@changeStatus');

Route::post('/get-setting', 'SettingController@getSetting');
Route::post('/cart-rule/add-to-cart/', 'DashBoardController@addNumberToCart');
Route::post('/cart-rule/get-detail', 'CartRuleController@getDetail');
Route::post('/cart-rule/update', 'CartRuleController@updateCartRule');
Route::post('/order/create', 'DashBoardController@cloneOrder');