
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 pl-60">
        <div className="fixed top-0 right-0 left-60 z-10">
          <Header title={title} />
        </div>
        <main className="flex-1 overflow-auto pt-14">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
