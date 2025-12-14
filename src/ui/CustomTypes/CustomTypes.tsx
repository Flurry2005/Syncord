export type Friend = {
  username: string;
  online: boolean;
  chat: Message[];
};

export type Message = {
  username: string;
  msg: string;
};
