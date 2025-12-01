import { useState } from "react";
import ServerNavMenu from "./ServerNavMenu";
import "./css/HomePage.css";

interface HomePageProps {
  logout: (val: boolean) => void;
}

function HomePage({ logout }: HomePageProps) {
  const [friends, setFriends] = useState("");

  const handleGetFriends = async () => {
    //@ts-ignore
    const result = await window.electron.retrieveFriends();
    if (!result) setFriends("");

    if (result.success) {
      const friendsList = result.data;
      console.log(friendsList);
      setFriends(friendsList.toString());
    } else {
      setFriends("Failed to retrieve friends");
    }
  };

  return (
    <main className="main-homepage">
      <ServerNavMenu logout={logout}></ServerNavMenu>
      <section>
        <button onClick={handleGetFriends}></button>
        <p>{friends}</p>
      </section>
    </main>
  );
}

export default HomePage;
