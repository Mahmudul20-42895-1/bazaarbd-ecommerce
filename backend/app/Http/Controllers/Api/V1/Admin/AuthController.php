<?php
namespace App\Http\Controllers\Api\V1\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller {
    public function login(Request $request) {
        $request->validate(['email'=>'required|email','password'=>'required']);
        if (Auth::guard('admin')->attempt($request->only('email','password'))) {
            $admin = Auth::guard('admin')->user();
            if ($admin->status !== 'active') {
                Auth::guard('admin')->logout();
                return response()->json(['success'=>false,'message'=>'Account disabled'], 403);
            }
            $token = $admin->createToken('admin-token', ['admin'])->plainTextToken;
            return response()->json(['success'=>true,'data'=>['admin'=>$admin,'token'=>$token]]);
        }
        return response()->json(['success'=>false,'message'=>'Invalid credentials'], 401);
    }
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success'=>true,'message'=>'Logged out']);
    }
    public function me(Request $request) {
        return response()->json(['success'=>true,'data'=>$request->user()]);
    }
}
