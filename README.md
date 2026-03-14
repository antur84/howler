# Howler, a React + TypeScript + Vite + Go + Supabase demo

## Setup
* Create supabase db.
  * Schema
    ```
    create table howls (
      id uuid default gen_random_uuid() primary key,
      content text not null check (char_length(content) <= 280),
      author_email text not null,
      author_name text not null,
      created_at timestamptz default now() not null,
      likes int default 0 not null
    );

    -- Index for feed ordering
    create index howls_created_at_idx on howls (created_at desc);

    alter table howls enable row level security;
    create policy "Anyone can read howls" on howls for select using (true);
    create policy "Authenticated can insert" on howls for insert with check (true);
    ```
* Setup google oauth for http://localhost:5173
* Populate real .env files, see `.env.example` files
* Start web app
  * `cd client`
  * `npm i`
  * `npm run dev`
* Start backend
  * `cd server`
  * `go run .`

Browse to http://localhost:5173
