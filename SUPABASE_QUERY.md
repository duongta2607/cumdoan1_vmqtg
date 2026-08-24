# Truy vấn kết quả game Hành trình Tuổi trẻ

## Bảng xếp hạng đầy đủ

Mỗi đại biểu chỉ xuất hiện một lần với lượt chơi tốt nhất. Thời gian được chuyển sang múi giờ Việt Nam.

```sql
select
  row_number() over (
    order by
      total_score desc,
      unity_count desc,
      creative_count desc,
      volunteer_count desc,
      pioneer_count desc,
      played_at asc
  ) as ranking,
  delegate_id,
  full_name,
  total_score,
  unity_count,
  creative_count,
  volunteer_count,
  pioneer_count,
  obstacle_hits,
  title,
  played_at at time zone 'Asia/Ho_Chi_Minh' as played_at_vietnam
from public.youth_journey_leaderboard
order by
  total_score desc,
  unity_count desc,
  creative_count desc,
  volunteer_count desc,
  pioneer_count desc,
  played_at asc;
```

## Top 10 đại biểu

```sql
select
  row_number() over (
    order by
      total_score desc,
      unity_count desc,
      creative_count desc,
      volunteer_count desc,
      pioneer_count desc,
      played_at asc
  ) as ranking,
  delegate_id,
  full_name,
  total_score,
  unity_count,
  creative_count,
  volunteer_count,
  pioneer_count,
  obstacle_hits,
  title,
  played_at at time zone 'Asia/Ho_Chi_Minh' as played_at_vietnam
from public.youth_journey_leaderboard
order by
  total_score desc,
  unity_count desc,
  creative_count desc,
  volunteer_count desc,
  pioneer_count desc,
  played_at asc
limit 10;
```
