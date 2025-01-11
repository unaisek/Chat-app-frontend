export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directedMessagesContacts: [],
  messageFetched: false,
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  dMContactsAndChannelFetched: false,
  setChannels : (channels) => set({channels}),

  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),

  setIsUploading : (isUploading) => set ({isUploading}),
  setIsDownloading: (isDownloading) => set({isDownloading}),
  setFileUploadProgress: (fileUploadProgress) => ({fileUploadProgress}),
  setFileDownloadProgress: (fileDownloadProgress) => set({fileDownloadProgress}),

  setDMContactsAndChannelFetched : (dMContactsAndChannelFetched) => set({dMContactsAndChannelFetched}),


  setDirectedMessagesContacts: (directedMessagesContacts) =>
    set({ directedMessagesContacts }),

  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
      messageFetched: false
    }),


  addChannel:(channel) => {
    const channels = get().channels
    set({channels:[channel, ...channels]})
  },
  setMessageFetched: (fetched) => set({messageFetched : fetched}),

  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addChannelInChannelList : (message) => {
    const channels = get().channels
    const data = channels.find((channel)=> channel._id === message.channelId);
    const index = channels.findIndex((channel) => channel._id === message.channelId);
    if(index !== -1 && index !== undefined){
      channels.splice(index, 1);
      channels.unshift(data)
    }
  },
  addContactInDMContacts : (message) => {
    const userId = get().userInfo.id;
    const fromId = 
      message.sender._id === userId
      ? message.recipient._id 
      : message.sender._id
    
    const fromData = message.sender._id === userId ? message.recipient : message.sender;
    const dmContacts = get().directedMessagesContacts;
    const data = dmContacts.find((contact) => contact._id === fromId);
    const index = dmContacts.findIndex((contact)=> contact._id === fromId);
    if (index !== -1 && index !== undefined){
      dmContacts.splice(index,1);
      dmContacts.unshift(data)
    }  else {
      dmContacts.unshift(fromData)
    }
    set({directedMessagesContacts: dmContacts})
  }
});