<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $today = Carbon::today();
        
        $totalRevenue = Order::whereNotIn('status', ['cancelled', 'failed'])->sum('total');
        $todayRevenue = Order::whereNotIn('status', ['cancelled', 'failed'])
                            ->whereDate('created_at', $today)
                            ->sum('total');
        
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        
        $totalCustomers = User::count();
        $totalProducts = Product::count();

        return response()->json([
            'success' => true,
            'message' => 'Dashboard stats retrieved',
            'data' => [
                'total_revenue' => $totalRevenue,
                'today_revenue' => $todayRevenue,
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'total_customers' => $totalCustomers,
                'total_products' => $totalProducts,
            ]
        ]);
    }

    public function revenueChart()
    {
        $last7Days = collect(range(6, 0))->map(function($days) {
            return Carbon::today()->subDays($days)->format('Y-m-d');
        });

        $revenueData = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as revenue')
            )
            ->where('created_at', '>=', Carbon::today()->subDays(6))
            ->whereNotIn('status', ['cancelled', 'failed'])
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $chart = $last7Days->map(function($date) use ($revenueData) {
            return [
                'date' => $date,
                'revenue' => isset($revenueData[$date]) ? (float) $revenueData[$date]->revenue : 0
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Revenue chart data retrieved',
            'data' => $chart
        ]);
    }

    public function recentOrders()
    {
        $orders = Order::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Recent orders retrieved',
            'data' => $orders
        ]);
    }
}
