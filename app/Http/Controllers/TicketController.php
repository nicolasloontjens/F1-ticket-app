<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Ticket_type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    function load($raceid){
        $tickettypes = Ticket_type::all();
        return view("order")->with(['raceid' => $raceid,'tickettypes' => $tickettypes]);
        //return view("purchase",(todo: add list of types of tickets, and general info about the gp))
    }

    function addOrder(Request $request){
        $tickettype = $request->input('tickettype');
        $userid = Auth::id();
        $grandprixid = $request->input('grandprixid');

        $order = new Order();
        $order->user_id = $userid;
        $order->ticket_type_id = $tickettype;
        $order->grand_prix_id = $grandprixid;

        $order->save();
        return view('confirmation')->with('order',$order);
    }

    function checkForTickets(){
        $isAuthenticated = Auth::check();
        if($isAuthenticated){
            $userid = Auth::id();
            $orders = Order::with('Ticket_type')->where('user_id',$userid)->get();
            return view('home')->with('orders',$orders);
        }
        return view('home');
    }
}
