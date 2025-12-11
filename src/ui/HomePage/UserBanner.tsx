import { useEffect, useState } from "react";

interface UserBannerProps {
  uname: string;
}

function UserBanner({ uname }: UserBannerProps) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(uname);
  }, []);

  return (
    <div className="top-2 right-2 flex justify-center items-center self-center bg-neutral-900/80 border border-(--accent-color) rounded-2xl w-9/10 h-15">
      <div className="flex items-center gap-1 w-8/10">
        <h1>{username}</h1>
        <p className="bg-green-500 rounded-[50%] w-3 h-3"></p>
      </div>
    </div>
  );
}

export default UserBanner;
