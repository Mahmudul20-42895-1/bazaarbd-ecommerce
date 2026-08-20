<?php

namespace App\Http\Controllers\Api\V1\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2'
        ]);

        $searchTerm = '%' . $request->q . '%';

        $products = Product::with(['category', 'images'])
            ->where('is_active', true)
            ->where(function($query) use ($searchTerm) {
                $query->where('name', 'LIKE', $searchTerm)
                      ->orWhere('description', 'LIKE', $searchTerm)
                      ->orWhereHas('category', function($q) use ($searchTerm) {
                          $q->where('name', 'LIKE', $searchTerm);
                      })
                      ->orWhereHas('brand', function($q) use ($searchTerm) {
                          $q->where('name', 'LIKE', $searchTerm);
                      });
            })
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Search results retrieved',
            'data' => $products
        ]);
    }
}
