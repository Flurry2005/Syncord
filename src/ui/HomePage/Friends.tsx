import React from "react";

interface FriendsListProps {
  handleGetFriends: () => void;
  friends: string[];
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
  );
}

export default FriendsList;
