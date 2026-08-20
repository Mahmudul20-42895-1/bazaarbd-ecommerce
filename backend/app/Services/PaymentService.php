<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    protected $sslCommerz;
    protected $orderService;

    public function __construct(SSLCommerzService $sslCommerz, OrderService $orderService)
    {
        $this->sslCommerz = $sslCommerz;
        $this->orderService = $orderService;
    }

    public function initiate(Order $order, string $method)
    {
        $customerData = [
            'name' => $order->user ? $order->user->name : $order->shipping_name,
            'email' => $order->user ? $order->user->email : $order->guest_email,
            'phone' => $order->shipping_phone,
            'address' => $order->shipping_street,
            'city' => $order->shipping_district,
        ];

        $initData = $this->sslCommerz->initiatePayment($order, $customerData);

        DB::transaction(function () use ($order, $initData, $method) {
            $payment = Payment::create([
                'order_id' => $order->id,
                'transaction_id' => $initData['tran_id'],
                'gateway' => 'sslcommerz',
                'method' => $method,
                'amount' => $order->total_amount,
                'status' => 'pending',
            ]);

            PaymentTransaction::create([
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'type' => 'initiation',
                'payload' => $initData,
                'ip_address' => request()->ip(),
            ]);
        });

        return $initData['gateway_url'];
    }

    public function handleSuccess(array $postData)
    {
        $tranId = $postData['tran_id'] ?? null;
        $valId = $postData['val_id'] ?? null;
        
        if (!$tranId || !$valId) {
            throw new \Exception('Invalid success response');
        }

        $payment = Payment::where('transaction_id', $tranId)->firstOrFail();
        if ($payment->status === 'paid') {
            return $payment->order; // Already processed
        }

        $validation = $this->sslCommerz->validatePayment($valId);
        
        if (isset($validation['status']) && ($validation['status'] === 'VALID' || $validation['status'] === 'VALIDATED')) {
            DB::transaction(function () use ($payment, $validation, $postData) {
                $payment->update([
                    'status' => 'paid',
                    'gateway_transaction_id' => $validation['bank_tran_id'] ?? null,
                    'method' => $validation['card_type'] ?? $payment->method,
                    'paid_at' => now(),
                    'gateway_response' => $validation,
                ]);

                PaymentTransaction::create([
                    'payment_id' => $payment->id,
                    'order_id' => $payment->order_id,
                    'type' => 'validation',
                    'payload' => $postData,
                    'response' => $validation,
                ]);

                $this->orderService->updateStatus($payment->order, 'confirmed', 'Payment received via SSLCOMMERZ', 'system');
            });
            return $payment->order;
        }

        throw new \Exception('Payment validation failed');
    }

    public function handleFail(array $postData)
    {
        $tranId = $postData['tran_id'] ?? null;
        if ($tranId) {
            $payment = Payment::where('transaction_id', $tranId)->first();
            if ($payment) {
                $payment->update(['status' => 'failed', 'failed_at' => now(), 'gateway_response' => $postData]);
            }
        }
    }
}
