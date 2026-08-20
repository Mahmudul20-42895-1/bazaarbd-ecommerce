<?php
return [
    'store_id'      => env('SSLCOMERZ_STORE_ID',''),
    'store_passwd'  => env('SSLCOMERZ_STORE_PASSWD',''),
    'is_sandbox'    => env('SSLCOMERZ_IS_SANDBOX', true),
    'sandbox_url'   => 'https://sandbox.sslcommerz.com',
    'production_url'=> 'https://securepay.sslcommerz.com',
    'success_url'   => env('SSLCOMERZ_SUCCESS_URL'),
    'fail_url'      => env('SSLCOMERZ_FAIL_URL'),
    'cancel_url'    => env('SSLCOMERZ_CANCEL_URL'),
    'ipn_url'       => env('SSLCOMERZ_IPN_URL'),
    'allowed_ips'   => ['52.76.230.182','52.76.108.4','52.221.5.245'],
];
