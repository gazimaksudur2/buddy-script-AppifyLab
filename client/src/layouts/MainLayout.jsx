import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
