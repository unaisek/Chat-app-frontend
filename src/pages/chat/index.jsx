import { useAppStore } from "@/store"
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import ChatContainer from "./components/chat-container";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-container";

export const Chat = ()=>{
  const { userInfo, selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress
   } = useAppStore();
  const navigate = useNavigate();
  
  useEffect (() => {  
    if (userInfo && !userInfo.profileSetup) {
      
      toast.error("Please setup your profile");
      navigate("/profile");
    }
  },[userInfo, navigate])
  
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 left-0 z-10 bg-black/20 flex items-center justify-center flex-col gap-5 backdrop-blur-lg ">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 left-0 z-10 bg-black/20 flex items-center justify-center flex-col gap-5 backdrop-blur-lg ">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      )}
      <ContactContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}