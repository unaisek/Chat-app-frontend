import { useAppStore } from '@/store'
import { RiCloseFill  } from 'react-icons/ri'
const ChatHeader = () => {

  const { closeChat } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="flex gap-3 items-center justify-center"></div>
        <div className="flex items-center justify-center gap-5">
          <button className='focus:border-none text-neutral-500 focus:outline-none focus:text-white duration-300 transition-all'>
            <RiCloseFill className='text-3xl' onClick={closeChat} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader