<?php

namespace App\Http\Controllers\Api\V1\Order;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function process(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|in:cod,sslcommerz'
        ]);

        $user = $request->user();
        $cart = Cart::with(['items.product', 'coupon'])->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'Cart is empty'], 400);
        }

        $address = Address::where('id', $request->address_id)->where('user_id', $user->id)->firstOrFail();

        try {
            DB::beginTransaction();

            $subtotal = $cart->items->sum(function($item) {
                return $item->quantity * $item->product->price;
            });

            $discount = 0;
            if ($cart->coupon) {
                if ($cart->coupon->type === 'fixed') {
                    $discount = $cart->coupon->value;
                } elseif ($cart->coupon->type === 'percentage') {
                    $discount = ($subtotal * $cart->coupon->value) / 100;
                }
                // Increment coupon usage
                $cart->coupon->increment('used_count');
            }

            $shippingCost = 60; // Example flat rate
            $total = max(0, $subtotal - $discount) + $shippingCost;

            $orderNumber = 'ORD-' . strtoupper(Str::random(10));

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $orderNumber,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'shipping_address' => json_encode($address->toArray()),
                'payment_method' => $request->payment_method
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price
                ]);
                
                // Deduct stock
                $item->product->decrement('stock_quantity', $item->quantity);
            }

            // Clear cart
            $cart->items()->delete();
            $cart->update(['coupon_id' => null]);

            DB::commit();

            if ($request->payment_method === 'sslcommerz') {
                $payment = Payment::create([
                    'order_id' => $order->id,
                    'amount' => $total,
                    'status' => 'pending',
                    'transaction_id' => uniqid('TXN_')
                ]);
                
                // In real app, initialize SSLCommerz here and return payment URL
                $paymentUrl = env('APP_URL') . '/api/v1/payment/mock-redirect?trx=' . $payment->transaction_id;
                
                return response()->json([
                    'success' => true,
                    'message' => 'Order created. Redirect to payment.',
                    'data' => ['order' => $order, 'payment_url' => $paymentUrl]
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => ['order' => $order]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Checkout failed: ' . $e->getMessage()], 500);
        }
    }
}
