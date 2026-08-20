<?php
use Illuminate\Support\Facades\Route;
Route::get('/', fn() => response()->json(['app'=>'Bangladesh Shop API','version'=>'1.0']));
Route::get('/health', fn() => response()->json(['status'=>'ok','timestamp'=>now()]));
