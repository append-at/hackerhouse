import { cn } from '@/lib/utils';
import { createServerSupabase } from '@/lib/db/supabase/server';
import SetupProfile from './_steps/1-setup-profile';
import SelectTopics from './_steps/2-select-topics';
import { OnboardingStep } from './schema';
import { getCurrentUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

const Page = async () => {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let step: OnboardingStep = 'setup-profile';
  if (user) {
    const userData = await getCurrentUser(supabase).catch(() => null);
    const topics = userData?.topics ?? [];

    if (!topics.length) {
      step = 'select-topics';
    }
    if (topics.length > 0) {
      return redirect('/setting/profile');
    }
  }

  return (
    <section className='flex h-dvh flex-col py-20'>
      {step === 'setup-profile' && <SetupProfile user={user!} />}
      {step === 'select-topics' && <SelectTopics />}

      {/* Indicator */}
      <div className='fixed bottom-0 left-0 flex w-full items-center justify-center gap-2 py-2'>
        <Indicator active={step === 'setup-profile'} />
        <Indicator active={step === 'select-topics'} />
      </div>
    </section>
  );
};

const Indicator = ({ active }: { active: boolean }) => (
  <div className={cn('h-1 w-4 rounded-md bg-white', !active && 'opacity-30')} />
);

export default Page;
