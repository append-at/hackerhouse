'use client';

import { useForm } from 'react-hook-form';
import { type Profile, ProfileSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const SetupProfile = () => {
  const form = useForm<Profile>({
    mode: 'all',
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      description: '',
    },
  });

  const handleSubmit = async (values: Profile) => {};

  const isDisabled = form.formState.isSubmitting || Object.keys(form.formState.errors).length > 0;

  return (
    <>
      <header className='w-full text-center'>
        <h1 className='mx-auto max-w-sm text-3xl font-semibold'>Finish your profile</h1>
      </header>

      <article className='flex w-full grow items-center'>
        <Form {...form}>
          <form
            className='w-full space-y-6 px-6'
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
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
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

            <div className='fixed bottom-20 left-0 w-full text-center shadow-lg'>
              <Button
                className='h-12 w-64 rounded-xl text-base'
                type='submit'
                disabled={isDisabled}
              >
                Next
              </Button>
            </div>
          </form>
        </Form>
      </article>
    </>
  );
};

export default SetupProfile;
