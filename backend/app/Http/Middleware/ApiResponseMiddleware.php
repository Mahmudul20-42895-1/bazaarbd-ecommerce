<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApiResponseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($response instanceof JsonResponse) {
            $data = $response->getData(true);
            
            // Avoid double wrapping
            if (isset($data['success']) && array_key_exists('message', $data)) {
                return $response;
            }

            $isSuccessful = $response->isSuccessful();
            
            $wrappedData = [
                'success' => $isSuccessful,
                'message' => $isSuccessful ? 'Success' : 'Error',
                'data' => $data
            ];

            $response->setData($wrappedData);
        }

        return $response;
    }
}
