import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const Page = () => {
  return (
    <>
      <header className='flex h-20 items-center px-6'>
        <h1 className='text-3xl font-semibold'>Hackerhouse</h1>
      </header>

      <ul>
        {LIST.map((item) => (
          <li key={item.name}>
            <Link
              className='flex items-center gap-6 px-6 py-5 transition-colors hover:bg-muted/20'
              href={`/chat/dm/${item.username}`}
            >
              <Avatar className='round-full size-10'>
                <AvatarImage src={item.avatar} />
                <AvatarFallback>{item.name[0]}</AvatarFallback>
              </Avatar>

              <div className='w-full'>
                <div className='flex w-full items-center'>
                  <span className='grow text-base font-medium'>{item.name}</span>
                  <span className='text-xs text-foreground/60'>{item.datetime}</span>
                </div>
                <p className='text-sm text-muted-foreground'>{item.message}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

const LIST = [
  {
    name: 'Jack Ma',
    username: 'jackma',
    datetime: '30s',
    message: 'Hey i wanna invest ur company',
    avatar: 'https://lh3.googleusercontent.com/ogw/AF2bZyiA3UusaUTOrp5odCUbYu29ntZGKbzEmWYAM3w_13zYvgM=s64-c-mo',
  },
  {
    name: 'Elon Musk',
    username: 'elonmusk',
    datetime: '30s',
    message: 'nice try bro',
    avatar: 'https://lh3.googleusercontent.com/ogw/AF2bZyiA3UusaUTOrp5odCUbYu29ntZGKbzEmWYAM3w_13zYvgM=s64-c-mo',
  },
];

export default Page;
