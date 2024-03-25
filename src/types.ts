export type message = {
  imageLink: string;
  sender: user;
  sessionId: string;
  text: string;
  sentAt: string;
};

export type user = {
  username: string,
  userId: string
}

export type chat = {
  chatName: string;
  sessionId: string;
  createdAt: string;
  users: user[];
  messages: message[];
};
