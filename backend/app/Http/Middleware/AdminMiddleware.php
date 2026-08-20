<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class AdminMiddleware {
    public function handle(Request $request, Closure $next) {
        $user = $request->user();
        if (!$user || !($user instanceof \App\Models\Admin)) {
            return response()->json(['success'=>false,'message'=>'Unauthorized. Admin access required.'], 403);
        }
        if ($user->status !== 'active') {
            return response()->json(['success'=>false,'message'=>'Your admin account is inactive.'], 403);
        }
        return $next($request);
    }
}
