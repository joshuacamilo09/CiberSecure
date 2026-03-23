const ChatBubble = ({ message, sender, delay = 0 }) => {
  const isBully = sender === "bully";

  return (
    <div className={`flex mb-2 ${isBully ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[88%] sm:max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
          isBully
            ? "bg-destructive/10 text-destructive rounded-tl-sm"
            : "bg-secondary/10 text-secondary rounded-tr-sm"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
