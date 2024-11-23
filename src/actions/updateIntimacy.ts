'use server';

import { createAdminSupabase } from '@/lib/db/supabase/admin';

export type IntimacyActionType =
  | 'DAILY_LOGIN'
  | 'GOOD_CONVERSATION'
  | 'DEEP_CONVERSATION'
  | 'NEW_INSIGHT'
  | 'TIME_DECAY';

const INITIAL_VALUE = 30;
const MIN_VALUE = 0;
const MAX_VALUE = 100;
const DAILY_MAX_INCREASE = 3;

const normalizeIntimacy = (intimacy: number) => Math.max(MIN_VALUE, Math.min(MAX_VALUE, intimacy));

const DELTA: Record<IntimacyActionType, number> = {
  // 증가 요소 (퍼센트)
  DAILY_LOGIN: 1,
  GOOD_CONVERSATION: 2,
  DEEP_CONVERSATION: 3,
  NEW_INSIGHT: 2.5,
  TIME_DECAY: -0.5,
};

async function getCurrentIntimacy(userId: string): Promise<number> {
  const supabase = createAdminSupabase();

  const { data, error } = await supabase.from('ai_intimacy').select('delta').eq('user_id', userId);

  if (error) throw error;

  const totalDelta = data.reduce((sum, record) => sum + record.delta, INITIAL_VALUE);
  return Math.max(MIN_VALUE, Math.min(MAX_VALUE, totalDelta));
}

async function getDailyIncrease(userId: string): Promise<number> {
  const supabase = createAdminSupabase();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  // 오늘 증가한 총량 계산
  const { data, error } = await supabase
    .from('ai_intimacy')
    .select('delta')
    .eq('user_id', userId)
    .gte('at', todayStart)
    .gt('delta', 0);

  if (error) throw error;

  return data.reduce((sum, record) => sum + record.delta, 0);
}

export async function updateIntimacy(
  userId: string,
  actionType: IntimacyActionType,
  reason: string,
  multiplier: number = 1,
): Promise<number> {
  const supabase = createAdminSupabase();
  const currentIntimacy = await getCurrentIntimacy(userId);

  // 변화량 계산
  let newIntimacy = normalizeIntimacy(currentIntimacy * (1 + DELTA[actionType] / 100) ** multiplier);

  if (newIntimacy > currentIntimacy) {
    // 일일 최대 증가량 체크
    const dailyIncrease = await getDailyIncrease(userId);
    if (dailyIncrease + newIntimacy - currentIntimacy > DAILY_MAX_INCREASE) {
      newIntimacy = normalizeIntimacy(currentIntimacy + DAILY_MAX_INCREASE);
    }
  }
  const delta = newIntimacy - currentIntimacy;

  if (delta !== 0) {
    await supabase.from('ai_intimacy').insert({ user_id: userId, delta, reason }).throwOnError();
  }
  return newIntimacy;
}
