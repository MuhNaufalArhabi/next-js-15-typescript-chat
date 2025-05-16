/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ChatForm from "@/component/chat-form";
import ChatMessage from "@/component/chat-message";
import { socket } from "@/lib/socket-io-client";
import useDatabase from "@/hooks/useDatabase";

export default function Home() {
  const [messages, setMessages] = React.useState<{ sender: string; message: string; id: string }[]>([]);
  const [room, setRoom] = React.useState<string>("");
  const [joined, setJoined] = React.useState<boolean>(false);
  const [userName, setUserName] = React.useState<string>("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const firebaseDB = useDatabase();
  const [idUser, setIdUser] = React.useState<string>("");
  const [ownRoom, setOwnRoom] = React.useState<{ room: string; username: string; id: string }[]>([]);
  const [getHistoryMesageByRoom, setGetHistoryMessageByRoom] = React.useState<boolean>(false);
  // const [allRooms, setAllRooms] = React.useState<{ room: string }[]>([]);

  const handleChatMessage = (message: string) => {
    const data = { room, message, sender: userName, id: idUser };
    setMessages((prevMessages) => [...prevMessages, { sender: userName, message, id: idUser }]);
    socket.emit("message", data);
    firebaseDB.saveUserMessage(message, room, userName, idUser || "");
  };

  const handleJoinRoom = (room: string, username: string) => {
    if (room && username) {
      socket.emit("join-room", { room, username: username });
      firebaseDB.saveJoinRoom(room, idUser || "", username);
      setJoined(true);
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio("/notif-wa.mp3");
    audio.play().catch((error) => {
      console.error("Error playing notification sound:", error);
    });
  };

  React.useEffect(() => {
    firebaseDB.saveIdByVisit();

    // const unsubscribe = firebaseDB.getAllRooms((roomData) => {
    //   setAllRooms(roomData);
    // });
    socket.on("message", (data) => {
      playNotificationSound();
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    socket.on("user-joined", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, { sender: "system", message, id: "" }]);
    });

    return () => {
      socket.off("user-joined");
      socket.off("message");
      // unsubscribe(); // Clean up the listener when component unmounts
    };
  }, []);

  React.useEffect(() => {
    const deviceId = firebaseDB.getIDbyVisit();
    if (deviceId) {
      setIdUser(deviceId);
    }
  }, []);

  React.useEffect(() => {
    if (idUser) {
      firebaseDB.getRoomById(idUser, (roomData) => {
        setOwnRoom(roomData);
      });
    }
  }, [idUser]);

  React.useEffect(() => {
    // Scroll every time messages change
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    if (!room && getHistoryMesageByRoom) return;

    const unsubscribe = firebaseDB.getMessageByRoom(room, (message) => {
      setMessages(message);
    });
    setGetHistoryMessageByRoom(true);

    return () => {
      unsubscribe(); // Clean up the listener when component unmounts or room changes
    };
  }, [room, getHistoryMesageByRoom]);

  console.log(messages)

  return (
    <div className="flex mt-24 justify-center w-full">
      <div className="flex gap-8 flex-start w-full">
        <div className="flex flex-col items-center bg-gray-50 w-1/8 h-[600px] overflow-y-auto rounded-lg p-4 shadow-md ml-10">
          <h1 className="mb-4 text-xl font-bold text-center">Joined Chat Rooms</h1>
          {ownRoom.map((roomData, index) => (
            <div
              key={index}
              className="mb-2 w-14 text-wrap bg-blue-300 text-center rounded-lg px-2 py-1 cursor-pointer hover:bg-blue-500 hover:text-white"
              onClick={() => {
                setJoined(true);
                setRoom(roomData.room);
                setUserName(roomData.username);
                handleJoinRoom(roomData.room, roomData.username);
              }}
            >
              {roomData.room}
            </div>
          ))}
        </div>
        {/* <div className="flex flex-col items-center bg-gray-50 w-1/8 h-[600px] rounded-lg p-4 shadow-md">
          <h1 className="mb-4 text-xl font-bold">Available Chat Rooms</h1>
          {allRooms.map((roomData, index) => (
            <div key={index} className="mb-2 w-14 text-wrap bg-blue-300 text-center rounded-lg px-2 py-1">
              {roomData.room}
            </div>
          ))}
        </div> */}
        {!joined ? (
          <div className="flex flex-col items-center w-3/4">
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
              onClick={() => handleJoinRoom(room, userName)}
            >
              Join Room
            </button>
          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4 mx-2">
              <h1 className="text-2xl font-bold">Room: {room}</h1>
              <h1 className="text-2xl font-bold">User: {userName}</h1>
              <button
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
                onClick={() => {
                  setJoined(false);
                  setRoom("");
                  setUserName("");
                  setMessages([]);
                }}
              >
                Back
              </button>
            </div>
            <div
              className="h-[500px] overflow-y-auto border-2 border-gray-200 rounded-lg p-4 mb-4 bg-gray-200"
              ref={containerRef}
            >
              {messages.map((msg, index) => (
                <ChatMessage key={index + msg.id} isOwnMessage={msg.id === idUser} sender={msg.sender} message={msg.message} />
              ))}
            </div>
            <ChatForm onSendMessage={handleChatMessage} />
          </div>
        )}
      </div>
    </div>
  );
}
