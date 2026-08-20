<?php
namespace App\Http\Controllers\Api\V1\Review;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
class ReviewController extends Controller {
    public function productReviews(Request $request, $product) { return response()->json(['success'=>true, 'data'=>[]]); }
}
