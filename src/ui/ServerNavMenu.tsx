import { useEffect, useRef, useState } from "react";
import "./css/ServerNavMenu.css";

interface SocialsSidebarProps {
  logout: (val: boolean) => void;
}

export default function SocialsSidebar({ logout }: SocialsSidebarProps) {
  const friendsElements = useRef<HTMLParagraphElement[]>([]);
  const [placeholder, setPlaceholder] = useState("Enter username...");
  const [friendRequestUsername, setFriendRequestUsername] = useState("");
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

  const handleSendFriendRequest = async () => {
    //@ts-ignore
    const result = await window.electron.sendFriendRequest(
      friendRequestUsername
    );

    if (result.success) {
      console.log("Request Send!");
      setPlaceholder(result.desc);
      setFriendRequestUsername("");
    } else {
      console.log(result);
      setPlaceholder(result.desc);
      setFriendRequestUsername("");
      console.log("Failed to send friend request");
    }
  };

  const handleFriendBannerClick = async (
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    const p = event.currentTarget;
    friendsElements.current.forEach((el) => {
      el?.classList.remove("bg-white/10");
    });

    p instanceof HTMLElement && p.classList.add("bg-white/10");
  };

  return (
    <nav className="justify-items-center grid grid-rows-[.3fr_3fr_.2fr] bg-neutral-900 w-60 h-full">
      <div className="flex justify-around items-center">
        <label htmlFor="friend-request-field"></label>
        <input
          id="friend-request-field"
          value={friendRequestUsername}
          onChange={(e) => {
            setFriendRequestUsername(e.target.value);
            setPlaceholder("Enter username...");
          }}
          placeholder={placeholder}
          className="box-border bg-neutral-900 px-0.5 border border-neutral-800 focus:border-[#747bff] rounded-sm outline-none w-8/12 h-7"
          type="text"
        />
        <button
          className="flex items-center h-7"
          onClick={handleSendFriendRequest}
        >
          <i className="fa-user-group fa-solid"></i>
        </button>
      </div>
      <ul className="flex flex-col items-center gap-2 w-full">
        <button onClick={handleGetFriends} className="border-(-accent-color)">
          Fetch friends
        </button>
        {friends.map((element: string, index: number) => (
          <p
            key={index}
            ref={(el) => {
              if (el) friendsElements.current[index] = el;
            }}
            className="box-content flex justify-center items-center my-1 rounded w-9/10 h-8 font-semibold text-center"
            onClick={handleFriendBannerClick}
          >
            {element}
          </p>
        ))}
      </ul>

      <button
        className="flex justify-center items-center bg-red-700! border-0! w-3/4 h-3/4"
        onClick={() => logout(false)}
      >
        <i className="fa-solid fa-door-open"></i>
        Logout
      </button>
    </nav>
  );
}
