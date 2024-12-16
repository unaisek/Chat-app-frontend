import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS, HOST } from "@/utils/constants";

import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiselect";

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([])
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(()=> {
    const getData = async ()=> {
      const response = await apiClient.get(GET_ALL_CONTACTS,{withCredentials: true});
      setAllContacts(response.data.contacts)
    
      
    }
    getData()
  },[])

 const createChannel = async () =>{
  try {
    if(channelName.length > 0 && selectedContacts.length > 0){
      const response = await apiClient.post(`${CREATE_CHANNEL_ROUTE}`,{
        name: channelName,
        members: selectedContacts.map((contact) => contact.value)
      },{withCredentials: true});

      if(response.status === 201){
        setChannelName("");
        setSelectedContacts([]);
        setNewChannelModal(false);
        addChannel(response.data.channel)
      }
    }
  } catch (error) {
    console.log(error);
    
  }
 }
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 text-start text-opacity-90 font-light hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181620] border-none text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle>
              please fill up the details for a new channel
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none "
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white "
              defaultOptions={allContacts}
              onChange={setSelectedContacts}
              placeholder="Search contacts"
              value={selectedContacts}
              emptyIndicator = {
                <p className="text-center text-lg leading-10 text-gray-600">No result found</p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-purple-500 hover:bg-purple-900 duration-300 transition-all "
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
