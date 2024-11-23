'use server';

import { createAdminSupabase } from '@/lib/db/supabase/admin';

export type IntimacyActionType =
  | 'DAILY_LOGIN'
  | 'GOOD_CONVERSATION'
  | 'DEEP_CONVERSATION'
  | 'NEW_INSIGHT'
  | 'OFFENDED'
  | 'BAD_CONVERSATION'
  | 'TIME_DECAY';

const INITIAL_VALUE = 30;
const MIN_VALUE = 0;
const MAX_VALUE = 100;
const DAILY_MAX_INCREASE = 3;

const normalizeIntimacy = (intimacy: number) =>
  Math.max(MIN_VALUE, Math.min(MAX_VALUE, intimacy));

const DELTA: Record<IntimacyActionType, number> = {
  // 증가 요소 (퍼센트)
  DAILY_LOGIN: 0.5,
  GOOD_CONVERSATION: 1.5,
  DEEP_CONVERSATION: 2.5,
  OFFENDED: -1.5,
  BAD_CONVERSATION: -1.5,
  NEW_INSIGHT: 2.5,
  TIME_DECAY: -0.5,
};

export async function getCurrentIntimacy(userId: string): Promise<number> {
  const supabase = createAdminSupabase();

  const { data } = await supabase
    .from('ai_intimacy')
    .select('delta')
    .eq('user_id', userId)
    .order('at', { ascending: true })
    .throwOnError();

  const totalDelta = (data ?? []).reduce(
    (sum, record) => sum + record.delta,
    INITIAL_VALUE,
  );
  return Math.max(MIN_VALUE, Math.min(MAX_VALUE, totalDelta));
}

async function getDailyIncrease(userId: string): Promise<number> {
  const supabase = createAdminSupabase();
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).toISOString();

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

  // check delta
  let newIntimacy = normalizeIntimacy(
    currentIntimacy * (1 + DELTA[actionType] / 100) ** multiplier,
  );

  if (newIntimacy > currentIntimacy) {
    const dailyIncrease = await getDailyIncrease(userId);
    if (dailyIncrease + newIntimacy - currentIntimacy > DAILY_MAX_INCREASE) {
      newIntimacy = normalizeIntimacy(currentIntimacy + DAILY_MAX_INCREASE);
    }
  }
  const delta = newIntimacy - currentIntimacy;

  if (delta !== 0) {
    await supabase
      .from('ai_intimacy')
      .insert({ user_id: userId, delta, reason })
      .throwOnError();
  }
  return newIntimacy;
}
