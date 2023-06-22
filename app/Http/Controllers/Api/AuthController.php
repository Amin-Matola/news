<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    /**
     * Signup endpoint
     * 
     * @param SignupRequest $request
     */
    public function signup( SignupRequest $request)
    {
        $data = $request->validated();
        $token= NULL;

        /** @var User $user */
        $user = User::create([
            "name" => $data["name"],
            "email" => $data["email"],
            "password" => $data["password"],
            "preferences" => [
                "source" => "nyn",
                "category" => "world",
                "type" => "latest"
            ]
        ]);


        $token = $user->createToken("main")->plainTextToken;

        return response( compact("user", "token"));
    }

    /**
     * Login endpoint
     * 
     * @param LoginRequest $request
     */
    public function login( LoginRequest $request) 
    {
        $credentials = $request->validated();

        if ( !Auth::attempt( $credentials)) {
            return response([
                "message" => "Incorrect username or password!"
            ], 422);
        }

        /** @var User $user */
        $user = Auth::user();
        $token= $user->createToken("main")->plainTextToken;

        return response([
            "user" => $user,
            "token"=> $token
        ]);
    }
    
    /**
     * Login endpoint
     * User must be from news logedin user, 
     * User::find not encouraged here
     * 
     * @param Request $request
     */
    public function update( Request $request) 
    {
        $data = $request->all();

        /** @var User $user */
        $user = $request->user();
        $user->update([
            "preferences" => $data
        ]);

        return response($user);
    }

    /**
     * Logout endpoint
     * 
     * @param Request $request
     */
    public function logout( Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        
        $user->currentAccessToken()->delete();

        return response("", 204);
    }
}
