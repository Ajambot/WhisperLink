export type message = {
  file: { link: string; type: "image" | "other" } | undefined;
  sender: user;
  sessionId: string;
  text: string;
  sentAt: string;
};

export type user = {
  username: string;
  userId: string;
};

export type chat = {
  chatName: string;
  sessionId: string;
  createdAt: string;
  users: user[];
  messages: message[];
};
