import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface FriendsContextType {
  selectedFriend: string | null;
  setSelectedFriend: (friend: string | null) => void;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

interface FriendsProviderProps {
  children: ReactNode;
}

export const FriendsProvider: React.FC<FriendsProviderProps> = ({
  children,
}) => {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  return (
    <FriendsContext.Provider value={{ selectedFriend, setSelectedFriend }}>
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
