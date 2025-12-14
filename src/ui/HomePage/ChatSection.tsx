import { useEffect, useState } from "react";
import { useFriends } from "./context/FriendsContext";
import ChatTextArea from "../components/ChatTextArea";

interface ChatSectionProps {
  username: string;
}

type FriendChat = {
  username: string;
  chatLog: Message[];
};

type Message = {
  username: string;
  msg: string;
};

function ChatSection({ username }: ChatSectionProps) {
  const [textConent, setTextContent] = useState("");
  const { selectedFriend, friends } = useFriends();
  const [friendChats, setFriendChats] = useState<FriendChat[]>([]);

  useEffect(() => {
    // Setup friends chat
    let arr: FriendChat[] = [];

    friends.forEach((username: string) => {
      friendChats.forEach((friendChat) =>
        friendChat.username === username
          ? {
              ...friendChat,
              chatLog: [...friendChat.chatLog],
            }
          : arr.push({ username: username, chatLog: [] })
      );
    });

    setFriendChats(arr);
  }, [friends]);

  const handleSendMessage = async () => {
    setFriendChats((prev) =>
      prev.map((friendChat) =>
        friendChat.username === selectedFriend
          ? {
              ...friendChat,
              chatLog: [
                ...friendChat.chatLog,
                { username: "Me", msg: textConent },
              ],
            }
          : friendChat
      )
    );

    console.log(friendChats);

    setTextContent("");
  };

  return (
    <section className="relative w-full h-full">
      {selectedFriend != null ? (
        <section className="flex flex-col justify-center gap-4 w-full h-full">
          <p className="inline-block relative bg-blue-700 mt-2 ml-2 px-10 py-2 rounded-xl w-max">
            {selectedFriend + " - Chat"}
          </p>
          <div className="self-center bg-neutral-900 rounded-2xl w-9/10 h-8/10">
            {friendChats.map((friendChat) => {
              if (friendChat.username === selectedFriend) {
                return friendChat.chatLog.map((message, index) => {
                  return (
                    <p key={index}>
                      {message.username}: {message.msg}
                    </p>
                  );
                });
              }
            })}
          </div>
          <ChatTextArea
            value={textConent}
            onChange={(e) => setTextContent(e.target.value)}
            onKeyDown="Enter"
            onKeyDownFunc={handleSendMessage}
          />
        </section>
      ) : (
        <p>No friend selected!{username}</p>
      )}
    </section>
  );
}

export default ChatSection;
