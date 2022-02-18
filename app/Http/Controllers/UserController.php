<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Ticket_type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class UserController extends Controller
{
    function loadProfile(){
        $userid = Auth::id();
        $orders = Order::with('Ticket_type')->where('user_id',$userid)->get();

        return view('profile')->with('orders',$orders);
    }

    function upload(Request $request){
        $path = $request -> file("avatar") -> store("avatars");
        $userid = Auth::id();
        DB::table('users')->where('id',$userid)->update(['avatarurl' => $path]);
        
        $orders = Order::with('Ticket_type')->where('user_id',$userid)->get();
        return view('profile')->with('orders',$orders);
    }

    function logout(){
        Auth::logout();
        return view('home');
    }
}
