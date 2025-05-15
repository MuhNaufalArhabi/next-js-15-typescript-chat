import React from "react";
import ChatForm from "@/component/chat-form";
import ChatMessage from "@/component/chat-message";
import { socket } from "@/lib/socket-io-client";

export default function Home() {
  const [messages, setMessages] = React.useState<{ sender: string; message: string }[]>([]);
  const [room, setRoom] = React.useState<string>("");
  const [joined, setJoined] = React.useState<boolean>(false);
  const [userName, setUserName] = React.useState<string>("");

  const handleChatMessage = (message: string) => {
    const data = {room, message, sender: userName};
    setMessages((prevMessages) => [...prevMessages, { sender: userName, message }]);
    socket.emit("message", data);
  };

  const handleJoinRoom = () => {
    if(room && userName) {
      console.log(room, userName, "joined");
      socket.emit("join-room", { room, username: userName });
      setJoined(true);

    }
  };

  React.useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    socket.on("user-joined", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, { sender: "system", message }]);
    });

    return () => {
      socket.off("user-joined");
      socket.off("message");
    };
  }, []);
  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <div className="flex flex-col items-center">
          <h1 className="mb-4 text-2xl font-bold">Join a Room</h1>
          <input
            type="text"
            placeholder="Enter your name"
            className="px-4 py-2 border-2 border-gray-200 rounded-lg mb-4"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter room name"
            className="px-4 py-2 border-2 border-gray-200 rounded-lg mb-4"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
            onClick={handleJoinRoom}
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Room: {room}</h1>
          <div className="h-[500px] overflow-y-auto border-2 border-gray-200 rounded-lg p-4 mb-4 bg-gray-200">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                isOwnMessage={msg.sender === userName}
                sender={msg.sender}
                message={msg.message}
              />
            ))}
          </div>
          <ChatForm onSendMessage={handleChatMessage} />
        </div>
      )}
    </div>
  );
}
