import SocialsSidebar from "./SocialsSideBar";
import UserBanner from "./UserBanner";
import "../css/HomePage.css";

interface HomePageProps {
  logout: (val: boolean) => void;
  username: string;
}

function HomePage({ logout, username }: HomePageProps) {
  return (
    <main className="flex w-full h-full">
      <SocialsSidebar logout={logout}></SocialsSidebar>
      <section className="relative w-[100%] h-full">
        <UserBanner uname={username} />
      </section>
    </main>
  );
}

export default HomePage;
