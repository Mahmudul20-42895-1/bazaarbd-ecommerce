<?php
namespace App\Http\Controllers\Api\V1\Wishlist;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
class WishlistController extends Controller {
    public function show(Request $request) {
        return response()->json(['success'=>true, 'data'=>[]]);
    }
}
