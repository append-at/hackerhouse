import { createClient } from '@/utils/supabase/client';

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

const DELTA: Record<IntimacyActionType, number> = {
  // 증가 요소 (퍼센트)
  DAILY_LOGIN: 1,
  GOOD_CONVERSATION: 2,
  DEEP_CONVERSATION: 3,
  NEW_INSIGHT: 2.5,
  TIME_DECAY: -0.5,
};

async function getCurrentIntimacy(userId: string): Promise<number> {
  const supabase = createClient();

  const { data, error } = await supabase.from('ai_intimacy').select('delta').eq('user_id', userId);

  if (error) throw error;

  const totalDelta = data.reduce((sum, record) => sum + record.delta, INITIAL_VALUE);
  return Math.max(MIN_VALUE, Math.min(MAX_VALUE, totalDelta));
}

async function getDailyIncrease(userId: string): Promise<number> {
  const supabase = createClient();
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

export async function updateIntimacy(userId: string, actionType: IntimacyActionType, reason: string): Promise<number> {
  const supabase = createClient();
  const currentIntimacy = await getCurrentIntimacy(userId);

  // 변화량 계산
  let delta = (currentIntimacy * DELTA[actionType]) / 100;

  if (delta > 0) {
    // 일일 최대 증가량 체크
    const dailyIncrease = await getDailyIncrease(userId);
    if (dailyIncrease + delta > DAILY_MAX_INCREASE) {
      delta = Math.max(0, DAILY_MAX_INCREASE - dailyIncrease);
    }
  }
  const newIntimacy = Math.max(MIN_VALUE, Math.min(MAX_VALUE, currentIntimacy + delta));
  const actualDelta = Math.round((newIntimacy - currentIntimacy) * 100) / 100;

  if (actualDelta !== 0) {
    await supabase.from('ai_intimacy').insert({ user_id: userId, delta: actualDelta, reason }).throwOnError();
  }
  return newIntimacy;
}
