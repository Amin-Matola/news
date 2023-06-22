<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NewsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post("/update", [AuthController::class, "update"]);
    Route::post("/logout", [AuthController::class, "logout"]);

    // News, multiple parameters
    Route::post("/news/filter", [NewsController::class, "filter"]);

    // News Limited parameters
    Route::get("/news/{source}", [NewsController::class, "index"]);
    Route::get("/news/{source}/{category}/{page}", [NewsController::class, "category"]);
    Route::get("/news/search/{source}/{term}/{page}", [NewsController::class, "search"]);
});


// Public api urls
Route::middleware("cors")->group(function() {
    Route::post("/signup", [AuthController::class, "signup"]);
    Route::post("/login", [AuthController::class, "login"]);
});
