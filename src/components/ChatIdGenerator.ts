// ChatIdGenerator.ts
const ChatIdGen = (): number => {
  // Logic to generate a new chat ID
  return Math.floor(10000000 + Math.random() * 90000000); // This is an example, replace with your actual logic
};

export default ChatIdGen;
