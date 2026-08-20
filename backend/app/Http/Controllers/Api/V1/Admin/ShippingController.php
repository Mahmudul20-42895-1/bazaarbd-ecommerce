<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingZone;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    public function index()
    {
        $zones = ShippingZone::all();

        return response()->json([
            'success' => true,
            'message' => 'Shipping zones retrieved successfully',
            'data' => $zones
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'cities' => 'required|array', // List of cities in Bangladesh
            'rate' => 'required|numeric|min:0',
            'estimated_days' => 'required|string|max:50'
        ]);

        $zone = ShippingZone::create([
            'name' => $request->name,
            'cities' => json_encode($request->cities),
            'rate' => $request->rate,
            'estimated_days' => $request->estimated_days
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Shipping zone created successfully',
            'data' => $zone
        ], 201);
    }

    public function show(ShippingZone $shippingZone)
    {
        $shippingZone->cities = json_decode($shippingZone->cities);
        
        return response()->json([
            'success' => true,
            'message' => 'Shipping zone retrieved',
            'data' => $shippingZone
        ]);
    }

    public function update(Request $request, ShippingZone $shippingZone)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'cities' => 'required|array',
            'rate' => 'required|numeric|min:0',
            'estimated_days' => 'required|string|max:50'
        ]);

        $shippingZone->update([
            'name' => $request->name,
            'cities' => json_encode($request->cities),
            'rate' => $request->rate,
            'estimated_days' => $request->estimated_days
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Shipping zone updated successfully',
            'data' => $shippingZone
        ]);
    }

    public function destroy(ShippingZone $shippingZone)
    {
        $shippingZone->delete();

        return response()->json([
            'success' => true,
            'message' => 'Shipping zone deleted successfully'
        ]);
    }
}
