'use server';

import { sendPush } from '@/actions/admin/push';

export const testPushMessage = async (userId: string) => {
  await sendPush({
    userIds: [userId],
    title: 'title here',
    body: 'description here',
    url: `/people`,
  });
};
