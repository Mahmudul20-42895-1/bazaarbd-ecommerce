<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['user', 'product']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reviews = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'message' => 'Reviews retrieved successfully',
            'data' => $reviews
        ]);
    }

    public function approve(Request $request, Review $review)
    {
        $review->update(['status' => 'approved']);

        // Update product average rating
        $product = $review->product;
        $avgRating = $product->reviews()->where('status', 'approved')->avg('rating');
        $product->update(['rating' => $avgRating]);

        return response()->json([
            'success' => true,
            'message' => 'Review approved successfully'
        ]);
    }

    public function reject(Request $request, Review $review)
    {
        $review->update(['status' => 'rejected']);

        return response()->json([
            'success' => true,
            'message' => 'Review rejected successfully'
        ]);
    }
}
