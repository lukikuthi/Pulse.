import { supabase } from './supabase';

export interface DailyCheckinData {
  energy_level: number;
  sleep_quality: number;
  mood_score: number;
  fatigue_level: number;
  notes?: string;
}

export interface SaveCheckinResult {
  success: boolean;
  error?: string;
  data?: {
    id: string;
    checkin_date: string;
    is_new: boolean;
  };
}

export async function saveDailyCheckin(
  userId: string,
  checkinData: DailyCheckinData
): Promise<SaveCheckinResult> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'ID do usuário não fornecido',
      };
    }

    const today = new Date().toISOString().split('T')[0];

    const dataToSave = {
      user_id: userId,
      checkin_date: today,
      energy_level: checkinData.energy_level,
      sleep_quality: checkinData.sleep_quality,
      mood_score: checkinData.mood_score,
      fatigue_level: checkinData.fatigue_level,
      notes: checkinData.notes || null,
    };

    const { data, error } = await supabase
      .from('daily_checkins')
      .upsert(dataToSave, {
        onConflict: 'user_id,checkin_date',
        ignoreDuplicates: false,
      })
      .select('id, checkin_date, created_at, updated_at')
      .single();

    if (error) {
      console.error('Erro ao salvar check-in:', error);
      return {
        success: false,
        error: `Erro ao salvar check-in: ${error.message}`,
      };
    }

    const isNew = data.created_at === data.updated_at;

    return {
      success: true,
      data: {
        id: data.id,
        checkin_date: data.checkin_date,
        is_new: isNew,
      },
    };
  } catch (err) {
    console.error('Erro inesperado ao salvar check-in:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erro inesperado',
    };
  }
}
