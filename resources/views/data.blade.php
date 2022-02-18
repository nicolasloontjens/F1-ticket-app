@extends("master")

@section("main")
<section class="drivers" driverId='{{$driverid ?? ""}}' type='{{$type ?? ""}}' constructorId='{{$constructorid ?? ""}}'>
    <div class="form">
        <form id="form" method="post" action="#">
            @csrf
            <label for="search">
                <input id="search" type="text" placeholder="Search.." name="search" >
            </label>
        </form>
        <div class="elementlist">
            <ul>

            </ul>
        </div>
    </div>
    <div class="information">
        <div class="asideinformation">
            <div class="numbergradient">
            </div>
            <div class="statistics">

            </div>
        </div>
        <div class="charts">
        </div>
    </div>
</section>
@endsection