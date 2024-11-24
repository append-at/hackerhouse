'use client';

import { getCurrentIntimacy } from '@/actions/intimacy';
import { useQuery } from '@tanstack/react-query';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useUser } from '@/app/context';

const chartConfig = {
  value: {
    label: 'value',
  },
  data: {
    label: 'data',
  },
} satisfies ChartConfig;

const AiIntimacy = () => {
  const user = useUser();
  const query = useQuery({
    queryKey: ['intimacy', user.id],
    queryFn: getIntimacy(user.id),
    refetchInterval: 1000 * 10,
  });

  const value = query.data ?? 0;
  const chartData = [
    {
      name: 'Incimacy',
      value: value,
      fill: 'hsl(var(--chart-3))',
    },
  ];

  return (
    <div className='relative'>
      <ChartContainer
        config={chartConfig}
        className='size-10'
      >
        <RadialBarChart
          data={chartData}
          innerRadius={17}
          outerRadius={20}
          barSize={10}
          endAngle={360 * value * 0.01}
        >
          <RadialBar
            dataKey='value'
            background
            cornerRadius={10}
          />
        </RadialBarChart>
      </ChartContainer>

      <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-300 text-sm text-center'>
        {value.toFixed(0)}
      </span>
    </div>
  );
};

const getIntimacy = (userId: string) => async () => {
  const currentIntimacy = await getCurrentIntimacy(userId);
  return currentIntimacy;
};

export default AiIntimacy;
