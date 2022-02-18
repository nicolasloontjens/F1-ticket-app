<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ResultsController extends Controller
{
    function load(){
        return view('results');
    }

    function loadYear($year){
        return view('results')->with(['year' => $year]);
    }

    function loadYearandRound($year,$round){
        return view('results')->with(['year'=>$year,'round'=>$round]);
    }
}
