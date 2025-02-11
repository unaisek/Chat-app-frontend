import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

import { useState } from "react";
import Background from "../../assets/login2.png";
import Victory from "../../assets/victory.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { apiClient } from '../../lib/api-client'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";


export const Auth = () => {

  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateSignup = ()=>{
    if(!email.length){
      toast.error("Email is required");
      return false
    }
    if(!password.length){
       toast.error("Password is required");
       return false;
    }
    if(password !== confirmPassword){
       toast.error("Password and confirm password should be same");
       return false;
    }
    return true
  }

   const validateLogin = () => {
     if (!email.length) {
       toast.error("Email is required");
       return false;
     }
     if (!password.length) {
       toast.error("Password is required");
       return false;
     }
     return true;
   };



  const handleLogin = async () => {
    try {
      if (validateLogin()) {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        setUserInfo(response.data.user);

        if (response.data.user.id) {
          toast.success("Login successful!");
          if (response.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        }
      }
    } catch (error) {    
      if (
        error.response &&
        error.response.data 
      ) {
        toast.error(error.response.data);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };
  const handleSignup = async () => {
    if(validateSignup()){
      const response = await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials:true});    
     if(response.status === 201){
      setUserInfo(response.data.user);
      navigate('/profile')
     }
      
    }
  };

  return (
    <div className="h-[100vh]  w-[100vw] flex items-center justify-center">
      <div className="h-[90vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex items-center justify-center flex-col gap-8">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl"> Welcome</h1>
              <img src={Victory} alt="Victory" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full flex">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 outline-none hover:none focus:outline-none"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 outline-none hover:none focus:outline-none"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="login"
                className="flex flex-col gap-5 mt-10 max-h-[300px]"
              >
                <Input
                  placeholder="email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent
                className="flex flex-col gap-5 max-h-[300px]"
                value="signup"
              >
                <Input
                  placeholder="email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  SignUp
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} className="h-[380px]  2xl:h-[500px]" alt="" />
        </div>
      </div>
    </div>
  );
};
