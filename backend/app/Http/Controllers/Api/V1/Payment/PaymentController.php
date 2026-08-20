<?php

namespace App\Http\Controllers\Api\V1\Payment;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function success(Request $request)
    {
        // For SSLCommerz, this would validate the post data and update DB
        $tran_id = $request->input('tran_id');
        
        $payment = Payment::where('transaction_id', $tran_id)->first();
        if ($payment) {
            $payment->update([
                'status' => 'completed',
                'gateway_response' => json_encode($request->all())
            ]);
            
            $payment->order->update(['status' => 'processing']);
        }

        // Redirect to frontend success page
        return redirect(config('app.frontend_url') . '/payment/success?order=' . ($payment->order->order_number ?? ''));
    }

    public function fail(Request $request)
    {
        $tran_id = $request->input('tran_id');
        
        $payment = Payment::where('transaction_id', $tran_id)->first();
        if ($payment) {
            $payment->update([
                'status' => 'failed',
                'gateway_response' => json_encode($request->all())
            ]);
        }

        return redirect(config('app.frontend_url') . '/payment/fail');
    }

    public function cancel(Request $request)
    {
        $tran_id = $request->input('tran_id');
        
        $payment = Payment::where('transaction_id', $tran_id)->first();
        if ($payment) {
            $payment->update([
                'status' => 'cancelled'
            ]);
        }

        return redirect(config('app.frontend_url') . '/payment/cancel');
    }

    public function ipn(Request $request)
    {
        // Instant Payment Notification logic
        $tran_id = $request->input('tran_id');
        $status = $request->input('status');
        
        // Need to validate signature with SSLCZ_STORE_PASSWD here in production
        
        $payment = Payment::where('transaction_id', $tran_id)->first();
        
        if ($payment && $payment->status !== 'completed' && $status === 'VALID') {
            $payment->update([
                'status' => 'completed',
                'gateway_response' => json_encode($request->all())
            ]);
            $payment->order->update(['status' => 'processing']);
        }

        return response()->json(['message' => 'IPN Processed']);
    }
}
