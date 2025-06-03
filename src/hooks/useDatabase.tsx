/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onValue, set, push, get } from "firebase/database";
// import { getDoc, addDoc, collection } from "firebase/firestore";
import { database } from "../lib/firebase-database";
// import { v4 as uuidv4 } from "uuid";

export default function useDatabase() {
  
  const getMessageByRoom = (room: string, cb: (message: { sender: string; message: string; id: string }[]) => void) => {
    const messageRef = ref(database, `messages/${room}`);

    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray: { sender: string; message: string; id: string }[] = Object.values(data);
        cb(messagesArray);
      } else {
        cb([]);
      }
    });
    return unsubscribe;
  };

  const saveUserMessage = (message: string, room: string, username: string, id: string) => {
    const messageRef = ref(database, `messages/${room}`);
    const newMessageRef = push(messageRef);
    set(newMessageRef, {
      sender: username,
      message,
      id,
    }).catch((error) => {
      console.error("Error saving message:", error);
    });
  };

  // const saveIdByVisit = () => {
  //   let deviceId = localStorage.getItem("device_id");
  //   if (!deviceId) {
  //     deviceId = uuidv4();
  //     localStorage.setItem("device_id", deviceId);
  //   }
  // };

  // const getIDbyVisit = () => {
  //   const deviceId = localStorage.getItem("device_id");
  //   if (deviceId) {
  //     return deviceId;
  //   } else {
  //     return null;
  //   }
  // };

  const saveJoinRoom = (room: string, id: string, username: string) => {
    let joinedRoom: boolean = false;
    getRoomById(id, (room) => {
      if (room.length > 0) {
        joinedRoom = true;
        return;
      }
      joinedRoom = false;
    });
    if (!joinedRoom) {
      const roomRef = ref(database, `rooms/${room}`);
      const newRoomRef = push(roomRef);
      set(newRoomRef, {
        room,
        username,
        id,
      }).catch((error) => {
        console.error("Error saving join room message:", error);
      });
    }
  };

  const getRoomById = (id: string, cb: (room: { room: string; username: string; id: string }[]) => void) => {
    const roomRef = ref(database, `rooms`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Flatten all room join entries into a single array
        const roomsArray: { room: string; username: string; id: string }[] = Object.values(data).flatMap(
          (roomEntries) =>
            Object.values(roomEntries as { [key: string]: { room: string; username: string; id: string } })
        );
        // Filter by id
        const filteredRooms = roomsArray.filter((room) => room.id === id);
        // Uniq by room name
        const uniqRooms = Object.values(
          filteredRooms.reduce((acc, curr) => {
            acc[curr.room] = curr;
            return acc;
          }, {} as Record<string, { room: string; username: string; id: string }>)
        );
        cb(uniqRooms);
      } else {
        cb([]);
      }
    });
    return unsubscribe;
  };

  const getAllRooms = (cb: (room: { room: string }[]) => void) => {
    const roomRef = ref(database, `rooms`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Flatten all room join entries into a single array
        const roomsArray: { room: string }[] = Object.values(data).flatMap((roomEntries) =>
          Object.values(roomEntries as { [key: string]: { room: string } })
        );
        // Uniq by room name
        const uniqRooms = Object.values(
          roomsArray.reduce((acc, curr) => {
            acc[curr.room] = curr;
            return acc;
          }, {} as Record<string, { room: string }>)
        );
        cb(uniqRooms);
      } else {
        cb([]);
      }
    });
    return unsubscribe;
  };

  const signInGoogle = async (email: string | null, username: string | null, id: string | null) => {
    if (!email) {
      console.error("Email is required");
      return;
    }

    try {
      const snapshot = await get(ref(database, "users"));

      const users = snapshot.val() || {};

      // Check if email already exists
      const emailExists = Object.values(users).some((user: any) => user.email === email);

      if (emailExists) {
        console.log("User already exists with this email");
        return;
      }

      const userRef = ref(database, `users/${id}`);

      await set(userRef, {
        id,
        email,
        username,
      });

      console.log("User signed in successfully");
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return {
    getMessageByRoom,
    saveUserMessage,
    // saveIdByVisit,
    // getIDbyVisit,
    saveJoinRoom,
    getRoomById,
    getAllRooms,
    signInGoogle,
  };
}
