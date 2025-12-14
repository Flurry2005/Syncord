import React, { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { Friend } from "../CustomTypes";

interface FriendsContextType {
  selectedFriend: string | null;
  setSelectedFriend: (friend: string | null) => void;
  friends: Friend[] | [];
  setFriends: Dispatch<SetStateAction<Friend[]>>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

interface FriendsProviderProps {
  children: ReactNode;
}

export const FriendsProvider: React.FC<FriendsProviderProps> = ({
  children,
}) => {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);

  return (
    <FriendsContext.Provider
      value={{ selectedFriend, setSelectedFriend, friends, setFriends }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = (): FriendsContextType => {
  const context = useContext(FriendsContext);
  if (!context)
    throw new Error("useFriends must be used within a FriendsProvider");
  return context;
};
