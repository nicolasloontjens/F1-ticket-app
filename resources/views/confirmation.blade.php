@extends("master")

@section("main")
<section class="confirmation">
    <h1>Dear {{Auth::user() -> name}}, Thank you for your purchase!</h1>
    <h2>Your order has been received! Your tickets will be available in your profile when you have received an order confirmation.</h2>

    <p>-The F1 ticket app team</p>

</section>
@endsection()