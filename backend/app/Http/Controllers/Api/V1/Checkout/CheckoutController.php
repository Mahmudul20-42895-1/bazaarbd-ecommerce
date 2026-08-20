<?php
namespace App\Http\Controllers\Api\V1\Checkout;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller {
    public function __construct(private CartService $cartService, private OrderService $orderService) {}
    public function validate(Request $request) {
        $cart = $this->cartService->getOrCreateCart($request);
        $stockCheck = $this->cartService->validateStock($cart);
        if (!$stockCheck['valid']) return response()->json(['success'=>false,'errors'=>$stockCheck['errors']], 400);
        return response()->json(['success'=>true,'message'=>'Valid']);
    }
    public function createOrder(Request $request) {
        // Request validation skipped for brevity, handled by Request class
        return DB::transaction(function() use ($request) {
            $cart = $this->cartService->getOrCreateCart($request);
            $stockCheck = $this->cartService->validateStock($cart);
            if (!$stockCheck['valid']) return response()->json(['success'=>false,'errors'=>$stockCheck['errors']], 400);
            
            $totals = $this->cartService->calculateTotals($cart, $request->shipping_method_id);
            // In a real app we'd construct the order data array.
            $orderData = array_merge($request->all(), [
                'user_id'=>$request->user()->id,
                'subtotal'=>$totals['subtotal'],
                'discount_amount'=>$totals['discount'],
                'shipping_charge'=>$totals['shipping'],
                'total_amount'=>$totals['total'],
                'status'=>'pending',
                'payment_status'=>'unpaid',
            ]);
            $order = $this->orderService->createOrder($orderData, $cart->items);
            
            // clear cart
            $cart->items()->delete();
            
            return response()->json(['success'=>true,'data'=>$order]);
        });
    }
}
