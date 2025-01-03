import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({children}) =>{
  const socket = useRef();
  const { userInfo } = useAppStore()

  useEffect(() => {
    if (userInfo) {    
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
        transports: ["websocket"],
      });     

      socket.current.on("connect", () => {
        
      })

      const handleRecieveMessage = (message) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addContactInDMContacts,
        } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
                    
          addMessage(message)
        }
        addContactInDMContacts(message)
      };

      const handleChannelRecieveMessage = (message) => {          
        const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList} =
          useAppStore.getState();
        if(selectedChatType !== undefined && selectedChatData._id === message.channelId) {
          addMessage(message);
        }

        addChannelInChannelList(message);
      }

      socket.current.on("reciveMessage",handleRecieveMessage);
      socket.current.on("recieve-channel-message",handleChannelRecieveMessage);
      socket.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      return () => {
        socket.current.disconnect()
      }
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  )
}


