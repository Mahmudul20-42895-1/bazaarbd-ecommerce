<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class OtpController extends Controller
{
    /**
     * Send OTP to a phone number
     */
    public function send(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10'
        ]);

        $phone = $request->phone;
        
        // Generate a 6-digit OTP
        $otp = rand(100000, 999999);
        
        // Expiry from config or default 5 mins
        $expiry = config('app.otp_expiry_minutes', 5);

        // Store in cache
        Cache::put('otp_' . $phone, $otp, now()->addMinutes($expiry));

        // In a real application, you would send this via SMS provider here
        // e.g. SmsService::send($phone, "Your BazaarBD OTP is $otp");
        Log::info("OTP for $phone is $otp");

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully',
            'data' => [
                'expires_in' => $expiry * 60, // in seconds
                // 'otp' => $otp // ONLY for testing, remove in production
            ]
        ]);
    }

    /**
     * Verify the OTP
     */
    public function verify(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'otp' => 'required|string|size:6'
        ]);

        $phone = $request->phone;
        $inputOtp = $request->otp;

        $cachedOtp = Cache::get('otp_' . $phone);

        if (!$cachedOtp) {
            return response()->json([
                'success' => false,
                'message' => 'OTP expired or not found'
            ], 400);
        }

        if ((string)$cachedOtp !== (string)$inputOtp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP'
            ], 400);
        }

        // Clear the OTP from cache
        Cache::forget('otp_' . $phone);

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully'
        ]);
    }
}
