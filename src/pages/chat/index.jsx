import { useAppStore } from "@/store"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export const Chat = ()=>{
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  
  return (
    <div>Chat</div>
  )
}