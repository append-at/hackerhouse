import Navigation from './_layouts/navigation';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className='flex h-dvh flex-col'>
      <div className='grow'>{children}</div>
      <Navigation />
    </div>
  );
};

export default Layout;
