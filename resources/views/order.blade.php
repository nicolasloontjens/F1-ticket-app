@extends("master")

@section("main")

<section class="order" id="{{$raceid}}">

    <h1>Order:</h1>

    <div class="form">

        <div id="racedata">
        </div> 

        <form method="post" action="{{route('process-order')}}">
            @csrf
            <input name="grandprixid" value="{{$raceid}}" class="hidden">
            <select name="tickettype" id="tickettype">
                @foreach($tickettypes as $tickettype)
                    <option value="{{$tickettype->id}}" price="{{$tickettype->price}}">{{$tickettype -> type}} - €{{number_format($tickettype->price, 2)}}</option>
                @endforeach
            </select>
            <input type="submit" id="submit" disabled="disabled" value="Order">
        </form>

    </div>


</section>
@endsection