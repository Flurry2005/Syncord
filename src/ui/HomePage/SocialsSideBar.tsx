import { useEffect, useRef, useState } from "react";
import "../css/ServerNavMenu.css";
import FriendsList from "./Friends";
import FriendRequests from "./FriendRequests";
import { useFriends } from "./context/FriendsContext";
import UserBanner from "./UserBanner";
import InputField from "../components/InputField";
import type { Friend } from "../CustomTypes/CustomTypes";

interface SocialsSidebarProps {
  username: string;
  logout: (val: boolean) => void;
}

export default function SocialsSidebar({
  username,
  logout,
}: SocialsSidebarProps) {
  const friendsElements = useRef<HTMLParagraphElement[]>([]);
  const [placeholder, setPlaceholder] = useState("Enter username...");
  const [friendRequestUsername, setFriendRequestUsername] = useState("");
  const [friendsMode, setFriendsMode] = useState(true);
  const { setFriends } = useFriends();
  const [friendRequests, setfriendRequests] = useState<string[]>([]);
  const { setSelectedFriend } = useFriends();

  // Fetch friend on first load
  useEffect(() => {
    let handleFriendOnline: (data: any) => void;
    let handleFriendOffline: (data: any) => void;
    let handleUpdateFriends: (data: any) => void;

    (async () => {
      await handleGetFriends();

      handleFriendOnline = (data: any) => {
        const username = data.username;

        setFriends((prev: Friend[]) =>
          prev.map((friend: Friend) =>
            friend.username === username ? { ...friend, online: true } : friend
          )
        );
      };

      handleFriendOffline = (data: any) => {
        const username = data.username;

        setFriends((prev: Friend[]) =>
          prev.map((friend: Friend) =>
            friend.username === username ? { ...friend, online: false } : friend
          )
        );
      };

      handleUpdateFriends = async () => {
        await handleGetFriends();
      };

      // @ts-ignore
      window.electron.onFriendOnline(handleFriendOnline);
      // @ts-ignore
      window.electron.onFriendOffline(handleFriendOffline);
      // @ts-ignore
      window.electron.onUpdateFriends(handleUpdateFriends);

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
      // @ts-ignore
      if (handleUpdateFriends)
        // @ts-ignore
        window.electron.offUpdateFriends(handleFriendOffline);
    };
  }, []);

  const handleGetFriends = async () => {
    //@ts-ignore
    const result = await window.electron.retrieveFriends();
    if (!result) setFriends([]);

    if (result.success) {
      const friendsList: string[] = result.data;
      setFriends((prev: Friend[]) =>
        friendsList.map((username: string) => {
          const alreadyExists: boolean = prev.some(
            (friend) => friend.username === username
          );
          return alreadyExists
            ? prev.find((friend) => friend.username === username)! // keep existing friend object
            : { username: username, online: false, chat: [] }; // or create a new Friend object
        })
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
      setPlaceholder(result.desc);
      setFriendRequestUsername("");
    } else {
      console.log(result);
      setPlaceholder(result.desc);
      setFriendRequestUsername("");
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
    <nav className="justify-items-center gap-2 grid grid-rows-[.3fr_.2fr_.3fr_3fr_.4fr_.2fr] bg-neutral-900 border-neutral-500 border-r w-60 h-full">
      <h1 className="flex justify-center items-center border-neutral-600 border-b w-9/10 font-semibold text-center">
        Social
      </h1>

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

      <div className="flex flex-col justify-center items-center gap-2 w-full">
        <h1 className="flex justify-center items-center border-neutral-600 border-b w-9/10 font-semibold text-center">
          Friend Requests
        </h1>
        <div className="flex justify-around items-center">
          <label htmlFor="friend-request-field"></label>
          <InputField
            id="friend-request-field"
            value={friendRequestUsername}
            onChange={(e) => {
              setFriendRequestUsername(e.target.value);
              setPlaceholder("Enter username...");
            }}
            placeholder={placeholder}
            type={"text"}
            additionalClasses="focus:border-[#747bff] w-8/12 h-7"
          />
          <button
            className="flex justify-center justify-items-center items-center w-1/10 h-7"
            onClick={handleSendFriendRequest}
          >
            <i className="fa-user-group flex justify-items-center items-center text-center fa-solid"></i>
            +
          </button>
        </div>
      </div>

      {friendsMode ? (
        <div className="flex flex-col items-center w-full">
          <h1 className="flex justify-center items-center border-neutral-600 border-b w-9/10 font-semibold text-center">
            Friends
          </h1>
          <FriendsList
            handleFriendBannerClick={handleFriendBannerClick}
            friendsElements={friendsElements}
          />
        </div>
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
