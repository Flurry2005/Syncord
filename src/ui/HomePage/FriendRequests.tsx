import React from "react";

interface FriendRequestsProps {
  friendRequests: string[];
}

function FriendRequests({ friendRequests }: FriendRequestsProps) {
  return (
    <ul className="flex flex-col items-center gap-2 w-full">
      {friendRequests.map((element: string, index: number) => (
        <p
          key={index}
          className="box-content flex justify-around items-center my-1 rounded w-9/10 h-8 font-semibold text-center"
        >
          {element}
          <button className="border-(-accent-color) w-1 h-1 flex justify-items-center items-center justify-center">
            +
          </button>
          <button className="border-(-accent-color) w-1 h-1  flex justify-items-center items-center justify-center">
            -
          </button>
        </p>
      ))}
    </ul>
  );
}

export default FriendRequests;
