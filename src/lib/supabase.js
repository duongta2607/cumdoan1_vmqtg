import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = url && key ? createClient(url, key) : null;

export async function createCheckin(data) {
  if (!supabase) throw new Error('Thiếu cấu hình Supabase trong .env.local.');
  const { data: row, error } = await supabase.from('delegate_checkins').insert({
    full_name: data.name,
    gender: data.gender,
    position: data.role || null,
    workplace: data.workplace || null,
    delegate_type: data.type,
  }).select().single();
  if (error) throw error;
  return {
    id: row.id,
    name: row.full_name,
    gender: row.gender,
    role: row.position,
    workplace: row.workplace,
    type: row.delegate_type,
    checkedInAt: row.checked_in_at,
  };
}

export async function getCheckinCount() {
  if (!supabase) return 0;
  const { count, error } = await supabase.from('delegate_checkins').select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count || 0;
}

function mapYouthJourneyResult(row) {
  return {
    id: row.id,
    delegateId: row.delegate_id,
    name: row.full_name,
    collection: {
      unity: row.unity_count,
      creative: row.creative_count,
      volunteer: row.volunteer_count,
      pioneer: row.pioneer_count,
    },
    obstacleHits: row.obstacle_hits,
    score: row.total_score,
    title: row.title,
    playedAt: row.played_at,
  };
}

export async function createYouthJourneyResult({ delegateId, collection, obstacleHits }) {
  if (!supabase) throw new Error('Thiếu cấu hình Supabase trong .env.local.');
  if (!delegateId) throw new Error('Không xác định được đại biểu đang chơi.');

  const { data: row, error } = await supabase
    .from('youth_journey_game_results')
    .insert({
      delegate_id: delegateId,
      unity_count: collection.unity,
      creative_count: collection.creative,
      volunteer_count: collection.volunteer,
      pioneer_count: collection.pioneer,
      obstacle_hits: obstacleHits,
      game_duration_seconds: 60,
    })
    .select()
    .single();

  if (error) throw error;
  return mapYouthJourneyResult(row);
}

export async function getYouthJourneyLeaderboard(limit = 10) {
  if (!supabase) return [];

  const safeLimit = Math.max(1, Math.min(Number(limit) || 10, 100));
  const { data: rows, error } = await supabase
    .from('youth_journey_leaderboard')
    .select(`
      id,
      delegate_id,
      full_name,
      unity_count,
      creative_count,
      volunteer_count,
      pioneer_count,
      obstacle_hits,
      total_score,
      title,
      played_at
    `)
    .order('total_score', { ascending: false })
    .order('unity_count', { ascending: false })
    .order('creative_count', { ascending: false })
    .order('volunteer_count', { ascending: false })
    .order('pioneer_count', { ascending: false })
    .order('played_at', { ascending: true })
    .limit(safeLimit);

  if (error) throw error;
  return rows.map(mapYouthJourneyResult);
}
