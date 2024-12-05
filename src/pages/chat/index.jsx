import { useAppStore } from "@/store"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import ChatContainer from "./components/chat-container";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-container";

export const Chat = ()=>{
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  
  useEffect (() => {
    if(!userInfo.profileSetup){
      toast("Please setup your profile")
      navigate("/profile")
    }
  },[userInfo, navigate])
  
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactContainer />
      <ChatContainer />
      <EmptyChatContainer />
    </div>
  )
}