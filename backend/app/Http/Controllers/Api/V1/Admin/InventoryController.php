<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function lowStock(Request $request)
    {
        $threshold = $request->get('threshold', 10);
        
        $products = Product::where('stock_quantity', '<=', $threshold)
            ->with(['category', 'brand'])
            ->orderBy('stock_quantity', 'asc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'message' => 'Low stock products retrieved',
            'data' => $products
        ]);
    }

    public function restock(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $product->increment('stock_quantity', $request->quantity);

        return response()->json([
            'success' => true,
            'message' => 'Product restocked successfully',
            'data' => $product
        ]);
    }
}
