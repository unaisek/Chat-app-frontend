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

  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setIsUploading : (isUploading) => set ({isUploading}),
  setIsDownloading: (isDownloading) => set({isDownloading}),
  setFileUploadProgress: (fileUploadProgress) => ({fileUploadProgress}),
  setFileDownloadProgress: (fileDownloadProgress) => set({fileDownloadProgress})


  setDirectedMessagesContacts: (directedMessagesContacts) =>
    set({ directedMessagesContacts }),

  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
      messageFetched: false
    }),

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
});