import { supabase } from '../supabase';

export interface DailyCheckin {
  id: string;
  user_id: string;
  checkin_date: string;
  energy_level: number;
  sleep_quality: number;
  mood_score: number;
  fatigue_level: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function getTodayCheckin(userId: string): Promise<DailyCheckin | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('checkin_date', today)
    .maybeSingle();

  if (error) {
    console.error('Error fetching today checkin:', error);
    return null;
  }

  return data;
}

export async function getRecentCheckins(
  userId: string,
  days: number = 7
): Promise<DailyCheckin[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .gte('checkin_date', startDateStr)
    .order('checkin_date', { ascending: false });

  if (error) {
    console.error('Error fetching recent checkins:', error);
    return [];
  }

  return data || [];
}

export async function getAllCheckins(userId: string): Promise<DailyCheckin[]> {
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .order('checkin_date', { ascending: false });

  if (error) {
    console.error('Error fetching all checkins:', error);
    return [];
  }

  return data || [];
}
