<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SSLCommerzService
{
    protected $storeId;
    protected $storePass;
    protected $isSandbox;
    protected $apiUrl;

    public function __construct()
    {
        $this->storeId = config('sslcommerz.store_id');
        $this->storePass = config('sslcommerz.store_password');
        $this->isSandbox = config('sslcommerz.is_sandbox', true);
        
        $this->apiUrl = $this->isSandbox 
            ? 'https://sandbox.sslcommerz.com' 
            : 'https://securepay.sslcommerz.com';
    }

    public function initiatePayment(Order $order, array $customerData)
    {
        $postData = [
            'store_id' => $this->storeId,
            'store_passwd' => $this->storePass,
            'total_amount' => $order->total_amount,
            'currency' => 'BDT',
            'tran_id' => $order->order_number . '_' . uniqid(),
            'success_url' => config('sslcommerz.success_url'),
            'fail_url' => config('sslcommerz.fail_url'),
            'cancel_url' => config('sslcommerz.cancel_url'),
            'ipn_url' => config('sslcommerz.ipn_url'),
            
            // Customer Info
            'cus_name' => $customerData['name'],
            'cus_email' => $customerData['email'] ?? 'guest@example.com',
            'cus_add1' => $customerData['address'] ?? 'Dhaka',
            'cus_city' => $customerData['city'] ?? 'Dhaka',
            'cus_postcode' => $customerData['postcode'] ?? '1000',
            'cus_country' => 'Bangladesh',
            'cus_phone' => $customerData['phone'],
            
            // Shipment Info
            'shipping_method' => 'YES',
            'ship_name' => $order->shipping_name,
            'ship_add1' => $order->shipping_street,
            'ship_city' => $order->shipping_district,
            'ship_country' => 'Bangladesh',
            
            // Product Profile
            'product_name' => 'E-commerce Goods',
            'product_category' => 'General',
            'product_profile' => 'general',
        ];

        try {
            $response = Http::asForm()->post("{$this->apiUrl}/gwprocess/v4/api.php", $postData);
            $result = $response->json();

            if (isset($result['status']) && $result['status'] === 'SUCCESS') {
                return [
                    'status' => 'success',
                    'gateway_url' => $result['GatewayPageURL'],
                    'tran_id' => $postData['tran_id'],
                ];
            }

            Log::error('SSLCOMMERZ Init Failed', ['response' => $result]);
            throw new \Exception($result['failedreason'] ?? 'Failed to initiate payment gateway');

        } catch (\Exception $e) {
            Log::error('SSLCOMMERZ API Error', ['message' => $e->getMessage()]);
            throw $e;
        }
    }

    public function validatePayment(string $valId)
    {
        $response = Http::get("{$this->apiUrl}/validator/api/validationserverAPI.php", [
            'val_id' => $valId,
            'store_id' => $this->storeId,
            'store_passwd' => $this->storePass,
            'v' => 1,
            'format' => 'json'
        ]);

        return $response->json();
    }
}
