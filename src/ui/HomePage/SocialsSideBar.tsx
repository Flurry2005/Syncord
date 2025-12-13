import { useEffect, useRef, useState } from "react";
import "../css/ServerNavMenu.css";
import FriendsList from "./Friends";
import FriendRequests from "./FriendRequests";
import { useFriends } from "./context/FriendsContext";
import UserBanner from "./UserBanner";

interface SocialsSidebarProps {
  username: string;
  logout: (val: boolean) => void;
}

type Friend = {
  username: string;
  online: boolean;
};

export default function SocialsSidebar({
  username,
  logout,
}: SocialsSidebarProps) {
  const friendsElements = useRef<HTMLParagraphElement[]>([]);
  const [placeholder, setPlaceholder] = useState("Enter username...");
  const [friendRequestUsername, setFriendRequestUsername] = useState("");
  const [friendsMode, setFriendsMode] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setfriendRequests] = useState<string[]>([]);
  const { setSelectedFriend } = useFriends();

  // Fetch friend on first load
  useEffect(() => {
    let handleFriendOnline: (data: any) => void;
    let handleFriendOffline: (data: any) => void;

    (async () => {
      await handleGetFriends();

      handleFriendOnline = (data: any) => {
        const username = data.username;

        setFriends((prev) =>
          prev.map((friend) =>
            friend.username === username ? { ...friend, online: true } : friend
          )
        );
      };

      handleFriendOffline = (data: any) => {
        const username = data.username;

        setFriends((prev) =>
          prev.map((friend) =>
            friend.username === username ? { ...friend, online: false } : friend
          )
        );
      };

      // @ts-ignore
      window.electron.onFriendOnline(handleFriendOnline);
      // @ts-ignore
      window.electron.onFriendOffline(handleFriendOffline);

      // @ts-ignore
      window.electron.emit("frontend_ready");
    })();

    return () => {
      if (handleFriendOnline) {
        // @ts-ignore
        window.electron.offFriendOnline(handleFriendOnline);
      }
      if (handleFriendOffline) {
        // @ts-ignore
        window.electron.offFriendOffline(handleFriendOffline);
      }
    };
  }, []);

  useEffect(() => {
    console.log("Friends updated:", friends);
  }, [friends]);

  const handleGetFriends = async () => {
    //@ts-ignore
    const result = await window.electron.retrieveFriends();
    if (!result) setFriends([]);

    if (result.success) {
      const friendsList = result.data;

      setFriends(
        friendsList.map((u: string) => ({
          username: u,
          online: false,
        }))
      );
    } else {
      setFriends([]);
    }
  };
  const handleRetrieveFriendRequests = async () => {
    //@ts-ignore
    const result = await window.electron.retrieveFriendRequests();
    if (!result) setfriendRequests([]);
    console.log(Array.isArray(result.data));
    if (result.success) {
      const friendRequestsList = result.data;
      console.log(friendRequestsList);
      setfriendRequests(friendRequestsList);
    } else {
      console.log("Error" + result.data);
      setfriendRequests([]);
    }
  };

  const handleSetFriendsMode = async (mode: boolean) => {
    setFriendsMode(mode);
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
    setSelectedFriend(p.textContent);
  };

  return (
    <nav className="justify-items-center grid grid-rows-[.1fr_.2fr_.3fr_3fr_.4fr_.2fr] bg-neutral-900 w-60 h-full">
      <h1>Social</h1>
      <div className="flex gap-4">
        <button
          className="flex justify-center justify-items-center items-center h-7"
          onClick={() => handleSetFriendsMode(true)}
        >
          <i className="fa-user-group flex justify-items-center items-center text-center fa-solid"></i>
        </button>
        <button
          className="flex justify-center justify-items-center items-center h-7"
          onClick={() => {
            handleRetrieveFriendRequests();
            handleSetFriendsMode(false);
          }}
        >
          <i className="fa-user-group flex justify-items-center items-center text-center fa-solid"></i>
          ?
        </button>
      </div>
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
          className="flex justify-center justify-items-center items-center h-7"
          onClick={handleSendFriendRequest}
        >
          <i className="fa-user-group flex justify-items-center items-center text-center fa-solid"></i>
          +
        </button>
      </div>
      {friendsMode ? (
        <FriendsList
          handleGetFriends={handleGetFriends}
          handleFriendBannerClick={handleFriendBannerClick}
          friends={friends}
          friendsElements={friendsElements}
        />
      ) : (
        <FriendRequests friendRequests={friendRequests} />
      )}
      <UserBanner uname={username} />
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
