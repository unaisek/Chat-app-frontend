import { useAppStore } from "@/store"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export const Chat = ()=>{
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(userInfo,"chat page user INof");
    
    if(!userInfo.profileSetup){
      toast("please setup profile to continue");
      navigate("/profile")
    }
  }, [userInfo,navigate])
  
  return (
    <div>Chat</div>
  )
}