<?php

namespace Database\Seeders;

use App\Models\Ticket_type;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class TicketTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::insert("insert into ticket_types (type,price) values(?,?)",["Pitlane Grandstands",605]);
        DB::insert("insert into ticket_types (type,price) values(?,?)",["Turn 4 Grandstands",480]);
        DB::insert("insert into ticket_types (type,price) values(?,?)",["Turn 6 Grandstands",500]);
        DB::insert("insert into ticket_types (type,price) values(?,?)",["Tribune Speed Corner",300]);
        DB::insert("insert into ticket_types (type,price) values(?,?)",["Turn 10 Grandstands",400]);
        DB::insert("insert into ticket_types (type,price) values(?,?)",["Bronze Grandstands",175]);
        DB::insert("insert into ticket_types (type,price) values(?,?)",["Paddock Pass",750]);
    }
}
