'use client';

import { useForm } from 'react-hook-form';
import { Header, HeaderWithDepth } from '../../_layouts/header';
import { Profile, ProfileSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/app/context';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Spinner } from '@/components/ui/spinner';
import { updateProfile } from './actions';
import { useToast } from '@/hooks/use-toast';

const Page = () => {
  const user = useUser();
  const { toast } = useToast();

  const form = useForm<Profile>({
    mode: 'all',
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name ?? '',
      bio: user.bio ?? '',
      topics: user.topics ?? [],
    },
  });

  const handleSubmit = async (values: Profile) => {
    try {
      await updateProfile(values);
      toast({ title: 'Successfully updated!' });
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
      <HeaderWithDepth
        path='/setting'
        title='Profile'
      />

      <div className='w-full space-y-6 px-6'>
        <div className='space-y-3 py-8 text-center'>
          <Avatar className='mx-auto size-20'>
            <AvatarImage src={user.avatar_url ?? ''} />
            <AvatarFallback>{user.name?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className='text-muted-foreground'>{`@${user.username}`}</p>
        </div>

        <Form {...form}>
          <form
            className='space-y-6'
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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

            {form.formState.isDirty && (
              <Button
                className='w-full'
                size='lg'
                type='submit'
                disabled={isDisabled}
              >
                {form.formState.isSubmitting ? <Spinner className='!size-5' /> : 'Submit'}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </>
  );
};

export default Page;
