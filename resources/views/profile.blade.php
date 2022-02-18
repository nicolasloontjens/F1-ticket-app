@extends("master")

@section('main')
<section class="profile">
    <div class="user"> 
        <section class="profile_picture">
            @if(Auth::user()->avatarurl != '')
                <img src="{{asset(Auth::user()->avatarurl)}}">
            @endif
            <form method="post" enctype="multipart/form-data" action="{{route('upload')}}">
                @csrf
                <label for="avatar">Select profile image</label>
                <input type="file" name="avatar" id="avatar"required accept="image/png, image/jpeg, image/gif"/>
                <input type="submit" value="Upload"/> 
            </form>   
        </section>
        <h1>Account information:</h1>
        <p>Name: {{Auth::user()->name}}</p>
        <p>E-mail: {{Auth::user()->email}}</p>
        <p>Account creation date: {{Auth::user()->created_at}}</p>
        <a href="#" id="notification">Turn on notifications</a>
        <a href="{{route('profile-logout')}}">log out</a>
    </div>

    <div class="tickets">
        <h1>Your tickets: </h1>
        @foreach($orders as $order)
            <section>
                <div id="racename" raceid="{{$order->grand_prix_id}}">
                    <p>Ticket type: {{$order->ticket_type->type}} - € {{$order -> ticket_type->price}}</p>
                </div>
            </section>
            
        @endforeach
    </div>
</section>
@endsection