<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\HealthController;
use App\Http\Controllers\API\ProjectController;

Route::get('/health', [HealthController::class, 'check']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('projects', ProjectController::class);
});
