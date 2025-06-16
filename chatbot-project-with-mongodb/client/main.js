

// ---------------------original recent updated with only time show for users -----------------------------------------


// const chatBody = document.querySelector(".chat-body");
// const messageInput = document.querySelector(".message-input");
// const sendMessageButton = document.querySelector("#send-message");
// const fileInput = document.querySelector("#file-input");

// const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
// const fileCancelButton = document.querySelector("#file-cancel");

// const chatbotToggler = document.querySelector("#chatbot-toggler");
// const closeChatbot = document.querySelector("#close-chatbot");

// // New User Info Form elements
// const userInfoPopup = document.querySelector(".user-info-popup");
// const userInfoForm = document.querySelector("#user-info-form");
// const userNameInput = document.querySelector("#user-name");
// const userEmailInput = document.querySelector("#user-email");

// // Chat History elements
// const chatHistoryButton = document.querySelector("#chat-history");
// const chatHistorySidebar = document.querySelector(".chat-history-sidebar");
// const closeHistoryButton = document.querySelector("#close-history");
// const historyList = document.querySelector(".history-list");
// const deleteAllHistoryButton = document.querySelector("#delete-all-history");

// // Voice Assist elements
// const voiceAssistButton = document.querySelector("#voice-assist");

// // API setup
// const API_KEY = "AIzaSyCND8_k9nMfIrl8OhpVAYXoMGwh7dlR3Xs"; // Replace with your actual Gemini API Key
// const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// let currentChatId = null;
// let chatHistory = [];
// let userInfo = null; 

// const userData = {
//     message: null,
//     file: {
//         data: null,
//         mime_type: null
//     }
// };

// const initialInputHeight = messageInput.scrollHeight;
// let recognition;
// let isListening = false;

// // --- STYLE INJECTION FOR CHAT HISTORY ---
// // This function adds CSS rules dynamically to style the chat history timestamp.
// const injectHistoryStyles = () => {
//     const style = document.createElement('style');
//     style.innerHTML = `
//         .chat-history-item-content {
//             display: flex;
//             justify-content: space-between; /* This creates the gap */
//             align-items: center;
//             width: 100%; /* Ensure the container takes full width */
//         }
//         .chat-time {
//             font-size: 0.75rem; /* Reduced font size */
//             color: #6c757d; /* A slightly muted color */
//             flex-shrink: 0; /* Prevent the time from shrinking */
//             margin-left: 10px; /* Ensures a minimum gap */
//         }
//         .user-message-time {
//             font-size: 0.7rem;
//             color: #888;
//             text-align: right;
//             margin-top: 5px;
//             padding-right: 10px;
//         }
//     `;
//     document.head.appendChild(style);
// };

// // MODIFIED: Function to save chat history to localStorage for the specific user
// const saveChatHistory = () => {
//     if (!userInfo || !userInfo.email) return;
//     const userHistoryKey = `chatHistory_${userInfo.email}`;
//     localStorage.setItem(userHistoryKey, JSON.stringify(chatHistory));
// };

// // MODIFIED: Function to load chat history from localStorage for the specific user
// const loadChatHistory = () => {
//     if (!userInfo || !userInfo.email) {
//         chatHistory = [];
//         return;
//     }
//     const userHistoryKey = `chatHistory_${userInfo.email}`;
//     const savedHistory = localStorage.getItem(userHistoryKey);
//     let allUserHistory = savedHistory ? JSON.parse(savedHistory) : [];

//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
//     const oneWeekAgoTimestamp = oneWeekAgo.getTime();

//     chatHistory = allUserHistory.filter(chat => chat.lastActive && chat.lastActive >= oneWeekAgoTimestamp);
    
//     if (chatHistory.length < allUserHistory.length) {
//         saveChatHistory();
//     }
// };

// // MODIFIED: Function to format chat timestamp with new logic
// const formatChatTimestamp = (timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp);
//     const now = new Date();
//     if (isNaN(date.getTime())) return "";

//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);

//     const targetDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

//     if (targetDateOnly.getTime() === today.getTime()) {
//         // If the message is from today, show the time
//         return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
//     } else if (targetDateOnly.getTime() === yesterday.getTime()) {
//         // If the message is from yesterday, show "Yesterday"
//         return "Yesterday";
//     } else {
//         // For all other dates, show the date and month
//         return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
//     }
// };

// // NEW: Function to format message time only (for chat form)
// const formatMessageTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp);
//     if (isNaN(date.getTime())) return "";
//     return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
// };

// // Function to render chat history in the sidebar
// const renderChatHistory = () => {
//     historyList.innerHTML = "";
//     const sortedHistory = [...chatHistory].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));

//     sortedHistory.forEach(chat => {
//         const chatItem = document.createElement("li");
//         chatItem.setAttribute("data-chat-id", chat.id);

//         const firstUserMessage = chat.messages.find(msg => msg.sender === "user" && msg.type === "text");
//         let chatTitleText = "New Chat";
//         if (firstUserMessage) {
//             chatTitleText = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "");
//         } else if (chat.messages.length > 0 && chat.messages[0].content) {
//             chatTitleText = chat.messages[0].content.substring(0, 30) + (chat.messages[0].content.length > 30 ? "..." : "");
//         }

//         const chatTime = formatChatTimestamp(chat.lastActive);

//         chatItem.innerHTML = `
//             <div class="chat-history-item-content">
//                 <span class="chat-title">${chatTitleText}</span>
//                 <span class="chat-time">${chatTime}</span>
//             </div>
//             <button class="material-symbols-rounded delete-chat-item">delete</button>
//         `;

//         chatItem.addEventListener("click", (e) => {
//             if (!e.target.closest(".delete-chat-item")) {
//                 loadChat(chat.id);
//                 document.body.classList.remove("show-chat-history");
//             }
//         });

//         const deleteButton = chatItem.querySelector(".delete-chat-item");
//         deleteButton.addEventListener("click", (e) => {
//             e.stopPropagation();
//             deleteChat(chat.id);
//         });

//         historyList.appendChild(chatItem);
//     });
// };

// const deleteChat = (idToDelete) => {
//     chatHistory = chatHistory.filter(chat => chat.id !== idToDelete);
//     saveChatHistory();
//     renderChatHistory();
//     if (currentChatId === idToDelete) {
//         startNewChat();
//     }
// };

// // MODIFIED: Function to delete all history for the current user




// // const deleteAllHistory = () => {
// //     if (confirm("Are you sure you want to delete all your chat history? This action cannot be undone.")) {
// //         if (!userInfo || !userInfo.email) return;
// //         const userHistoryKey = `chatHistory_${userInfo.email}`;
        
// //         chatHistory = []; // Clear in-memory history
// //         localStorage.removeItem(userHistoryKey); // Remove this user's data from storage
        
// //         renderChatHistory();
// //         startNewChat();
// //     }
// // };


// // for demo 
// const deleteAllHistory = () => {
//     // Create or show the styled confirmation alert
//     let alertDiv = document.querySelector(".delete-confirmation-alert");
//     if (!alertDiv) {
//         alertDiv = document.createElement("div");
//         alertDiv.className = "delete-confirmation-alert";
//         alertDiv.innerHTML = `
//             <p>Are you sure you want to delete all your chat history?</p>
//             <div class="delete-confirmation-buttons">
//                 <button class="confirm-delete">Delete</button>
//                 <button class="cancel-delete">Cancel</button>
//             </div>
//         `;
//         deleteAllHistoryButton.parentNode.insertBefore(alertDiv, deleteAllHistoryButton);
        
//         // Add event listeners to the buttons
//         alertDiv.querySelector(".confirm-delete").addEventListener("click", () => {
//             if (!userInfo || !userInfo.email) return;
//             const userHistoryKey = `chatHistory_${userInfo.email}`;
            
//             chatHistory = []; // Clear in-memory history
//             localStorage.removeItem(userHistoryKey); // Remove this user's data from storage
            
//             renderChatHistory();
//             startNewChat();
//             alertDiv.classList.remove("show");
//         });
        
//         alertDiv.querySelector(".cancel-delete").addEventListener("click", () => {
//             alertDiv.classList.remove("show");
//         });
//     }
    
//     alertDiv.classList.add("show");
// };














// const loadChat = (chatId) => {
//     const chat = chatHistory.find(c => c.id === chatId);
//     if (!chat) {
//         startNewChat();
//         return;
//     }

//     currentChatId = chatId;
//     chatBody.innerHTML = "";
//     chat.messages.forEach(msg => {
//         let content = '';
//         let classes = [];

//         if (msg.sender === "bot") {
//             classes.push("bot-message");
//             let messageContent = msg.formattedContent || msg.content
//                 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                 .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
//                 .replace(/\n/g, '<br>');
//             content += `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg><div class="message-text">${messageContent}</div>`;
//         } else {
//             classes.push("user-message");
//             const timestamp = msg.timestamp ? formatMessageTime(msg.timestamp) : formatMessageTime(Date.now());
//             content += `<div class="message-text">${msg.content}</div>
//                          ${msg.type === "image" && msg.fileData ? `<img src="data:${msg.mimeType};base64,${msg.fileData}" class="attachment" />` : ""}
//                          <div class="user-message-time">${timestamp}</div>`;
//         }
//         const messageDiv = createMessageElement(content, ...classes);
//         chatBody.appendChild(messageDiv);
//     });
//     chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
// };

// const startNewChat = () => {
//     currentChatId = Date.now().toString();
//     chatHistory.push({ id: currentChatId, messages: [], lastActive: Date.now() });
//     saveChatHistory();
//     renderChatHistory();
//     clearChatMessages();
//     createWelcomeMessage();
// };

// const clearChatMessages = () => {
//     chatBody.innerHTML = "";
//     userData.message = null;
//     userData.file = { data: null, mime_type: null };
//     fileUploadWrapper.classList.remove("file-uploaded");
//     messageInput.value = "";
//     messageInput.style.height = `${initialInputHeight}px`;
//     document.querySelector(".chat-form").style.borderRadius = "32px";
// };

// const createMessageElement = (content, ...classes) => {
//     const div = document.createElement("div");
//     div.classList.add("message", ...classes);
//     div.innerHTML = content;
//     return div;
// };

// const createWelcomeMessage = () => {
//     const welcomeMessageContent = "Hey there 👋 <br> How can I help you today?";
//     const welcomeMessageHTML = `
//         <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
//             <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
//         </svg>
//         <div class="message-text">${welcomeMessageContent}</div>
//     `;
//     const welcomeDiv = createMessageElement(welcomeMessageHTML, "bot-message");
//     chatBody.appendChild(welcomeDiv);

//     const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//     if (currentChat && currentChat.messages.length === 0) {
//         currentChat.messages.push({ 
//             sender: "bot", 
//             type: "text", 
//             content: welcomeMessageContent,
//             formattedContent: welcomeMessageContent
//         });
//         currentChat.lastActive = Date.now();
//         saveChatHistory();
//         renderChatHistory();
//     }
// };

// const generateBotResponse = async (incomingMessageDiv) => {
//     const messageElement = incomingMessageDiv.querySelector(".message-text");

//     const requestBody = {
//         contents: [{
//             parts: [{ text: userData.message }]
//         }]
//     };

//     if (userData.file.data) {
//         requestBody.contents[0].parts.push({
//             inline_data: {
//                 mime_type: userData.file.mime_type,
//                 data: userData.file.data
//             }
//         });
//     }

//     const requestOptions = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestBody)
//     };

//     let botResponseText = "";
//     let formattedResponse = "";
//     try {
//         const response = await fetch(API_URL, requestOptions);
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error.message || `API Error: ${response.status}`);
//         }
//         const data = await response.json();
        
//         let rawText = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process that.";
        
//         formattedResponse = rawText
//             .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//             .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
//             .replace(/\n/g, '<br>')
//             .replace(/#+\s*(.*?)(?:\n|$)/g, '<strong>$1</strong>')
//             .replace(/- /g, '• ')
//             .replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre>$1</pre>')
//             .replace(/\`(.*?)\`/g, '<code>$1</code>');

//         botResponseText = rawText;
//         messageElement.innerHTML = formattedResponse;

//     } catch (error) {
//         console.error("API Error:", error);
//         botResponseText = `Oops! Something went wrong: ${error.message}. Please check your API key and try again.`;
//         formattedResponse = botResponseText;
//         messageElement.innerText = botResponseText;
//         messageElement.style.color = "#ff0000";

//     } finally {
//         const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//         if (currentChat) {
//             currentChat.messages.push({ 
//                 sender: "bot", 
//                 type: "text", 
//                 content: botResponseText,
//                 formattedContent: formattedResponse
//             });
//             currentChat.lastActive = Date.now();
//             saveChatHistory();
//             renderChatHistory();
//         }

//         userData.file = { data: null, mime_type: null };
//         incomingMessageDiv.classList.remove("thinking");
//         chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
//     }
// };

// const handleOutgoingMessage = (e) => {
//     e.preventDefault();
//     userData.message = messageInput.value.trim();
//     if (!userData.message && !userData.file.data) return;

//     const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//     if (currentChat) {
//         currentChat.messages.push({
//             sender: "user",
//             type: userData.file.data ? "image" : "text",
//             content: userData.message,
//             fileData: userData.file.data,
//             mimeType: userData.file.mime_type,
//             timestamp: Date.now() // Add timestamp to user message
//         });
//         currentChat.lastActive = Date.now();
//         saveChatHistory();
//         renderChatHistory();
//     }

//     const userMessageContent = userData.message;
//     const timestamp = formatMessageTime(Date.now());
//     const messageHTML = `<div class="message-text">${userMessageContent}</div>
//                          ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}
//                          <div class="user-message-time">${timestamp}</div>`;

//     const outgoingMessageDiv = createMessageElement(messageHTML, "user-message");
//     chatBody.appendChild(outgoingMessageDiv);
//     chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

//     messageInput.value = "";
//     fileUploadWrapper.classList.remove("file-uploaded");
//     messageInput.dispatchEvent(new Event("input"));

//     setTimeout(() => {
//         const thinkingMessageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>
//                                         <div class="message-text">
//                                             <div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
//                                         </div>`;
//         const incomingMessageDiv = createMessageElement(thinkingMessageContent, "bot-message", "thinking");
//         chatBody.appendChild(incomingMessageDiv);
//         chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
//         generateBotResponse(incomingMessageDiv);
//     }, 600);
// };

// // --- EVENT LISTENERS ---

// userInfoForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const name = userNameInput.value.trim();
//     const email = userEmailInput.value.trim();

//     if (!name || !email) {
//         if (!name) userNameInput.focus();
//         else userEmailInput.focus();
//         return;
//     }

//     userInfo = { name, email };
//     loadChatHistory();
    
//     document.body.classList.remove("show-user-form");
//     document.body.classList.add("show-chatbot");
//     userNameInput.value = "";
//     userEmailInput.value = "";
    
//     if (chatHistory.length > 0) {
//         renderChatHistory();
//         const sortedHistory = [...chatHistory].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
//         loadChat(sortedHistory[0].id);
//     } else {
//         startNewChat();
//     }

//     fetch('http://localhost:3007/save-user', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', },
//         body: JSON.stringify(userInfo),
//     })
//     .then(response => response.json())
//     .then(data => console.log('User data saved:', data))
//     .catch(error => console.error('Error saving user (silent):', error));
// });

// chatbotToggler.addEventListener("click", () => {
//     const isAnythingOpen = document.body.classList.contains("show-user-form") || document.body.classList.contains("show-chatbot");
    
//     if (isAnythingOpen) {
//         document.body.classList.remove("show-user-form");
//         document.body.classList.remove("show-chatbot");
//     } else {
//         if (userInfo) {
//             document.body.classList.add("show-chatbot");
//         } else {
//             document.body.classList.add("show-user-form");
//         }
//     }
// });

// closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// messageInput.addEventListener("keydown", (e) => {
//     if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
//         handleOutgoingMessage(e);
//     }
// });

// messageInput.addEventListener("input", () => {
//     messageInput.style.height = `${initialInputHeight}px`;
//     messageInput.style.height = `${messageInput.scrollHeight}px`;
//     document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
// });

// fileInput.addEventListener("change", () => {
//     const file = fileInput.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (e) => {
//         fileUploadWrapper.querySelector("img").src = e.target.result;
//         fileUploadWrapper.classList.add("file-uploaded");
//         const base64String = e.target.result.split(",")[1];
//         userData.file = { data: base64String, mime_type: file.type };
//         fileInput.value = "";
//     };
//     reader.readAsDataURL(file);
// });

// fileCancelButton.addEventListener("click", () => {
//     userData.file = { data: null, mime_type: null };
//     fileUploadWrapper.classList.remove("file-uploaded");
//     fileInput.value = "";
// });

// const picker = new EmojiMart.Picker({
//     theme: "light",
//     skinTonePosition: "none",
//     previewPosition: "none",
//     onEmojiSelect: (emoji) => {
//         const { selectionStart: start, selectionEnd: end } = messageInput;
//         messageInput.setRangeText(emoji.native, start, end, "end");
//         messageInput.focus();
//         messageInput.dispatchEvent(new Event("input"));
//     },
//     onClickOutside: (e) => {
//         if (e.target.id !== "emoji-picker") {
//             document.body.classList.remove("show-emoji-picker");
//         }
//     }
// });

// document.querySelector(".chat-form").appendChild(picker);
// sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
// document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
// document.querySelector("#emoji-picker").addEventListener("click", (e) => {
//     e.stopPropagation();
//     document.body.classList.toggle("show-emoji-picker");
// });

// const menuToggler = document.querySelector("#menu-toggler");
// const dropdownMenu = document.querySelector(".dropdown-menu");

// menuToggler.addEventListener("click", (e) => {
//     e.stopPropagation();
//     dropdownMenu.classList.toggle("show");
// });

// document.addEventListener("click", (e) => {
//     if (!e.target.closest(".header-actions")) {
//         dropdownMenu.classList.remove("show");
//     }
//     if (!e.target.closest("em-emoji-picker") && e.target.id !== "emoji-picker") {
//         document.body.classList.remove("show-emoji-picker");
//     }
// });

// chatHistoryButton.addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//     document.body.classList.toggle("show-chat-history");
//     renderChatHistory();
// });

// closeHistoryButton.addEventListener("click", () => {
//     document.body.classList.remove("show-chat-history");
// });

// document.querySelector("#clear-chat").addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//     const chatToClearId = currentChatId;
//     clearChatMessages();
//     chatHistory = chatHistory.filter(chat => chat.id !== chatToClearId);
//     saveChatHistory();
//     renderChatHistory();
//     startNewChat();
// });

// document.querySelector("#new-chat").addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//     startNewChat();
// });

// deleteAllHistoryButton.addEventListener("click", deleteAllHistory);

// // --- Voice Assistant Functionality ---
// const setupVoiceRecognition = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//         console.warn("Speech Recognition not supported.");
//         voiceAssistButton.style.display = "none";
//         return;
//     }

//     recognition = new webkitSpeechRecognition();
//     recognition.continuous = false;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';

//     recognition.onstart = () => {
//         isListening = true;
//         voiceAssistButton.classList.add("listening");
//     };

//     recognition.onresult = (event) => {
//         let interimTranscript = '';
//         let finalTranscript = '';
//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//             const transcript = event.results[i][0].transcript;
//             if (event.results[i].isFinal) {
//                 finalTranscript += transcript;
//             } else {
//                 interimTranscript += transcript;
//             }
//         }
//         messageInput.value = finalTranscript || interimTranscript;
//         messageInput.dispatchEvent(new Event("input"));
//     };

//     recognition.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         isListening = false;
//         voiceAssistButton.classList.remove("listening");
//     };

//     recognition.onend = () => {
//         isListening = false;
//         voiceAssistButton.classList.remove("listening");
//         if (messageInput.value.trim() !== "") {
//             handleOutgoingMessage(new Event("submit"));
//         }
//     };
// };

// voiceAssistButton.addEventListener("click", () => {
//     if (isListening) {
//         recognition.stop();
//     } else {
//         messageInput.value = "";
//         messageInput.focus();
//         try {
//             recognition.start();
//         } catch (error) {
//             console.error("Error starting speech recognition:", error);
//             alert("Could not start voice assistant. Check permissions.");
//         }
//     }
// });

// // --- Initialize ---
// injectHistoryStyles(); // Call the function to add our new styles
// setupVoiceRecognition();



















































// ------------------------- for demo pdf attach ---------------------------


const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");

const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");

const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// New User Info Form elements
const userInfoPopup = document.querySelector(".user-info-popup");
const userInfoForm = document.querySelector("#user-info-form");
const userNameInput = document.querySelector("#user-name");
const userEmailInput = document.querySelector("#user-email");

// Chat History elements
const chatHistoryButton = document.querySelector("#chat-history");
const chatHistorySidebar = document.querySelector(".chat-history-sidebar");
const closeHistoryButton = document.querySelector("#close-history");
const historyList = document.querySelector(".history-list");
const deleteAllHistoryButton = document.querySelector("#delete-all-history");

// Voice Assist elements
const voiceAssistButton = document.querySelector("#voice-assist");

// API setup
const API_KEY = "AIzaSyCND8_k9nMfIrl8OhpVAYXoMGwh7dlR3Xs"; // Replace with your actual Gemini API Key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

let currentChatId = null;
let chatHistory = [];
let userInfo = null; 

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null,
        filename: null
    }
};

const initialInputHeight = messageInput.scrollHeight;
let recognition;
let isListening = false;

// --- STYLE INJECTION FOR CHAT HISTORY ---
const injectHistoryStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        .chat-history-item-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
        .chat-time {
            font-size: 0.75rem;
            color: #6c757d;
            flex-shrink: 0;
            margin-left: 10px;
        }
        .user-message-time {
            font-size: 0.7rem;
            color: #888;
            text-align: right;
            margin-top: 5px;
            padding-right: 10px;
        }
        .pdf-preview {
            display: flex;
            align-items: center;
            background: #f5f5f5;
            padding: 8px 12px;
            border-radius: 8px;
            margin-top: 8px;
            max-width: 80%;
        }
        .pdf-icon {
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }
        .pdf-filename {
            font-size: 0.9rem;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
        }
    `;
    document.head.appendChild(style);
};

const saveChatHistory = () => {
    if (!userInfo || !userInfo.email) return;
    const userHistoryKey = `chatHistory_${userInfo.email}`;
    localStorage.setItem(userHistoryKey, JSON.stringify(chatHistory));
};

const loadChatHistory = () => {
    if (!userInfo || !userInfo.email) {
        chatHistory = [];
        return;
    }
    const userHistoryKey = `chatHistory_${userInfo.email}`;
    const savedHistory = localStorage.getItem(userHistoryKey);
    let allUserHistory = savedHistory ? JSON.parse(savedHistory) : [];

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoTimestamp = oneWeekAgo.getTime();

    chatHistory = allUserHistory.filter(chat => chat.lastActive && chat.lastActive >= oneWeekAgoTimestamp);
    
    if (chatHistory.length < allUserHistory.length) {
        saveChatHistory();
    }
};

const formatChatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    if (isNaN(date.getTime())) return "";

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const targetDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (targetDateOnly.getTime() === today.getTime()) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (targetDateOnly.getTime() === yesterday.getTime()) {
        return "Yesterday";
    } else {
        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    }
};

const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const renderChatHistory = () => {
    historyList.innerHTML = "";
    const sortedHistory = [...chatHistory].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));

    sortedHistory.forEach(chat => {
        const chatItem = document.createElement("li");
        chatItem.setAttribute("data-chat-id", chat.id);

        const firstUserMessage = chat.messages.find(msg => msg.sender === "user" && msg.type === "text");
        let chatTitleText = "New Chat";
        if (firstUserMessage) {
            chatTitleText = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "");
        } else if (chat.messages.length > 0 && chat.messages[0].content) {
            chatTitleText = chat.messages[0].content.substring(0, 30) + (chat.messages[0].content.length > 30 ? "..." : "");
        }

        const chatTime = formatChatTimestamp(chat.lastActive);

        chatItem.innerHTML = `
            <div class="chat-history-item-content">
                <span class="chat-title">${chatTitleText}</span>
                <span class="chat-time">${chatTime}</span>
            </div>
            <button class="material-symbols-rounded delete-chat-item">delete</button>
        `;

        chatItem.addEventListener("click", (e) => {
            if (!e.target.closest(".delete-chat-item")) {
                loadChat(chat.id);
                document.body.classList.remove("show-chat-history");
            }
        });

        const deleteButton = chatItem.querySelector(".delete-chat-item");
        deleteButton.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        });

        historyList.appendChild(chatItem);
    });
};

const deleteChat = (idToDelete) => {
    chatHistory = chatHistory.filter(chat => chat.id !== idToDelete);
    saveChatHistory();
    renderChatHistory();
    if (currentChatId === idToDelete) {
        startNewChat();
    }
};

const deleteAllHistory = () => {
    let alertDiv = document.querySelector(".delete-confirmation-alert");
    if (!alertDiv) {
        alertDiv = document.createElement("div");
        alertDiv.className = "delete-confirmation-alert";
        alertDiv.innerHTML = `
            <p>Are you sure you want to delete all your chat history?</p>
            <div class="delete-confirmation-buttons">
                <button class="confirm-delete">Delete</button>
                <button class="cancel-delete">Cancel</button>
            </div>
        `;
        deleteAllHistoryButton.parentNode.insertBefore(alertDiv, deleteAllHistoryButton);
        
        alertDiv.querySelector(".confirm-delete").addEventListener("click", () => {
            if (!userInfo || !userInfo.email) return;
            const userHistoryKey = `chatHistory_${userInfo.email}`;
            
            chatHistory = [];
            localStorage.removeItem(userHistoryKey);
            
            renderChatHistory();
            startNewChat();
            alertDiv.classList.remove("show");
        });
        
        alertDiv.querySelector(".cancel-delete").addEventListener("click", () => {
            alertDiv.classList.remove("show");
        });
    }
    
    alertDiv.classList.add("show");
};

const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) {
        startNewChat();
        return;
    }

    currentChatId = chatId;
    chatBody.innerHTML = "";
    chat.messages.forEach(msg => {
        let content = '';
        let classes = [];

        if (msg.sender === "bot") {
            classes.push("bot-message");
            let messageContent = msg.formattedContent || msg.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            content += `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg><div class="message-text">${messageContent}</div>`;
        } else {
            classes.push("user-message");
            const timestamp = msg.timestamp ? formatMessageTime(msg.timestamp) : formatMessageTime(Date.now());
            
            let attachmentHTML = "";
            if (msg.type === "image" && msg.fileData) {
                attachmentHTML = `<img src="data:${msg.mimeType};base64,${msg.fileData}" class="attachment" />`;
            } else if (msg.type === "pdf" && msg.fileData) {
                attachmentHTML = `
                    <div class="pdf-preview">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="pdf-icon">
                            <path fill="#ff5555" d="M181.9 256.1c-5-16-4.9-46.9-2-168.9C182.1 45.8 186.9 32 192 32c10.3 0 19.3 12.9 19.3 32.4 0 16.4-.3 73.6-.3 94.3 0 15 10 30.1 30.1 30.1 12.4 0 27.5-9.2 27.5-30.1 0-21.1-.3-85.7-.3-120.3 0-22.4 11.5-32.4 31.5-32.4 10.3 0 21.1 9.2 21.1 32.4 0 35.7-.3 94.3-.3 94.3 0 15-10.2 30.1-30.1 30.1-12.4 0-27.5-9.2-27.5-30.1 0-21.1.3-85.7.3-120.3 0-22.4-10.3-32.4-30.1-32.4-10.9 0-21.1 9.2-21.1 32.4 0 35.7.3 94.3.3 94.3 0 15-10.2 30.1-30.1 30.1s-30.1-15-30.1-30.1c0-21.1.3-85.7.3-120.3zM384 128v256c0 53.1-43 96-96 96H96C42.9 480 0 437 0 384V128c0-53.1 43-96 96-96h192c53.1 0 96 42.9 96 96zm-64 160c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64h96c35.3 0 64-28.7 64-64v-64z"/>
                        </svg>
                        <span class="pdf-filename">${msg.filename || 'document.pdf'}</span>
                    </div>
                `;
            }
            
            content += `<div class="message-text">${msg.content}</div>
                         ${attachmentHTML}
                         <div class="user-message-time">${timestamp}</div>`;
        }
        const messageDiv = createMessageElement(content, ...classes);
        chatBody.appendChild(messageDiv);
    });
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
};

const startNewChat = () => {
    currentChatId = Date.now().toString();
    chatHistory.push({ id: currentChatId, messages: [], lastActive: Date.now() });
    saveChatHistory();
    renderChatHistory();
    clearChatMessages();
    createWelcomeMessage();
};

const clearChatMessages = () => {
    chatBody.innerHTML = "";
    userData.message = null;
    userData.file = { data: null, mime_type: null, filename: null };
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.value = "";
    messageInput.style.height = `${initialInputHeight}px`;
    document.querySelector(".chat-form").style.borderRadius = "32px";
};

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

const createWelcomeMessage = () => {
    const welcomeMessageContent = "Hey there 👋 <br> How can I help you today?";
    const welcomeMessageHTML = `
        <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text">${welcomeMessageContent}</div>
    `;
    const welcomeDiv = createMessageElement(welcomeMessageHTML, "bot-message");
    chatBody.appendChild(welcomeDiv);

    const currentChat = chatHistory.find(chat => chat.id === currentChatId);
    if (currentChat && currentChat.messages.length === 0) {
        currentChat.messages.push({ 
            sender: "bot", 
            type: "text", 
            content: welcomeMessageContent,
            formattedContent: welcomeMessageContent
        });
        currentChat.lastActive = Date.now();
        saveChatHistory();
        renderChatHistory();
    }
};

const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    const requestBody = {
        contents: [{
            parts: [{ text: userData.message }]
        }]
    };

    if (userData.file.data) {
        requestBody.contents[0].parts.push({
            inline_data: {
                mime_type: userData.file.mime_type,
                data: userData.file.data
            }
        });
    }

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    };

    let botResponseText = "";
    let formattedResponse = "";
    try {
        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || `API Error: ${response.status}`);
        }
        const data = await response.json();
        
        let rawText = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process that.";
        
        formattedResponse = rawText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/#+\s*(.*?)(?:\n|$)/g, '<strong>$1</strong>')
            .replace(/- /g, '• ')
            .replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre>$1</pre>')
            .replace(/\`(.*?)\`/g, '<code>$1</code>');

        botResponseText = rawText;
        messageElement.innerHTML = formattedResponse;

    } catch (error) {
        console.error("API Error:", error);
        botResponseText = `Oops! Something went wrong: ${error.message}. Please check your API key and try again.`;
        formattedResponse = botResponseText;
        messageElement.innerText = botResponseText;
        messageElement.style.color = "#ff0000";

    } finally {
        const currentChat = chatHistory.find(chat => chat.id === currentChatId);
        if (currentChat) {
            currentChat.messages.push({ 
                sender: "bot", 
                type: "text", 
                content: botResponseText,
                formattedContent: formattedResponse
            });
            currentChat.lastActive = Date.now();
            saveChatHistory();
            renderChatHistory();
        }

        userData.file = { data: null, mime_type: null, filename: null };
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }
};

const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    if (!userData.message && !userData.file.data) return;

    const currentChat = chatHistory.find(chat => chat.id === currentChatId);
    if (currentChat) {
        currentChat.messages.push({
            sender: "user",
            type: userData.file.data ? 
                (userData.file.mime_type.startsWith("image/") ? "image" : "pdf") : "text",
            content: userData.message,
            fileData: userData.file.data,
            mimeType: userData.file.mime_type,
            filename: userData.file.filename,
            timestamp: Date.now()
        });
        currentChat.lastActive = Date.now();
        saveChatHistory();
        renderChatHistory();
    }

    const userMessageContent = userData.message;
    const timestamp = formatMessageTime(Date.now());
    
    let attachmentHTML = "";
    if (userData.file.data) {
        if (userData.file.mime_type.startsWith("image/")) {
            attachmentHTML = `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`;
        } else if (userData.file.mime_type === "application/pdf") {
            attachmentHTML = `
                <div class="pdf-preview">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="pdf-icon">
                        <path fill="#ff5555" d="M181.9 256.1c-5-16-4.9-46.9-2-168.9C182.1 45.8 186.9 32 192 32c10.3 0 19.3 12.9 19.3 32.4 0 16.4-.3 73.6-.3 94.3 0 15 10 30.1 30.1 30.1 12.4 0 27.5-9.2 27.5-30.1 0-21.1-.3-85.7-.3-120.3 0-22.4 11.5-32.4 31.5-32.4 10.3 0 21.1 9.2 21.1 32.4 0 35.7-.3 94.3-.3 94.3 0 15-10.2 30.1-30.1 30.1-12.4 0-27.5-9.2-27.5-30.1 0-21.1.3-85.7.3-120.3 0-22.4-10.3-32.4-30.1-32.4-10.9 0-21.1 9.2-21.1 32.4 0 35.7.3 94.3.3 94.3 0 15-10.2 30.1-30.1 30.1s-30.1-15-30.1-30.1c0-21.1.3-85.7.3-120.3zM384 128v256c0 53.1-43 96-96 96H96C42.9 480 0 437 0 384V128c0-53.1 43-96 96-96h192c53.1 0 96 42.9 96 96zm-64 160c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64h96c35.3 0 64-28.7 64-64v-64z"/>
                    </svg>
                    <span class="pdf-filename">${userData.file.filename || 'document.pdf'}</span>
                </div>
            `;
        }
    }

    const messageHTML = `<div class="message-text">${userMessageContent}</div>
                         ${attachmentHTML}
                         <div class="user-message-time">${timestamp}</div>`;

    const outgoingMessageDiv = createMessageElement(messageHTML, "user-message");
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));

    setTimeout(() => {
        const thinkingMessageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>
                                        <div class="message-text">
                                            <div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
                                        </div>`;
        const incomingMessageDiv = createMessageElement(thinkingMessageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        generateBotResponse(incomingMessageDiv);
    }, 600);
};

// --- FILE INPUT HANDLER ---
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        userData.file = { 
            data: base64String, 
            mime_type: file.type,
            filename: file.name
        };
        
        if (file.type.startsWith("image/")) {
            // For images - show preview
            fileUploadWrapper.querySelector("img").src = e.target.result;
            fileUploadWrapper.classList.add("file-uploaded");
        } else if (file.type === "application/pdf") {
            // For PDFs - show PDF icon preview
            fileUploadWrapper.querySelector("img").src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjZmY1NTE1IiBkPSJNMTgxLjkgMjU2LjFjLTUtMTYtNC45LTQ2LjktMi0xNjguOUMxODIuMSA0NS44IDE4Ni45IDMyIDE5MiAzMmMxMC4zIDAgMTkuMyAxMi45IDE5LjMgMzIuNCAwIDE2LjQtLjMgNzMuNi0uMyA5NC4zIDAgMTUgMTAgMzAuMSAzMC4xIDMwLjEgMTIuNCAwIDI3LjUtOS4yIDI3LjUtMzAuMSAwLTIxLjEtLjMtODUuNy0uMy0xMjAuMyAwLTIyLjQgMTEuNS0zMi40IDMxLjUtMzIuNCAxMC4zIDAgMjEuMSA5LjIgMjEuMSAzMi40IDAgMzUuNy0uMyA5NC4zLS4zIDk0LjMgMCAxNS0xMC4yIDMwLjEtMzAuMSAzMC4xLTEyLjQgMC0yNy41LTkuMi0yNy41LTMwLjEgMC0yMS4xLjMtODUuNy4zLTEyMC4zIDAtMjIuNC0xMC4zLTMyLjQtMzAuMS0zMi40LTEwLjkgMC0yMS4xIDkuMi0yMS4xIDMyLjQgMCAzNS43LjMgOTQuMy4zIDk0LjMgMCAxNS0xMC4yIDMwLjEtMzAuMSAzMC4xcy0zMC4xLTE1LTMwLjEtMzAuMWMwLTIxLjEuMy04NS43LjMtMTIwLjN6TTM4NCAxMjh2MjU2YzAgNTMuMS00MyA5Ni05NiA5Nkg5NkM0Mi45IDQ4MCAwIDQzNyAwIDM4NFYxMjhjMC01My4xIDQzLTk2IDk2LTk2aDE5MmM1My4xIDAgOTYgNDIuOSA5NiA5NnptLTY0IDE2MGMwLTM1LjMtMjguNy02NC02NC02NEgxNjBjLTM1LjMgMC02NCAyOC43LTY0IDY0djY0YzAgMzUuMyAyOC43IDY0IDY0IDY0aDk2YzM1LjMgMCA2NC0yOC43IDY0LTY0di02NHoiLz48L3N2Zz4=";
            fileUploadWrapper.classList.add("file-uploaded");
        }
        
        fileInput.value = "";
    };
    
    if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
        // Convert PDF to base64 without preview (we'll use icon)
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
            const base64String = btoa(
                new Uint8Array(e.target.result)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            userData.file = { 
                data: base64String, 
                mime_type: file.type,
                filename: file.name
            };
            fileUploadWrapper.querySelector("img").src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjZmY1NTE1IiBkPSJNMTgxLjkgMjU2LjFjLTUtMTYtNC45LTQ2LjktMi0xNjguOUMxODIuMSA0NS44IDE4Ni45IDMyIDE5MiAzMmMxMC4zIDAgMTkuMyAxMi45IDE5LjMgMzIuNCAwIDE2LjQtLjMgNzMuNi0uMyA5NC4zIDAgMTUgMTAgMzAuMSAzMC4xIDMwLjEgMTIuNCAwIDI3LjUtOS4yIDI3LjUtMzAuMSAwLTIxLjEtLjMtODUuNy0uMy0xMjAuMyAwLTIyLjQgMTEuNS0zMi40IDMxLjUtMzIuNCAxMC4zIDAgMjEuMSA5LjIgMjEuMSAzMi40IDAgMzUuNy0uMyA5NC4zLS4zIDk0LjMgMCAxNS0xMC4yIDMwLjEtMzAuMSAzMC4xLTEyLjQgMC0yNy41LTkuMi0yNy41LTMwLjEgMC0yMS4xLjMtODUuNy4zLTEyMC4zIDAtMjIuNC0xMC4zLTMyLjQtMzAuMS0zMi40LTEwLjkgMC0yMS4xIDkuMi0yMS4xIDMyLjQgMCAzNS43LjMgOTQuMy4zIDk0LjMgMCAxNS0xMC4yIDMwLjEtMzAuMSAzMC4xcy0zMC4xLTE1LTMwLjEtMzAuMWMwLTIxLjEuMy04NS43LjMtMTIwLjN6TTM4NCAxMjh2MjU2YzAgNTMuMS00MyA5Ni05NiA5Nkg5NkM0Mi45IDQ4MCAwIDQzNyAwIDM4NFYxMjhjMC01My4xIDQzLTk2IDk2LTk2aDE5MmM1My4xIDAgOTYgNDIuOSA5NiA5NnptLTY0IDE2MGMwLTM1LjMtMjguNy02NC02NC02NEgxNjBjLTM1LjMgMC02NCAyOC43LTY0IDY0djY0YzAgMzUuMyAyOC43IDY0IDY0IDY0aDk2YzM1LjMgMCA2NC0yOC43IDY0LTY0di02NHoiLz48L3N2Zz4=";
            fileUploadWrapper.classList.add("file-uploaded");
        };
        fileReader.readAsArrayBuffer(file);
    }
});

// --- EVENT LISTENERS ---

userInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();

    if (!name || !email) {
        if (!name) userNameInput.focus();
        else userEmailInput.focus();
        return;
    }

    userInfo = { name, email };
    loadChatHistory();
    
    document.body.classList.remove("show-user-form");
    document.body.classList.add("show-chatbot");
    userNameInput.value = "";
    userEmailInput.value = "";
    
    if (chatHistory.length > 0) {
        renderChatHistory();
        const sortedHistory = [...chatHistory].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
        loadChat(sortedHistory[0].id);
    } else {
        startNewChat();
    }

    fetch('http://localhost:3007/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(userInfo),
    })
    .then(response => response.json())
    .then(data => console.log('User data saved:', data))
    .catch(error => console.error('Error saving user (silent):', error));
});

chatbotToggler.addEventListener("click", () => {
    const isAnythingOpen = document.body.classList.contains("show-user-form") || document.body.classList.contains("show-chatbot");
    
    if (isAnythingOpen) {
        document.body.classList.remove("show-user-form");
        document.body.classList.remove("show-chatbot");
    } else {
        if (userInfo) {
            document.body.classList.add("show-chatbot");
        } else {
            document.body.classList.add("show-user-form");
        }
    }
});

closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
        handleOutgoingMessage(e);
    }
});

messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

fileCancelButton.addEventListener("click", () => {
    userData.file = { data: null, mime_type: null, filename: null };
    fileUploadWrapper.classList.remove("file-uploaded");
    fileInput.value = "";
});

const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
        messageInput.dispatchEvent(new Event("input"));
    },
    onClickOutside: (e) => {
        if (e.target.id !== "emoji-picker") {
            document.body.classList.remove("show-emoji-picker");
        }
    }
});

document.querySelector(".chat-form").appendChild(picker);
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
document.querySelector("#emoji-picker").addEventListener("click", (e) => {
    e.stopPropagation();
    document.body.classList.toggle("show-emoji-picker");
});

const menuToggler = document.querySelector("#menu-toggler");
const dropdownMenu = document.querySelector(".dropdown-menu");

menuToggler.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".header-actions")) {
        dropdownMenu.classList.remove("show");
    }
    if (!e.target.closest("em-emoji-picker") && e.target.id !== "emoji-picker") {
        document.body.classList.remove("show-emoji-picker");
    }
});

chatHistoryButton.addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
    document.body.classList.toggle("show-chat-history");
    renderChatHistory();
});

closeHistoryButton.addEventListener("click", () => {
    document.body.classList.remove("show-chat-history");
});

document.querySelector("#clear-chat").addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
    const chatToClearId = currentChatId;
    clearChatMessages();
    chatHistory = chatHistory.filter(chat => chat.id !== chatToClearId);
    saveChatHistory();
    renderChatHistory();
    startNewChat();
});

document.querySelector("#new-chat").addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
    startNewChat();
});

deleteAllHistoryButton.addEventListener("click", deleteAllHistory);

// --- Voice Assistant Functionality ---
const setupVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
        console.warn("Speech Recognition not supported.");
        voiceAssistButton.style.display = "none";
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isListening = true;
        voiceAssistButton.classList.add("listening");
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        messageInput.value = finalTranscript || interimTranscript;
        messageInput.dispatchEvent(new Event("input"));
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        voiceAssistButton.classList.remove("listening");
    };

    recognition.onend = () => {
        isListening = false;
        voiceAssistButton.classList.remove("listening");
        if (messageInput.value.trim() !== "") {
            handleOutgoingMessage(new Event("submit"));
        }
    };
};

voiceAssistButton.addEventListener("click", () => {
    if (isListening) {
        recognition.stop();
    } else {
        messageInput.value = "";
        messageInput.focus();
        try {
            recognition.start();
        } catch (error) {
            console.error("Error starting speech recognition:", error);
            alert("Could not start voice assistant. Check permissions.");
        }
    }
});

// --- Initialize ---
injectHistoryStyles();
setupVoiceRecognition();





















































































































































































