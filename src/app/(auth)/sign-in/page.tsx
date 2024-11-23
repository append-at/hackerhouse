import ContinueWithGitHub from './continue-with-github';

const Page = () => {
  return (
    <section className='flex h-dvh flex-col items-center justify-center text-center'>
      <div className='mb-20'>
        <h1 className='font-display mb-1 text-5xl font-extrabold tracking-tighter'>Hackerhouse</h1>
        <p className='text-sm text-foreground/60'>Clubhouse for Hackers</p>
      </div>

      <ContinueWithGitHub />
    </section>
  );
};

export default Page;
