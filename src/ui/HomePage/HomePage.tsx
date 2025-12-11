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
    <main className="flex w-full h-full">
      <FriendsProvider>
        <SocialsSidebar logout={logout} username={username}></SocialsSidebar>
        <ChatSection username={username}></ChatSection>
      </FriendsProvider>
    </main>
  );
}

export default HomePage;
