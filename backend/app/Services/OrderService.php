<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\User;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\DB;

class OrderService
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function createOrder(Cart $cart, array $shippingData, ?User $user): Order
    {
        return DB::transaction(function () use ($cart, $shippingData, $user) {
            $this->inventoryService->validateAndLockStock($cart);

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'user_id' => $user?->id,
                'guest_email' => $shippingData['guest_email'] ?? null,
                'guest_phone' => $shippingData['guest_phone'] ?? null,
                'shipping_name' => $shippingData['shipping_name'],
                'shipping_phone' => $shippingData['shipping_phone'],
                'shipping_division' => $shippingData['shipping_division'],
                'shipping_district' => $shippingData['shipping_district'],
                'shipping_upazila' => $shippingData['shipping_upazila'],
                'shipping_street' => $shippingData['shipping_street'],
                'subtotal' => $cart->subtotal(),
                'discount_amount' => $cart->discountAmount(),
                'shipping_charge' => $shippingData['shipping_charge'] ?? 0,
                'total_amount' => $cart->total() + ($shippingData['shipping_charge'] ?? 0),
                'coupon_id' => $cart->coupon_id,
                'coupon_code' => $cart->coupon?->code,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $shippingData['payment_method'] ?? null,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'product_name' => $item->product->name,
                    'sku' => $item->variant ? $item->variant->sku : $item->product->sku,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->quantity * $item->unit_price,
                ]);

                $this->inventoryService->decrementStock($item->product_id, $item->variant_id, $item->quantity);
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => 'pending',
                'comment' => 'Order placed successfully',
                'changed_by_type' => $user ? 'user' : 'system',
                'changed_by_id' => $user?->id,
            ]);

            if ($cart->coupon) {
                // Register coupon usage
            }

            $cart->delete();

            return $order;
        });
    }

    public function generateOrderNumber(): string
    {
        $prefix = 'ORD-' . date('Ymd') . '-';
        $lastOrder = Order::where('order_number', 'like', $prefix . '%')->orderBy('id', 'desc')->first();
        if (!$lastOrder) {
            return $prefix . '00001';
        }
        $lastId = intval(substr($lastOrder->order_number, -5));
        return $prefix . str_pad($lastId + 1, 5, '0', STR_PAD_LEFT);
    }

    public function updateStatus(Order $order, string $status, ?string $comment = null, string $changedByType = 'admin', ?int $changedById = null)
    {
        $order->update(['status' => $status]);
        
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $status,
            'comment' => $comment,
            'changed_by_type' => $changedByType,
            'changed_by_id' => $changedById,
        ]);
        
        if ($status === 'cancelled') {
            $this->inventoryService->releaseStock($order);
        }
    }
}
