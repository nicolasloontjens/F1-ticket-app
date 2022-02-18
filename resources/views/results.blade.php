@extends("master")

@section('main')
<section class="results" year='{{$year ?? ""}}' roundnr='{{$round ?? ""}}'>
    <div class="information">
        <form id="form" method="post" action="#">
            @csrf
        </form>
    </div>
    <div class="year" id="world-tour">

    </div>

    <div class="year">
        <canvas id="drivers-doughnut-chart"></canvas>
    </div>

    <div class="year">
        <canvas id="constructors-doughnut-chart"></canvas>
    </div>

    <div class="year" id="drivers-line-chart-id">
        <canvas id="drivers-line-chart"></canvas>
    </div>

    <div class="round">
        <div id="map" class="map"></div>
    </div>

    <div class="round">
        <canvas id="drivers-points-bar-chart"></canvas>
    </div>

    <div class="round">
        <canvas id="drivers-points-after-round-bar-chart"></canvas>
    </div>

</section>
@endsection