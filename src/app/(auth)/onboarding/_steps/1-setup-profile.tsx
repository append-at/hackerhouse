'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { type Profile, ProfileSchema } from '../schema';
import { createUser } from './actions';
import Balancer from 'react-wrap-balancer';

type Props = {
  user: User;
};

const getDefaultValues = (user: User): Profile => {
  const names = `${user.user_metadata.full_name || ''}`.split(' ').filter(Boolean);
  const username = user.user_metadata.preferred_username || user.user_metadata.user_name;
  const avatarUrl = user.user_metadata.avatar_url;

  return {
    username,
    avatarUrl,
    firstName: names[0] || '',
    lastName: names[names.length - 1] || '',
    id: user.id,
    bio: '',
  };
};

const SetupProfile = ({ user }: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Profile>({
    mode: 'all',
    resolver: zodResolver(ProfileSchema),
    defaultValues: getDefaultValues(user),
  });

  const handleSubmit = async (values: Profile) => {
    try {
      await createUser(values);

      toast({ title: 'Profile saved!' });
      router.refresh();
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
      });
    }
  };

  const isDisabled = form.formState.isSubmitting || Object.keys(form.formState.errors).length > 0;

  return (
    <>
      <header className='w-full text-center'>
        <h1 className='mx-auto max-w-sm text-3xl font-bold leading-8 tracking-tight'>
          <Balancer>Tell us about yourself</Balancer>
        </h1>
      </header>

      <article className='flex w-full grow items-center'>
        <Form {...form}>
          <form
            id='form'
            className='w-full space-y-6 px-10'
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Sam'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Altman'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='I run openai sir'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='text-xs'>
                    Where are you working now? What are you interested in?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </article>

      <div className='fixed bottom-20 left-0 w-full text-center shadow-lg'>
        <Button
          className='h-12 w-64 rounded-xl text-base'
          form='form'
          type='submit'
          disabled={isDisabled}
        >
          {form.formState.isSubmitting ? <Spinner className='!size-5' /> : 'Next'}
        </Button>
      </div>
    </>
  );
};

export default SetupProfile;
