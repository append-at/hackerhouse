'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { cn, chunk } from '@/lib/utils';

const SelectTopics = () => {
  const [topics, setTopics] = useState(new Set<string>());
  const [percent, setPercent] = useState(0);

  const handleToggle = (topic: string) => () => {
    const set = new Set(topics);

    if (set.has(topic)) {
      set.delete(topic);
    } else {
      set.add(topic);
    }

    setTopics(set);
  };

  const handleScroll = (i: number) => (nextPercent: number) => {
    setPercent(nextPercent);
  };

  const handleSubmit = async () => {};

  return (
    <>
      <header className='w-full text-center'>
        <h1 className='mx-auto max-w-sm text-3xl font-semibold'>Choose topics you’re interested in</h1>
      </header>

      <article className='flex w-full grow flex-col justify-center gap-3'>
        {chunk(TOPICS, 3).map((row, i) => (
          <ScrollSyncRow
            percent={percent}
            key={i}
            onScroll={handleScroll(i)}
          >
            {row.map((topic) => (
              <button
                key={topic.name}
                data-active={topics.has(topic.name)}
                className={cn(
                  'inline-flex h-10 shrink-0 items-center justify-center gap-x-3 rounded-full border border-solid border-secondary px-5 shadow-sm',
                  '[&+&]:ml-2',
                  'bg-primary-foreground text-foreground',
                  'data-[active="true"]:bg-foreground data-[active="true"]:text-primary-foreground',
                  'transition-all',
                )}
                onClick={handleToggle(topic.name)}
              >
                <span>{topic.emoji}</span>
                <span>{topic.name}</span>
              </button>
            ))}
          </ScrollSyncRow>
        ))}
      </article>

      <div className='fixed bottom-20 left-0 w-full text-center shadow-lg'>
        <Button
          className='h-12 w-64 rounded-xl text-base'
          disabled={!topics.size}
          onSubmit={handleSubmit}
        >
          Finish
        </Button>
      </div>
    </>
  );
};

type ScrollSyncRowProps = {
  percent: number;
  onScroll: (percent: number) => void;
  children: React.ReactNode;
};

const ScrollSyncRow = ({ percent, onScroll, children }: ScrollSyncRowProps) => {
  const root = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPercentage = e.currentTarget.scrollLeft / (e.currentTarget.scrollWidth - e.currentTarget.clientWidth);
    onScroll(scrollPercentage);
  };

  useEffect(() => {
    if (root.current) {
      const scrollLeft = percent * (root.current.scrollWidth - root.current.clientWidth);
      root.current.scrollLeft = scrollLeft;
    }
  }, [percent]);

  return (
    <div className='w-full overflow-hidden px-6'>
      <div
        ref={root}
        className='hide-scrollbar overflow-auto whitespace-nowrap'
        onScroll={handleScroll}
      >
        {children}
      </div>
    </div>
  );
};

const TOPICS = [
  { name: 'Generative AI', emoji: '🎨' },
  { name: 'Machine Learning', emoji: '🤖' },
  { name: 'LLMs', emoji: '🧠' },
  { name: 'Cloud Computing', emoji: '☁️' },
  { name: 'Data Science', emoji: '📊' },
  { name: 'Web Development', emoji: '🌐' },
  { name: 'Blockchain', emoji: '🔗' },
  { name: 'Cybersecurity', emoji: '🛡️' },
  { name: 'Quantum Computing', emoji: '🔮' },
  { name: 'AR/VR', emoji: '🕶️' },
  { name: 'Robotics', emoji: '🦾' },
  { name: 'DevOps', emoji: '🛠️' },
  { name: 'Backend Development', emoji: '🔙' },
  { name: 'Frontend Development', emoji: '🔙' },
  { name: 'Mobile Development', emoji: '📱' },
  { name: 'Game Development', emoji: '🎮' },
  { name: 'Product Management', emoji: '📦' },
  { name: 'Design', emoji: '🎨' },
  { name: 'Database', emoji: '🗄️' },
  { name: 'CI/CD', emoji: '🚀' },
  { name: 'Testing', emoji: '🧪' },
  { name: 'Kubernetes', emoji: '☸️ ' },
  { name: 'Docker', emoji: '🐳' },
  { name: 'Linux', emoji: '🐧' },
  { name: 'React', emoji: '⚛️' },
];

export default SelectTopics;
