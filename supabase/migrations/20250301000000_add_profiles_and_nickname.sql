-- profiles: auth.users와 1:1, 닉네임 저장 (회원가입 시 metadata 또는 랜덤)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  constraint profiles_nickname_unique unique (nickname)
);

create index if not exists profiles_nickname_lower_idx on public.profiles (lower(nickname));

alter table public.profiles enable row level security;

-- 본인 프로필만 조회/수정
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 닉네임 사용 가능 여부만 체크 (anon 호출용, 다른 데이터 노출 없음)
create or replace function public.nickname_available(nick text)
returns boolean
language sql
security definer
set search_path = ''
as $$
  select not exists (
    select 1 from public.profiles where lower(nickname) = lower(trim(nick))
  );
$$;

grant execute on function public.nickname_available(text) to anon;
grant execute on function public.nickname_available(text) to authenticated;

-- 회원가입 시 프로필 자동 생성 (metadata.nickname 또는 랜덤, 충돌 시 접미사 붙임)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_nick text;
  final_nick text;
  retry int := 0;
begin
  base_nick := trim(coalesce(new.raw_user_meta_data->>'nickname', ''));
  if base_nick = '' or length(base_nick) < 2 then
    base_nick := 'user_' || substr(md5(gen_random_uuid()::text), 1, 8);
  end if;
  final_nick := base_nick;
  loop
    begin
      insert into public.profiles (id, nickname) values (new.id, final_nick);
      return new;
    exception when unique_violation then
      retry := retry + 1;
      final_nick := base_nick || '_' || substr(md5(gen_random_uuid()::text), 1, 4);
      if retry > 10 then
        raise;
      end if;
    end;
  end loop;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
