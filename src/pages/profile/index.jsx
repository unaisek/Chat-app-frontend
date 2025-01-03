import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { DELETE_PROFILE_IMAGE, HOST, UPDATE_PROFILE,UPDATE_PROFILE_IMAGE } from "@/utils/constants";

export const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hoverd, setHoverd] = useState(false);
  const [selectedColour, setSelectedColour] = useState(0);
  const fileInputRef = useRef(null)

  useEffect(()=> {
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColour(userInfo.color)
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`)  
    }
  },[userInfo,image])

  const validateProfile = () => {
    if(!firstName) {
       toast.error("first Name is required");
       return false
    }
    if (!lastName) {
      toast.error("last Name is required");
      return false;
    }
    return true
  }

  const saveChanges = async () => {
    if(validateProfile()){
      try {
        const response = await apiClient.post(UPDATE_PROFILE, {
          firstName, lastName, color: selectedColour
        }, { withCredentials:true });
        if(response.status === 200 && response.data){
          setUserInfo({...response.data});    
          toast.success("profile updated successfully");
          navigate("/chat")
        }
      } catch (error) {
        console.log(error);
        
      }
    }
  };

  const handleNavigate = () => {
    if(userInfo.profileSetup){
      navigate("/chat")
    } else {
      toast.error("please update profile")
    }
  }

  const handleFileInputClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    if(file){
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(UPDATE_PROFILE_IMAGE,formData,{withCredentials:true});
      if(response.status == 200 && response.data.image){
        setUserInfo({...userInfo, image: response.data.image });
        toast.success("profile image updated successfully")
      }       
    };
  }

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(DELETE_PROFILE_IMAGE,{withCredentials:true});
      if(response.status == 200){
        setUserInfo({...userInfo, image:null});
        toast.success("profile image deleted");
        setImage(null)
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="bg-[#1b1c24] w-[100vw] h-[100vh] flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer " onClick={handleNavigate} />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-self-center"
            onMouseEnter={() => setHoverd(true)}
            onMouseLeave={() => setHoverd(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  className="object-cover w-full h-full bg-red-700"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full  ${getColor(
                    selectedColour
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hoverd && (
              <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-full ring-fuchsia-50" onClick={image ? handleDeleteImage : handleFileInputClick}>
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer " />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer " />
                )}
              </div>
            )}
            <input type="file" ref={ fileInputRef } className="hidden" onChange={ handleImageChange } name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp"/>
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full transition-all duration-300 cursor-pointer
                ${
                  selectedColour === index
                    ? "outline outline-white/70 outline-2"
                    : ""
                }
                `}
                  key={index}
                  onClick={() => setSelectedColour(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
