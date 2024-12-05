import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { Avatar,AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { Tooltip,TooltipProvider, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoLogOut } from 'react-icons/io5'
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } =useAppStore()
  const navigate = useNavigate()

  const logOut = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true});
      if(response.status == 200){
        navigate("/auth");
        setUserInfo(null)
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33] ">
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                className="object-cover w-full h-full bg-red-700"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full  ${getColor(
                  userInfo.selectedColour
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-purple-500 text-base font-medium"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
              Edit Profile
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <IoLogOut
                className="text-red-500 text-xl font-medium"
                onClick={logOut}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
              logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo