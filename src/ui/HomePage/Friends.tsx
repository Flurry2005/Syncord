import React from "react";
import type { Friend } from "./CustomTypes";
interface FriendsListProps {
  handleGetFriends: () => void;
  friends: Friend[];
  friendsElements: React.RefObject<HTMLParagraphElement[]>;
  handleFriendBannerClick: (
    event: React.MouseEvent<HTMLParagraphElement>
  ) => Promise<void>;
}

function FriendsList({
  handleGetFriends,
  friends,
  friendsElements,
  handleFriendBannerClick,
}: FriendsListProps) {
  return (
    <ul className="flex flex-col items-center gap-2 w-full">
      {/* <button onClick={handleGetFriends} className="border-(-accent-color)">
        Fetch friends
      </button> */}
      {friends.map((friend: Friend, index: number) => (
        <p
          key={index}
          ref={(el) => {
            if (el) friendsElements.current[index] = el;
          }}
          className="box-content flex justify-center items-center gap-5 my-1 rounded w-9/10 h-8 font-semibold text-center"
          onClick={handleFriendBannerClick}
        >
          {friend.username}
          {friend.online ? (
            <span className="bg-green-500 mr-5 rounded-[50%] w-3 h-3" />
          ) : (
            <span className="bg-red-500 mr-5 rounded-[50%] w-3 h-3" />
          )}
        </p>
      ))}
    </ul>
  );
}

export default FriendsList;
