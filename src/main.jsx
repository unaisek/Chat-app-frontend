// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner'
import { SocketProvider } from './context/SocketContext';
import { Toaster as Toaster2 } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <SocketProvider>
      <App />
      <Toaster closeButton />
      <Toaster2
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
    </SocketProvider>
  </>
  // </StrictMode>,
);
