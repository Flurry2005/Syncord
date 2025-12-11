import { useFriends } from "./context/FriendsContext";

interface ChatSectionProps {
  username: string;
}

function ChatSection({ username }: ChatSectionProps) {
  const { selectedFriend } = useFriends();

  return (
    <section className="relative w-full h-full">
      {selectedFriend != null ? (
        <section className="flex flex-col gap-1 w-full h-full">
          <p className="inline-block relative bg-blue-700 mt-2 ml-2 px-10 py-2 rounded-xl w-max">
            {selectedFriend + " - Chat"}
          </p>
          <div className="self-center bg-neutral-900 mt-10 rounded-2xl w-9/10 h-8/10"></div>
          <textarea className="self-center border border-(--accent-color) rounded-3xl w-9/10 h-1/10 p-3 outline-none focus:border-[#747bff]" />
        </section>
      ) : (
        <p>No friend selected!</p>
      )}
    </section>
  );
}

export default ChatSection;
