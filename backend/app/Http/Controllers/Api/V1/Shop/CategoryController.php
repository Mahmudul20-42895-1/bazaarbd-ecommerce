<?php

namespace App\Http\Controllers\Api\V1\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Categories retrieved successfully',
            'data' => $categories
        ]);
    }

    public function show($slug, Request $request)
    {
        $category = Category::with('children')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
            
        $products = $category->products()
            ->with(['images', 'brand'])
            ->where('is_active', true)
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Category details retrieved successfully',
            'data' => [
                'category' => $category,
                'products' => $products
            ]
        ]);
    }
}
