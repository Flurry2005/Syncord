export type Friend = {
  username: string;
  online: boolean;
  chat: FriendChat[];
};

export type FriendChat = {
  message: Message[];
};

export type Message = {
  username: string;
  msg: string;
};
