import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef } from "react";
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'

const MessageContainer = () => {

  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    messageFetched,
    setMessageFetched,
  } = useAppStore();
  const scrollRef = useRef()

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
          setMessageFetched(true)
        }
      } catch (error) {
        console.log(error);       
      }
    }
    if(selectedChatData._id){
      if(selectedChatType === "contact" && !messageFetched) {
        getMessages();
      }
    }
  }, [
    selectedChatData,
    selectedChatType,
    setSelectedChatMessages,
    selectedChatMessages,
    messageFetched,
    setMessageFetched
  ]);

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behaviour: "smooth"})
    }
  }, [selectedChatMessages])

  const checkIfImage = (filePath)=>{
    const imageRegex = /\.(jpg|jpeg|webp|png|gif|bmp|tif|tiff|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath)
  }
  
  const downloadFile = (file) => {

  }

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate ;
      lastDate = messageDate
      return (
        <div key={message}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {
            selectedChatType === "contact" && renderedDMMessage(message)
          }
        </div>
      )
    })
  }
  const renderedDMMessage = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      } `}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block rounded my-1 max-w-[50%] break-words p-2`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block rounded my-1 max-w-[50%] break-words p-2`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div className="cursor-pointer ">
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split('/').pop()}</span>
              <span className="bg-black/20 text-2xl rounded-full p-3 hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={()=>downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600 ">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[60vw] lg:w-[60vw] xl:w-[80vw] w-full">
      {renderMessages()}
    </div>
  )
}

export default MessageContainer