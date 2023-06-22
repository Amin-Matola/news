<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response as FacadesResponse;
use Symfony\Component\HttpFoundation\Response;

class NewsCors
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param  Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request)->withHeaders([
            "Access-Control-Allow-Origin" => "*",
            "Access-Control-Allow-Headers" => "Content-Type, X-Auth-Token, Authorization, Origin",
            "Access-Control-Allow-Methods" => "POST, PUT"
        ]);
    }
}
