import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Auth } from './pages/auth'
import { Chat } from './pages/chat'
import { Profile } from './pages/profile'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_DATA } from './utils/constants'
import { useEffect, useState,  } from 'react'

function App() {

  // eslint-disable-next-line react/prop-types
    const PrivateRoute = ({ children }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userInfo } = useAppStore();
    console.log("private Route userInofr",userInfo);
    
    const isAuthenticated = !!userInfo
     return isAuthenticated ? children : <Navigate to="/auth" />;
  }

  // eslint-disable-next-line react/prop-types
    const AuthRoute = ({ children }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    console.log(isAuthenticated,"authenticated");
    
    return isAuthenticated ? <Navigate to="/chat" /> : children;
   
  };

  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const getUserData = async () =>{
      try {
        const response = await apiClient.get(GET_USER_DATA, {withCredentials: true});
        console.log({response});
        if(response.status === 200 && response.data.id){
          setUserInfo(response.data )
        } else {
          setUserInfo(undefined)
        }
        
      } catch (error) {
        console.log(error);
        setUserInfo(undefined)
        
      } finally {
        setloading(false)
      }
    }
    if(!userInfo){
      getUserData()
    } else {
      setloading(false)
    }

  }, [userInfo, setUserInfo])
  
  if(loading){
    return <div>Loadign ...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile/>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
