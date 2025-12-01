import { useEffect, useState } from "react";
import "./css/ServerNavMenu.css";

interface SocialsSidebarProps {
  logout: (val: boolean) => void;
}

export default function SocialsSidebar({ logout }: SocialsSidebarProps) {
  const [friends, setFriends] = useState<string[]>([]);

  // Fetch friend on first load
  useEffect(() => {
    handleGetFriends();
  }, []);

  const handleGetFriends = async () => {
    //@ts-ignore
    const result = await window.electron.retrieveFriends();
    if (!result) setFriends([]);

    if (result.success) {
      const friendsList = result.data;
      console.log(friendsList);
      setFriends(friendsList);
    } else {
      setFriends([]);
    }
  };

  return (
    <nav className="justify-items-center grid grid-rows-[.2fr_3fr_.2fr] bg-neutral-900 w-[10%] h-full">
      <div className="flex justify-around items-center">
        <label htmlFor="friend-request-field"></label>
        <input
          id="friend-request-field"
          placeholder="Enter username to add..."
          className="box-border bg-neutral-900 px-0.5 border border-neutral-800 focus:border-[#747bff] rounded-sm outline-none w-8/12"
          type="text"
        />
        <button className="flex items-center h-3/8">{">"}</button>
      </div>
      <ul className="flex flex-col items-center gap-2 w-full">
        <button onClick={handleGetFriends} className="border-(-accent-color)">
          Fetch friends
        </button>
        {friends.map((element: string, index: number) => (
          <p
            key={index}
            className="flex justify-center items-center my-1 border rounded-4xl w-8/10 h-1/25 text-center"
          >
            {element}
          </p>
        ))}
      </ul>

      <button
        className="flex justify-center items-center bg-red-700! border-0! w-3/4 h-3/4"
        onClick={() => logout(false)}
      >
        {"<-"}
      </button>
    </nav>
  );
}
