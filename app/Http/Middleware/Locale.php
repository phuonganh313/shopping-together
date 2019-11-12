<?php

namespace App\Http\Middleware;

use Closure;
use Lang;
use Session;

class Locale
{
    public function handle($request, Closure $next)
    {
        if (!Session::has('locale')) {
            Session::put('locale', config('app.locale'));
        }

        Lang::setLocale(Session::get('locale'));

        return $next($request);
    }
}