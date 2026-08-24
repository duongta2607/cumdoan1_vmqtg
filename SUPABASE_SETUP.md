```sql
create table public.delegate_checkins (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  gender text not null check (gender in ('Nam', 'Nữ')),
  position text,
  workplace text,
  delegate_type text not null check (
    delegate_type in ('Đại biểu khách mời', 'Đại biểu chính thức')
  ),
  checked_in_at timestamptz not null default now()
);
```

```sql
create table if not exists public.youth_journey_game_results (
  id uuid primary key default gen_random_uuid(),
  delegate_id uuid not null references public.delegate_checkins(id) on delete cascade,
  full_name text not null,
  unity_count integer not null default 0 check (unity_count >= 0),
  creative_count integer not null default 0 check (creative_count >= 0),
  volunteer_count integer not null default 0 check (volunteer_count >= 0),
  pioneer_count integer not null default 0 check (pioneer_count >= 0),
  obstacle_hits integer not null default 0 check (obstacle_hits >= 0),
  game_duration_seconds smallint not null default 60 check (
    game_duration_seconds between 1 and 90
  ),
  total_score integer generated always as (
    greatest(git config --global user.name "duongta2607"
    )
  ) stored,
  title text generated always as (
    case
      when greatest(
        0,
        unity_count * 12
        + creative_count * 15
        + volunteer_count * 14
        + pioneer_count * 18
        - obstacle_hits * 20
      ) >= 450 then 'Thủ lĩnh Tuổi trẻ'
      when greatest(
        0,
        unity_count * 12
        + creative_count * 15
        + volunteer_count * 14
        + pioneer_count * 18
        - obstacle_hits * 20
      ) >= 300 then 'Chiến binh Tiên phong'
      when greatest(
        0,
        unity_count * 12
        + creative_count * 15
        + volunteer_count * 14
        + pioneer_count * 18
        - obstacle_hits * 20
      ) >= 180 then 'Thanh niên Sáng tạo'
      else 'Mầm xanh Cống hiến'
    end
  ) stored,
  played_at timestamptz not null default now()
);

drop index if exists public.youth_journey_results_delegate_time_idx;
drop index if exists public.youth_journey_results_leaderboard_idx;
drop index if exists public.youth_journey_results_best_attempt_idx;

create index youth_journey_results_delegate_time_idx
  on public.youth_journey_game_results (delegate_id, full_name, played_at desc);

create index youth_journey_results_leaderboard_idx
  on public.youth_journey_game_results (
    total_score desc,
    unity_count desc,
    creative_count desc,
    volunteer_count desc,
    pioneer_count desc,
    played_at asc
  );

create index youth_journey_results_best_attempt_idx
  on public.youth_journey_game_results (
    delegate_id,
    total_score desc,
    unity_count desc,
    creative_count desc,
    volunteer_count desc,
    pioneer_count desc,
    played_at asc
  );

create or replace function public.set_youth_journey_result_player()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  delegate_name text;
begin
  select delegate_checkins.full_name
  into delegate_name
  from public.delegate_checkins
  where delegate_checkins.id = new.delegate_id;

  if not found then
    raise exception 'Không tìm thấy đại biểu có id %', new.delegate_id;
  end if;

  new.full_name := delegate_name;
  return new;
end;
$$;

drop trigger if exists set_youth_journey_result_player_before_insert
on public.youth_journey_game_results;

create trigger set_youth_journey_result_player_before_insert
before insert on public.youth_journey_game_results
for each row
execute function public.set_youth_journey_result_player();

alter table public.youth_journey_game_results enable row level security;

drop policy if exists "Cho phép lưu kết quả Hành trình Tuổi trẻ"
on public.youth_journey_game_results;

create policy "Cho phép lưu kết quả Hành trình Tuổi trẻ"
on public.youth_journey_game_results
for insert
to anon, authenticated
with check (delegate_id is not null);

drop policy if exists "Cho phép xem bảng xếp hạng Hành trình Tuổi trẻ"
on public.youth_journey_game_results;

create policy "Cho phép xem bảng xếp hạng Hành trình Tuổi trẻ"
on public.youth_journey_game_results
for select
to anon, authenticated
using (true);

grant select, insert
on public.youth_journey_game_results
to anon, authenticated;

create or replace view public.youth_journey_leaderboard
with (security_invoker = true)
as
select
  id,
  delegate_id,
  full_name,
  unity_count,
  creative_count,
  volunteer_count,
  pioneer_count,
  obstacle_hits,
  game_duration_seconds,
  total_score,
  title,
  played_at
from (
  select
    game_results.*,
    row_number() over (
      partition by game_results.delegate_id
      order by
        game_results.total_score desc,
        game_results.unity_count desc,
        game_results.creative_count desc,
        game_results.volunteer_count desc,
        game_results.pioneer_count desc,
        game_results.played_at asc
    ) as delegate_result_rank
  from public.youth_journey_game_results as game_results
) as ranked_results
where delegate_result_rank = 1;

grant select
on public.youth_journey_leaderboard
to anon, authenticated;
```
