<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Setting;
use App\Shop;
use DB;
use App\DashBoard;
use App\CartRule;

class DashBoardController extends Controller
{   
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getData (Request $request) 
    {
        $status = true;
        $msg = 'successfully';
        $data = array();
        $date_from = $request->date_from;
        $date_to = $request->date_to;
        $shop = Shop::getShopByDomain($request->shopify_domain);
        try{
            $summary_details = $this->getSummaryDetails($date_from, $date_to, $request->granularity, $shop->id);
            $data = array(
                'dashboard' => array(
                    'views' => $summary_details['views'],
                    'orders' => $summary_details['orders'],
                    'revenues' => $summary_details['revenues'],
                    'add_to_cart' => $summary_details['add_to_cart'],
                ),
                'detail' => DashBoard::getStastDetail($date_from, $date_to, $shop->id),
            );
        }
        catch(\Exception $e){
            $status = false;
            $msg = $e->getMessage();
        }
        return response()->json([
            'data' => $data,
            'message' => $msg,
            'status' => $status,
        ], 200); 
    }

    
    /**
     * @param $date_from
     * @param $date_to
     * @param $granularity
     * @return array
     */
    public function getSummaryDetails($date_from, $date_to, $granularity, $id_shop)
    {
        $summary_details = array(
            'views' => array(),
            'orders' => array(),
            'revenues' => array(),
            'add_to_cart' => array(),
        );
        $stats = DashBoard::getStast($date_from, $date_to, $granularity, $id_shop);
        $from = strtotime($date_from.' 00:00:00');
        $to = min(time(), strtotime($date_to.' 23:59:59'));
        switch ($granularity) {
            case 'day':
                for ($date = $from; $date <= $to; $date = strtotime('+1 day', $date)) {
                    $summary_details['views'][$date] = isset($stats[$date]['view']) ? $stats[$date]['view'] : 0;
                    $summary_details['orders'][$date] = isset($stats[$date]['order']) ? $stats[$date]['order'] : 0;
                    $summary_details['revenues'][$date] = isset($stats[$date]['sale']) ? $stats[$date]['sale'] : 0;
                    $summary_details['add_to_cart'][$date] = isset($stats[$date]['add_to_cart']) ? $stats[$date]['add_to_cart'] : 0;
                }
                break;
            case 'week':
                for ($date = $from; $date <= $to; $date = strtotime('+1 week', $date)) {
                    $summary_details['views'][$date] = isset($stats[$date]['view']) ? $stats[$date]['view'] : 0;
                    $summary_details['orders'][$date] = isset($stats[$date]['order']) ? $stats[$date]['order'] : 0;
                    $summary_details['revenues'][$date] = isset($stats[$date]['sale']) ? $stats[$date]['sale'] : 0;
                    $summary_details['add_to_cart'][$date] = isset($stats[$date]['add_to_cart']) ? $stats[$date]['add_to_cart'] : 0;
                }
                break;
            default:      
                for ($date = $from; $date <= $to; $date = strtotime('+1 month', $date)) {
                    $summary_details['views'][$date] = isset($stats[$date]['view']) ? $stats[$date]['view'] : 0;
                    $summary_details['orders'][$date] = isset($stats[$date]['order']) ? $stats[$date]['order'] : 0;
                    $summary_details['revenues'][$date] = isset($stats[$date]['sale']) ? $stats[$date]['sale'] : 0;
                    $summary_details['add_to_cart'][$date] = isset($stats[$date]['add_to_cart']) ? $stats[$date]['add_to_cart'] : 0;
                }
                break;
        }
        return $summary_details;
    }

    /**
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function addNumberToCart (Request $request) 
    {
        if($request->id_cart_rule && $request->id_shop){
            DashBoard::addNBCartRule($request->id_cart_rule, $request->id_shop, 'nb_add_to_cart');
        }
        return 1;
    }

    public function cloneOrder (Request $request) 
    {
        $order = json_decode(file_get_contents('php://input'));
        if($order->discount_codes){
            $cart_rule = CartRule::getRuleByCode($order->discount_codes[0]->code);
            if($cart_rule){
                DashBoard::addNBCartRule($cart_rule->id, $cart_rule->id_shop, 'nb_order');
                DashBoard::addNBCartRule($cart_rule->id, $cart_rule->id_shop, 'nb_sale', $order->total_price);
            }
        }
    }
}
