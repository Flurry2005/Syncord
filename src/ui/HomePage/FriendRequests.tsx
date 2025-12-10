interface FriendRequestsProps {
  friendRequests: string[];
}

function FriendRequests({ friendRequests }: FriendRequestsProps) {
  const handleFriendRequest = async (
    event: React.MouseEvent<HTMLButtonElement>,
    username: string,
    accept: boolean
  ) => {
    const p = event.currentTarget.parentElement;
    // @ts-ignore
    const res = await window.electron.friendRequestDecision(username, accept);

    if (res.success) {
      p instanceof HTMLElement && p.remove();
    }
  };

  return (
    <ul className="flex flex-col items-center gap-2 w-full">
      {friendRequests.map((username: string, index: number) => (
        <p
          key={index}
          className="box-content flex justify-around items-center my-1 rounded w-9/10 h-8 font-semibold text-center"
        >
          {username}
          <button
            className="border-(-accent-color) w-1 h-1 flex justify-items-center items-center justify-center"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              handleFriendRequest(event, username, true)
            }
          >
            +
          </button>
          <button
            className="border-(-accent-color) w-1 h-1  flex justify-items-center items-center justify-center"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              handleFriendRequest(event, username, false)
            }
          >
            -
          </button>
        </p>
      ))}
    </ul>
  );
}

export default FriendRequests;
