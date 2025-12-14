import { useEffect, useState } from "react";
import { useFriends } from "./context/FriendsContext";
import ChatTextArea from "../components/ChatTextArea";
import type { Friend, Message } from "../CustomTypes/CustomTypes";

interface ChatSectionProps {
  username: string;
}

function ChatSection({ username }: ChatSectionProps) {
  const [textConent, setTextContent] = useState("");
  const { selectedFriend, friends, setFriends } = useFriends();

  useEffect(() => {
    let handleIncomingMessage: (data: any) => void;
    let listener: any;
    (async () => {
      handleIncomingMessage = (data: any) => {
        const username = data.username;
        const message = data.message;

        setFriends((prev: Friend[]) =>
          prev.map((friend: Friend) =>
            friend.username === username
              ? {
                  ...friend,
                  chat: [...friend.chat, { username: username, msg: message }],
                }
              : friend
          )
        );
      };

      // @ts-ignore
      listener = window.electron.onIncomingMessage(handleIncomingMessage);
    })();

    return () => {
      // @ts-ignore
      window.electron.offIncomingMessage(listener);
    };
  }, []);

  const handleSendMessage = async () => {
    // @ts-ignore
    const res = await window.electron.sendMessage(selectedFriend, textConent);
    if (res.success) {
      setFriends((prev: Friend[]) =>
        prev.map((friend: Friend) =>
          friend.username === selectedFriend
            ? {
                ...friend,
                chat: [...friend.chat, { username: "Me", msg: textConent }],
              }
            : friend
        )
      );

      setTextContent("");
    }
  };

  return (
    <section className="relative w-full h-full">
      {selectedFriend != null ? (
        <section className="flex flex-col justify-center gap-4 w-full h-full">
          <p className="inline-block relative bg-blue-700 mt-2 ml-2 px-10 py-2 rounded-xl w-max">
            {selectedFriend + " - Chat"}
          </p>
          <div className="self-center bg-neutral-900 rounded-2xl w-9/10 h-8/10">
            {friends.map((friend) => {
              if (friend.username === selectedFriend) {
                return friend.chat.map(
                  ({ username, msg }: Message, index: any) => {
                    return (
                      <p key={index}>
                        {username}: {msg}
                      </p>
                    );
                  }
                );
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
