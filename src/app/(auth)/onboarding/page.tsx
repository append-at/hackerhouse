import { redirect } from 'next/navigation';
import { Steps } from './schema';
import { cn } from '@/lib/utils';
import SetupProfile from './_steps/1-setup-profile';
import SelectTopics from './_steps/2-select-topics';

type Props = {
  searchParams: Promise<{
    step: string;
  }>;
};

const Page = async ({ searchParams }: Props) => {
  const { step: originStep } = await searchParams;
  const { data: step } = Steps.safeParse(originStep);
  if (!step) {
    return redirect('/onboarding?step=setup-profile');
  }

  return (
    <section className='flex h-dvh flex-col py-20'>
      {step === 'setup-profile' && <SetupProfile />}
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
