import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface FriendsContextType {
  selectedFriend: string | null;
  setSelectedFriend: (friend: string | null) => void;
  friends: string[] | [];
  setFriends: (friends: string[]) => void;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

interface FriendsProviderProps {
  children: ReactNode;
}

export const FriendsProvider: React.FC<FriendsProviderProps> = ({
  children,
}) => {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [friends, setFriends] = useState<string[]>([]);

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
