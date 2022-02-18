<?php

use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ResultsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/',[TicketController::class,"checkForTickets"]);

Route::get('/tickets/{raceid}', [TicketController::class, "load"])->middleware(['auth']);

Route::post('/order',[TicketController::class, "addOrder"])->name('process-order')->middleware(['auth']);

Route::get('/results',[ResultsController::class,'load'])->name('results');

Route::match(['GET','POST'],'/results/{year}',[ResultsController::class,'loadYear']);

Route::match(['GET','POST'],'/results/{year}/{round}',[ResultsController::class,'loadYearandRound']);

Route::get(('/drivers'), function(){
    return view("data")->with(['type' => "drivers"]);
})->name('drivers');

Route::match(['GET', 'POST'],'/drivers/{driverid}', function($driverid){
    return view("data")->with(['driverid' => $driverid,'type' => "drivers"]);;
});

Route::get(('/constructors'), function(){
    return view("data")->with(['type' => 'constructors']);
})->name('constructors');

Route::match(['GET', 'POST'], '/constructors/{constructorid}', function($constructorid){
    return view("data")->with(['constructorid' => $constructorid,'type' => "constructors"]);
});

Route::get('/profile',[UserController::class,'loadProfile'])->name('profile')->middleware(['auth']);

Route::post('/profile/image',[UserController::class,'upload'])->name('upload')->middleware(['auth']);

Route::get('/profile/logout',[UserController::class,'logout'])->name('profile-logout')->middleware(['auth']);

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';
