import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";


const MessageContainer = () => {

  const {
    selectedChatData,
    selectedChatType,
    selectedChatMessages,
    setSelectedChatMessages,
    messageFetched,
    setMessageFetched,
    setFileDownloadProgress,
    setIsDownloading,
    userInfo
  } = useAppStore();
  const scrollRef = useRef()
  const  [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null)
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
    
    const getChannelMessages = async () =>{
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
          setMessageFetched(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if(selectedChatData._id){
      if(selectedChatType === "contact" && !messageFetched) {
        getMessages();
      } else if (selectedChatType === "channel" && !messageFetched) {
        getChannelMessages();
      }
    }
  }, [
    selectedChatData,
    selectedChatType,
    setSelectedChatMessages,
    selectedChatMessages,
    messageFetched,
    setMessageFetched,
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
  
  const downloadFile =  async(url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0)
    const response = await apiClient.get(`${HOST}/${url}`,{
      responseType: "blob",
      onDownloadProgress: (ProgressEvent) => {
        const { loaded, total} = ProgressEvent;
        const percentCompleted = Math.round((loaded * 100)/ total)
        setFileDownloadProgress(percentCompleted);
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download",url.split('/').pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0)
  }

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate ;
      lastDate = messageDate
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {
            selectedChatType === "contact" && renderedDMMessage(message)
          }
          { selectedChatType === "channel" && renderChannelMessages(message)}
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
            <div className="cursor-pointer"
            
            onClick={() => {
              setShowImage(true);
              setImageUrl(message.fileUrl)
              }}>
              <img
                src={`${message.fileUrl}`}
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

  const renderChannelMessages = (message) => {   
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block rounded my-1 max-w-[50%] break-words p-3 ml-5`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block rounded my-1 max-w-[50%] break-words p-2`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 text-2xl rounded-full p-3 hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={`${message.sender.image}`}
                  className="object-cover w-full h-full bg-red-700"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg  flex items-center justify-center rounded-full  ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">
              {`${message.sender.firstName} ${message.sender.lastName}`}
            </span>
            <span className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[60vw] lg:w-[60vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="z-[1000] fixed top-0 left-0 h-[100vh] w-[100vw] flex justify-center items-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${imageUrl}`}
              alt=""
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="fixed top-0 gap-5 flex mt-2">
            <button
              className="bg-black/20 text-2xl rounded-full p-3 hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                downloadFile(imageUrl)
              }}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 text-2xl rounded-full p-3 hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setImageUrl(null);
                setShowImage(false);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageContainer