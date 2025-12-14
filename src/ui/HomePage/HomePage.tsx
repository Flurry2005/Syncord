import SocialsSidebar from "./SocialsSideBar";
import "../css/HomePage.css";
import ChatSection from "./ChatSection";
import { FriendsProvider } from "./context/FriendsContext";

interface HomePageProps {
  logout: (val: boolean) => void;
  username: string;
}

function HomePage({ logout, username }: HomePageProps) {
  return (
    <main className="p-1 w-full h-full">
      <div className="flex border border-neutral-600 rounded-2xl w-full h-full overflow-hidden">
        <FriendsProvider>
          <SocialsSidebar logout={logout} username={username}></SocialsSidebar>
          <ChatSection username={username}></ChatSection>
        </FriendsProvider>
      </div>
    </main>
  );
}

export default HomePage;
