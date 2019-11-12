<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class DashBoard extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'stats';
    protected $fillable=['id_shop','id_cart_rule','nb_view','nb_order','nb_sale','nb_add_to_cart','updated_at','created_at'];

    /**
     * @param $date_from
     * @param $date_to
     * @return array
     */
    public static function getStastDetail ($date_from, $date_to, $id_shop) {
        $sql = DB::table('stats');
        $sql->select('cart_rule.name');
        $sql->selectRaw('SUM(nb_view) as total_view');
        $sql->selectRaw('SUM(nb_order) as total_order');
        $sql->selectRaw('SUM(nb_sale) as total_sale');
        $sql->selectRaw('SUM(nb_add_to_cart) as total_add_to_cart');
        $sql->join('cart_rule', 'cart_rule.id', '=', 'stats.id_cart_rule');
        $sql->where('stats.id_shop', $id_shop);
        $sql->whereBetween('stats.created_at',["$date_from 00:00:00", "$date_to 23:59:59"]);
        $sql->groupBy('stats.id_cart_rule');
        $sql->orderBy('nb_sale', 'DESC');
        $sql->limit(10);
        return $sql->get()->toArray();
    }

    /**
     * @param $date_from
     * @param $date_to
     * @param $granularity
     * @return array
     */
    public static function getStast($date_from, $date_to, $granularity, $id_shop)
    {
        $stats = array();
        $sql = DB::table('stats');
        $sql->selectRaw('SUM(nb_view) as total_view');
        $sql->selectRaw('SUM(nb_order) as total_order');
        $sql->selectRaw('SUM(nb_sale) as total_sale');
        $sql->selectRaw('SUM(nb_add_to_cart) as total_add_to_cart');
        $sql->selectRaw('LEFT(created_at, 10) as date');
        $sql->where('stats.id_shop', $id_shop);
        $sql->whereBetween('created_at',["$date_from 00:00:00", "$date_to 23:59:59"]);
        switch ($granularity) {
            case 'day':
                $sql->groupBy(DB::raw('LEFT(`created_at`, 10)'));
                break;
            case 'week':
                $sql->groupBy(DB::raw('WEEK(`created_at`, 1)'));
                break;
            default:
                $sql->groupBy(DB::raw('MONTH(`created_at`)'));
                break;
        }

        $results = $sql->get()->toArray();
        foreach ($results as $result) {
            switch ($granularity) {
                case 'day':
                    $stats[strtotime($result->date)]['view'] = (float) $result->total_view;
                    $stats[strtotime($result->date)]['order'] = (float) $result->total_order;
                    $stats[strtotime($result->date)]['sale'] = (float) $result->total_sale;
                    $stats[strtotime($result->date)]['add_to_cart'] = (float) $result->total_add_to_cart;
                    break;
                case 'week':
                    $date = strtotime(date('Y-m-d', strtotime('monday this week', strtotime($result->date))));
                    $stats[$date]['view'] = (int) $result->total_view;
                    $stats[$date]['order'] = (int) $result->total_order;
                    $stats[$date]['sale'] = (float) $result->total_sale;
                    $stats[$date]['add_to_cart'] = (float) $result->total_add_to_cart;
                    break;
                default:
                    $date = strtotime(date('Y-m', strtotime($result->date)));
                    $stats[$date]['view'] = (int) $result->total_view;
                    $stats[$date]['order'] = (int) $result->total_order;
                    $stats[$date]['sale'] = (float) $result->total_sale;
                    $stats[$date]['add_to_cart'] = (float) $result->total_add_to_cart;
                    break;
            }
        }
        return $stats;
    }

    /**
     * @param int $id_cart_rule
     * @param int $id_shop
     * @param $field
     */
    public static function addNBCartRule ($id_cart_rule, $id_shop, $field, $sale = null)   
    {   
        $curent_date = date('Y-m-d');
        $stats = DB::table('stats');
        $stats->where('id_cart_rule', $id_cart_rule);
        $stats->where('id_shop', $id_shop);
        $stats->whereBetween('created_at', ["$curent_date 00:00:00", "$curent_date 23:59:59"]);
        $stats_nb = $stats->first();
        if($stats_nb){
            $new_stast = DashBoard::find($stats_nb->id);
            $new_stast->$field = $sale ? ((float)$stats_nb->$field + (float)$sale) : $stats_nb->$field + 1;
            $new_stast->save();
        }else{
            $stats = new DashBoard();
            $stats->id_shop = $id_shop;
            $stats->id_cart_rule = $id_cart_rule;
            $stats->$field = $sale ? $sale : 1;
            $stats->created_at = date('Y-m-d H:i:s');
            $stats->updated_at = date('Y-m-d H:i:s');
            $stats->save();
        }
    }
}