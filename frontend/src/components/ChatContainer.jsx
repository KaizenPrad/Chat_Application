import { useEffect } from "react";
import { useChatStore } from "../store/UseChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/UseAuthStore";

import {formatMessageTime} from '../lib/utils'
import { useRef } from "react";
const ChatContainer = () => {
  // 1. ALL HOOKS MUST BE AT THE TOP
  const { messages, getMessages, isMessageLoading, selectedUser , subscribeToMessages, 
    unsubscribeFromMessages
  } = useChatStore(); // Hook #1 (Correct)
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => { // Hook #2 (Moved to the top, so it runs on every render)
    // We add a conditional check INSIDE the hook to prevent errors if selectedUser is null/undefined
    if (selectedUser?._id) {
        getMessages(selectedUser._id);

        subscribeToMessages(); 

        return () => unsubscribeFromMessages();
    }
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]); // Changed dependency to selectedUser

  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behavior: 'smooth'})

    }
  },[messages])

  // 2. CONDITIONAL RETURN (Follows all hooks)
  if (isMessageLoading) {
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <MessageSkeleton/>
            <MessageInput/>
        </div>
    );
  }

  // 3. Main render logic
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
        {messages.map((message)=>(
          <div
          key={message._id}
          className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
          ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img 
                src={message.senderId === authUser._id ? authUser.profilePic || '/avatar.png' : selectedUser.profilePic || '/avatar.png'} 
                alt="profile pic" />

              </div>
            </div>
            <div className="chat-header mb-1 ">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
             <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer;