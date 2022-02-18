<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/randomcolor/0.6.1/randomColor.min.js" integrity="sha512-vPeZ7JCboHcfpqSx5ZD+/jpEhS4JpXxfz9orSvAPPj0EKUVShU2tgy7XkU+oujBJKnWmu4hU7r9MMQNWPfXsYw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.2/chart.min.js" integrity="sha512-tMabqarPtykgDtdtSqCL3uLVM0gS1ZkUAVhRFu1vSEFgvB73niFQWJuvviDyBGBH22Lcau4rHB5p2K2T0Xvr6Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://d3js.org/topojson.v0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/build/ol.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/css/ol.css" type="text/css">
    <link rel="stylesheet" type="text/css" href="{{asset('css/reset.css')}}">
    <link rel="stylesheet" type="text/css" href="{{asset('css/style.css')}}">
    <link rel="icon" href="{{asset('images/f1_logo_red.svg')}}">   
    @isset($orders)
    <script>let orders = {!! json_encode($orders->toArray(), JSON_HEX_TAG)!!}</script>
    @endisset
    <script type="module" src="{{asset('js/data.js')}}"></script>
    <script src="{{asset('js/results.js')}}"></script>
    <script src="{{asset('js/constructoranddriver.js')}}"></script>
    <script src="{{asset('js/home.js')}}"></script>
    
    <title>Formula 1 - Tickets</title>
</head>
<body>

<header>
    <a href="/"><img src="{{asset('images/f1_logo.svg')}}" alt="Formula 1"></a>
    <nav id="primary-links">
        <a href="{{route('drivers')}}">Drivers</a>
        <a href="{{route('constructors')}}">Constructors</a>
        <a href="{{route('results')}}">Results</a>
        <a href="{{route('profile')}}">Profile</a>
    </nav>
</header>

<main>
    @yield("main")
</main>
    
<footer>

</footer>
</body>
</html>