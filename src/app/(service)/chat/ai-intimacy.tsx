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
    <ChartContainer
      config={chartConfig}
      className='size-10'
    >
      <RadialBarChart
        data={chartData}
        innerRadius={14}
        outerRadius={20}
        barSize={10}
        endAngle={360 * value * 0.01}
      >
        <RadialBar
          dataKey='value'
          background
          cornerRadius={10}
        />
        <PolarRadiusAxis
          tick={false}
          tickLine={false}
          axisLine={false}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor='middle'
                    dominantBaseline='middle'
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className='fill-orange-300 text-xs leading-none'
                    >
                      {chartData[0].value.toFixed(0)}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
};

const getIntimacy = (userId: string) => async () => {
  const currentIntimacy = await getCurrentIntimacy(userId);
  return currentIntimacy;
};

export default AiIntimacy;
