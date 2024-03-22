export type message = {
  imageLink: string;
  senderName: string;
  sessionId: string;
  text: string;
  sentAt: string;
};

export type user = {
  username: string;
  userId: string;
};

export type chat = {
  sessionId: string;
  createdAt: string;
  users: user[];
  messages: message[];
};
