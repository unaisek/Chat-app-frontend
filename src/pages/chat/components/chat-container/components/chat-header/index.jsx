import { useAppStore } from '@/store'
import { RiCloseFill  } from 'react-icons/ri'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';
const ChatHeader = () => {

  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between">
      <div className="flex items-center gap-5 w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className=" ms-4 w-10 h-10 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    className="object-cover w-full h-full bg-red-700"
                  />
                ) : (
                  <div
                    className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full  ${getColor(
                      selectedChatData.selectedColour
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>
          <div>
            { selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="focus:border-none text-neutral-500 focus:outline-none focus:text-white duration-300 transition-all">
            <RiCloseFill className="text-3xl" onClick={closeChat} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader