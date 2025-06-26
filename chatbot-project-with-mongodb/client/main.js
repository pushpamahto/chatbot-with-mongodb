
// ------------------------------------  with look like real pdf ------------------------------------



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
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
// const FILE_API_BASE_URL = `https://generativelanguage.googleapis.com`;

// let currentChatId = null;
// let chatHistory = [];
// let userInfo = null;

// const userData = {
//     message: null,
//     file: {
//         data: null,      // For image base64
//         mime_type: null,
//         uri: null        // --- NEW: For PDF file URI
//     }
// };

// const initialInputHeight = messageInput.scrollHeight;
// let recognition;
// let isListening = false;
// let activePdfUploads = {}; // --- NEW: Track active uploads

// const injectHistoryStyles = () => {
//     const style = document.createElement('style');
//     style.innerHTML = `
//         .chat-history-item-content {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             width: 100%;
//         }
//         .chat-time {
//             font-size: 0.75rem;
//             color: #6c757d;
//             flex-shrink: 0;
//             margin-left: 10px;
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

// const saveChatHistory = () => {
//     if (!userInfo || !userInfo.email) return;
//     const userHistoryKey = `chatHistory_${userInfo.email}`;
//     localStorage.setItem(userHistoryKey, JSON.stringify(chatHistory));
// };

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
//         return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
//     } else if (targetDateOnly.getTime() === yesterday.getTime()) {
//         return "Yesterday";
//     } else {
//         return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
//     }
// };

// const formatMessageTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp);
//     if (isNaN(date.getTime())) return "";
//     return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
// };

// const renderChatHistory = () => {
//     historyList.innerHTML = "";
//     const sortedHistory = [...chatHistory].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));

//     sortedHistory.forEach(chat => {
//         const chatItem = document.createElement("li");
//         chatItem.setAttribute("data-chat-id", chat.id);

//         const firstUserMessage = chat.messages.find(msg => msg.sender === "user" && (msg.type === "text" || msg.type === "pdf"));
//         let chatTitleText = "New Chat";
//         if (firstUserMessage) {
//             if (firstUserMessage.type === 'pdf') {
//                 chatTitleText = firstUserMessage.fileName || "PDF Document";
//             } else {
//                 chatTitleText = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "");
//             }
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

// const deleteAllHistory = () => {
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

//         alertDiv.querySelector(".confirm-delete").addEventListener("click", () => {
//             if (!userInfo || !userInfo.email) return;
//             const userHistoryKey = `chatHistory_${userInfo.email}`;
//             chatHistory = [];
//             localStorage.removeItem(userHistoryKey);
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

// // --- NEW PDF HANDLING ---
// const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// }

// // --- NEW PDF HANDLING ---
// const createPdfMessageElement = (messageId, fileName, fileSize) => {
//     const formattedSize = formatFileSize(fileSize);
//     const messageHTML = `
//         <div class="pdf-upload-container" id="pdf-${messageId}">
//             <span class="material-symbols-rounded pdf-icon">picture_as_pdf</span>
//             <div class="file-info">
//                 <div class="file-name">${fileName}</div>
//                 <div class="progress-details">
//                     <span class="file-size">${formattedSize}</span>
//                     <span class="upload-status">Uploading...</span>
//                 </div>
//                 <div class="progress-bar">
//                     <div class="progress"></div>
//                 </div>
//             </div>
//             <div class="action-buttons">
//                 <button class="remove-btn"><span class="material-symbols-rounded">close</span></button>
//             </div>
//         </div>
//         <div class="user-message-time">${formatMessageTime(Date.now())}</div>
//     `;
//     const pdfMessageDiv = createMessageElement(messageHTML, "user-message");

//     pdfMessageDiv.querySelector('.remove-btn').addEventListener('click', () => {
//         if(activePdfUploads[messageId]) {
//             activePdfUploads[messageId].abort(); // Stop the upload
//             delete activePdfUploads[messageId];
//         }
//         pdfMessageDiv.remove();
//         // Also remove from history
//         const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//         if (currentChat) {
//             currentChat.messages = currentChat.messages.filter(msg => msg.id !== messageId);
//             saveChatHistory();
//         }
//     });

//     return pdfMessageDiv;
// }

// // --- NEW PDF HANDLING: Handles the multi-step file upload
// const uploadPdfAndAsk = async (file) => {
//     const messageId = `pdf_${Date.now()}`;
//     const pdfMessageElement = createPdfMessageElement(messageId, file.name, file.size);
//     chatBody.appendChild(pdfMessageElement);
//     chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

//     // Add to history immediately
//     const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//     const pdfMessageData = {
//         id: messageId,
//         sender: "user",
//         type: "pdf",
//         fileName: file.name,
//         fileSize: file.size,
//         fileUri: null,
//         timestamp: Date.now()
//     };
//     if (currentChat) {
//         currentChat.messages.push(pdfMessageData);
//         saveChatHistory();
//     }

//     const ui = {
//         container: document.getElementById(`pdf-${messageId}`),
//         progressBar: document.querySelector(`#pdf-${messageId} .progress`),
//         statusText: document.querySelector(`#pdf-${messageId} .upload-status`),
//     };

//     try {
//         // Step 1: Start the resumable upload and get the upload URL
//         const startResponse = await fetch(`${FILE_API_BASE_URL}/upload/v1beta/files?key=${API_KEY}`, {
//             method: 'POST',
//             headers: {
//                 'X-Goog-Upload-Protocol': 'resumable',
//                 'X-Goog-Upload-Command': 'start',
//                 'X-Goog-Upload-Header-Content-Length': file.size,
//                 'X-Goog-Upload-Header-Content-Type': file.type,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ 'file': { 'display_name': file.name } })
//         });

//         if (!startResponse.ok) throw new Error(`API Error: ${startResponse.statusText}`);

//         const uploadUrl = startResponse.headers.get('X-Goog-Upload-Url');
//         if (!uploadUrl) throw new Error("Could not get upload URL.");

//         // Step 2: Upload the file bytes using XMLHttpRequest for progress tracking
//         const xhr = new XMLHttpRequest();
//         activePdfUploads[messageId] = xhr;

//         xhr.open('POST', uploadUrl, true);
//         xhr.setRequestHeader('X-Goog-Upload-Command', 'upload, finalize');
//         xhr.setRequestHeader('Content-Type', file.type);

//         xhr.upload.onprogress = (event) => {
//             if (event.lengthComputable) {
//                 const percentComplete = (event.loaded / event.total) * 100;
//                 ui.progressBar.style.width = percentComplete + '%';
//                 ui.statusText.textContent = `${Math.round(percentComplete)}% uploaded`;
//             }
//         };

//         xhr.onload = () => {
//             delete activePdfUploads[messageId];
//             if (xhr.status === 200) {
//                 const response = JSON.parse(xhr.responseText);
//                 const fileUri = response.file.uri;

//                 // Update UI to "Completed"
//                 ui.container.classList.add('completed');
//                 ui.progressBar.style.width = '100%';
//                 ui.progressBar.classList.add('completed');
//                 ui.statusText.innerHTML = `<span class="material-symbols-rounded completed-check">check_circle</span> Completed`;

//                 // Update the message in chat history with the final URI
//                 pdfMessageData.fileUri = fileUri;
//                 saveChatHistory();

//                 // Automatically trigger bot response
//                 userData.message = `The user uploaded a file named "${file.name}". Please provide a brief summary of this document.`;
//                 userData.file.uri = fileUri;
//                 userData.file.mime_type = file.type;
//                 handleBotResponse();

//             } else {
//                 throw new Error(`Upload failed: ${xhr.statusText}`);
//             }
//         };

//         xhr.onerror = () => {
//              delete activePdfUploads[messageId];
//             console.error("XHR Error:", xhr.statusText);
//             ui.statusText.textContent = "Upload failed.";
//             ui.statusText.style.color = "#d93025";
//         };
        
//         xhr.onabort = () => {
//             delete activePdfUploads[messageId];
//             console.log("Upload aborted.");
//         };


//         xhr.send(file);

//     } catch (error) {
//         console.error("PDF Upload Error:", error);
//         ui.statusText.textContent = "Error!";
//         ui.statusText.style.color = "#d93025";
//     }
// }

// // --- NEW: Renders a PDF message from chat history
// const renderPdfMessage = (msg) => {
//     const formattedSize = formatFileSize(msg.fileSize);
//     const messageHTML = `
//         <div class="pdf-upload-container completed" id="pdf-${msg.id}">
//             <a href="${msg.fileUri}" target="_blank" class="pdf-icon-link" style="text-decoration: none;">
//                <span class="material-symbols-rounded pdf-icon">picture_as_pdf</span>
//             </a>
//             <div class="file-info">
//                 <a href="${msg.fileUri}" target="_blank" style="text-decoration: none;">
//                    <div class="file-name">${msg.fileName}</div>
//                 </a>
//                 <div class="progress-details">
//                     <span class="file-size">${formattedSize}</span>
//                     <span class="upload-status"><span class="material-symbols-rounded completed-check">check_circle</span> Completed</span>
//                 </div>
//             </div>
//         </div>
//         <div class="user-message-time">${formatMessageTime(msg.timestamp)}</div>
//     `;
//      return createMessageElement(messageHTML, "user-message");
// }


// const loadChat = (chatId) => {
//     const chat = chatHistory.find(c => c.id === chatId);
//     if (!chat) {
//         startNewChat();
//         return;
//     }

//     currentChatId = chatId;
//     chatBody.innerHTML = "";
//     chat.messages.forEach(msg => {
//         let messageDiv;
//         if (msg.sender === "bot") {
//             let messageContent = msg.formattedContent || msg.content
//                 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                 .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
//                 .replace(/\n/g, '<br>');
//             const content = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg><div class="message-text">${messageContent}</div>`;
//             messageDiv = createMessageElement(content, "bot-message");
//         } else { // User message
//             if(msg.type === 'pdf') {
//                 messageDiv = renderPdfMessage(msg);
//             } else {
//                 const content = `<div class="message-text">${msg.content}</div>
//                                  ${msg.type === "image" && msg.fileData ? `<img src="data:${msg.mimeType};base64,${msg.fileData}" class="attachment" />` : ""}
//                                  <div class="user-message-time">${formatMessageTime(msg.timestamp)}</div>`;
//                 messageDiv = createMessageElement(content, "user-message");
//             }
//         }
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
//     userData.file = { data: null, mime_type: null, uri: null };
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
//         <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>
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
//     const parts = [];

//     // Add text part if exists
//     if (userData.message) {
//         parts.push({ text: userData.message });
//     }

//     // Add file part (either image data or PDF uri)
//     if (userData.file.uri) { // --- NEW: Handle PDF URI
//         parts.push({
//             file_data: {
//                 mime_type: userData.file.mime_type,
//                 file_uri: userData.file.uri
//             }
//         });
//     } else if (userData.file.data) { // Handle image data
//         parts.push({
//             inline_data: {
//                 mime_type: userData.file.mime_type,
//                 data: userData.file.data
//             }
//         });
//     }

//     const requestBody = { contents: [{ parts }] };
//     const requestOptions = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestBody)
//     };

//     let botResponseText = "";
//     let formattedResponse = "";
//     try {
//         const response = await fetch(GEMINI_API_URL, requestOptions);
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

//         // Reset file data after processing
//         userData.file = { data: null, mime_type: null, uri: null };
//         incomingMessageDiv.classList.remove("thinking");
//         chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
//     }
// };

// const handleBotResponse = () => {
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
// }

// const handleOutgoingMessage = (e) => {
//     e.preventDefault();
//     userData.message = messageInput.value.trim();
//     // Don't send if there's no text and no image file in the previewer
//     if (!userData.message && !userData.file.data) return;

//     const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//     if (currentChat) {
//         currentChat.messages.push({
//             sender: "user",
//             type: userData.file.data ? "image" : "text",
//             content: userData.message,
//             fileData: userData.file.data,
//             mimeType: userData.file.mime_type,
//             timestamp: Date.now()
//         });
//         currentChat.lastActive = Date.now();
//         saveChatHistory();
//         renderChatHistory();
//     }

//     const messageHTML = `<div class="message-text">${userData.message}</div>
//                         ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}
//                         <div class="user-message-time">${formatMessageTime(Date.now())}</div>`;

//     const outgoingMessageDiv = createMessageElement(messageHTML, "user-message");
//     chatBody.appendChild(outgoingMessageDiv);
//     chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

//     messageInput.value = "";
//     fileUploadWrapper.classList.remove("file-uploaded");
//     messageInput.dispatchEvent(new Event("input"));

//     handleBotResponse();
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

//     // This fetch call might not work without a running local server at port 3007
//     fetch('http://localhost:3007/save-user', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userInfo),
//     })
//     .then(response => response.json())
//     .then(data => console.log('User data saved:', data))
//     .catch(error => console.error('Error saving user (silent):', error));
// });

// chatbotToggler.addEventListener("click", () => {
//     const isAnythingOpen = document.body.classList.contains("show-user-form") || document.body.classList.contains("show-chatbot");
//     if (isAnythingOpen) {
//         document.body.classList.remove("show-user-form", "show-chatbot");
//     } else {
//         document.body.classList.add(userInfo ? "show-chatbot" : "show-user-form");
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

// // MODIFIED fileInput listener
// fileInput.addEventListener("change", () => {
//     const file = fileInput.files[0];
//     if (!file) return;

//     if (file.type === "application/pdf") {
//         uploadPdfAndAsk(file); // --- NEW: Handle PDF upload flow
//     } else if (file.type.startsWith("image/")) {
//         // Existing image handling logic
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             fileUploadWrapper.querySelector("img").src = e.target.result;
//             fileUploadWrapper.classList.add("file-uploaded");
//             const base64String = e.target.result.split(",")[1];
//             userData.file = { data: base64String, mime_type: file.type, uri: null };
//         };
//         reader.readAsDataURL(file);
//     } else {
//         alert("Unsupported file type. Please select an image or a PDF.");
//     }
//     fileInput.value = ""; // Clear input after selection
// });


// fileCancelButton.addEventListener("click", () => {
//     userData.file = { data: null, mime_type: null, uri: null };
//     fileUploadWrapper.classList.remove("file-uploaded");
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

// closeHistoryButton.addEventListener("click", () => document.body.classList.remove("show-chat-history"));

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
// injectHistoryStyles();
// setupVoiceRecognition();


// --------------------- real pdf look like ------------------------------------


















































































































































































































































































// demo for pdf preview


// const chatBody = document.querySelector(".chat-body");
// const messageInput = document.querySelector(".message-input");
// const sendMessageButton = document.querySelector("#send-message");
// const fileInput = document.querySelector("#file-input");

// const pdfPreviewContainer = document.querySelector("#pdf-preview"); 
// const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
// const fileCancelButton = document.querySelector("#file-cancel");

// const chatbotToggler = document.querySelector("#chatbot-toggler");
// const closeChatbot = document.querySelector("#close-chatbot");

// const userInfoPopup = document.querySelector(".user-info-popup");
// const userInfoForm = document.querySelector("#user-info-form");
// const userNameInput = document.querySelector("#user-name");
// const userEmailInput = document.querySelector("#user-email");

// const chatHistoryButton = document.querySelector("#chat-history");
// const chatHistorySidebar = document.querySelector(".chat-history-sidebar");
// const closeHistoryButton = document.querySelector("#close-history");
// const historyList = document.querySelector(".history-list");
// const deleteAllHistoryButton = document.querySelector("#delete-all-history");

// const voiceAssistButton = document.querySelector("#voice-assist");

// const API_KEY = "AIzaSyCND8_k9nMfIrl8OhpVAYXoMGwh7dlR3Xs";

// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// const FILE_API_BASE_URL = `https://generativelanguage.googleapis.com`;

// let currentChatId = null;
// let chatHistory = [];
// let userInfo = null;
// let pendingPdfFile = null; 

// const userData = {
//     message: null,
//     file: {
//         data: null,      
//         mime_type: null,
//         uri: null,       
//         rawFile: null    
//     }
// };

// const initialInputHeight = messageInput.scrollHeight;
// let recognition;
// let isListening = false;
// let activePdfUploads = {};

// const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// }

// const injectHistoryStyles = () => {
//     const style = document.createElement('style');
//     style.innerHTML = `
//         .chat-history-item-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
//         .chat-time { font-size: 0.75rem; color: #6c757d; flex-shrink: 0; margin-left: 10px; }
//         .user-message-time { font-size: 0.7rem; color: #888; text-align: right; margin-top: 5px; padding-right: 10px; }
//     `;
//     document.head.appendChild(style);
// };

// const saveChatHistory = () => {
//     if (!userInfo || !userInfo.email) return;
//     const userHistoryKey = `chatHistory_${userInfo.email}`;
//     localStorage.setItem(userHistoryKey, JSON.stringify(chatHistory));
// };

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
//         return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
//     } else if (targetDateOnly.getTime() === yesterday.getTime()) {
//         return "Yesterday";
//     } else {
//         return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
//     }
// };

// const formatMessageTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp);
//     if (isNaN(date.getTime())) return "";
//     return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
// };

// const renderChatHistory = () => {
//     historyList.innerHTML = "";
//     const sortedHistory = [...chatHistory].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
//     sortedHistory.forEach(chat => {
//         const chatItem = document.createElement("li");
//         chatItem.setAttribute("data-chat-id", chat.id);
//         const firstUserMessage = chat.messages.find(msg => msg.sender === "user" && (msg.type === "text" || msg.type === "pdf"));
//         let chatTitleText = "New Chat";
//         if (firstUserMessage) {
//             if (firstUserMessage.type === 'pdf') {
//                 chatTitleText = firstUserMessage.fileName || "PDF Document";
//             } else {
//                 chatTitleText = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "");
//             }
//         } else if (chat.messages.length > 0 && chat.messages[0].content) {
//             chatTitleText = chat.messages[0].content.substring(0, 30) + (chat.messages[0].content.length > 30 ? "..." : "");
//         }
//         const chatTime = formatChatTimestamp(chat.lastActive);
//         chatItem.innerHTML = `<div class="chat-history-item-content"><span class="chat-title">${chatTitleText}</span><span class="chat-time">${chatTime}</span></div><button class="material-symbols-rounded delete-chat-item">delete</button>`;
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

// const deleteAllHistory = () => {
//     let alertDiv = document.querySelector(".delete-confirmation-alert");
//     if (!alertDiv) {
//         alertDiv = document.createElement("div");
//         alertDiv.className = "delete-confirmation-alert";
//         alertDiv.innerHTML = `<p>Are you sure you want to delete all your chat history?</p><div class="delete-confirmation-buttons"><button class="confirm-delete">Delete</button><button class="cancel-delete">Cancel</button></div>`;
//         deleteAllHistoryButton.parentNode.insertBefore(alertDiv, deleteAllHistoryButton);
//         alertDiv.querySelector(".confirm-delete").addEventListener("click", () => {
//             if (!userInfo || !userInfo.email) return;
//             chatHistory = [];
//             localStorage.removeItem(`chatHistory_${userInfo.email}`);
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

// const createPdfUploadElement = (messageId, fileName, fileSize, isCompleted = false, fileUri = null) => {
//     const formattedSize = formatFileSize(fileSize);
//     const statusContent = isCompleted
//         ? `<span class="upload-status"><span class="material-symbols-rounded completed-check">check_circle</span> Completed</span>`
//         : `<span class="file-size">${formattedSize}</span><span class="upload-status">Uploading...</span>`;
    
//     const fileNameContent = isCompleted
//         ? `<a href="${fileUri}" target="_blank" style="text-decoration: none; color: #fff;"><div class="file-name">${fileName}</div></a>`
//         : `<div class="file-name">${fileName}</div>`;

//     return `
//         <div class="pdf-upload-container ${isCompleted ? 'completed' : ''}" id="pdf-${messageId}">
//             <span class="material-symbols-rounded pdf-icon">picture_as_pdf</span>
//             <div class="file-info">
//                 ${fileNameContent}
//                 <div class="progress-details">${statusContent}</div>
//                 ${!isCompleted ? '<div class="progress-bar"><div class="progress"></div></div>' : ''}
//             </div>
//         </div>`;
// };

// const startPdfUploadProcess = async (file, messageId, userQuery) => {
//     const ui = {
//         container: document.getElementById(`pdf-${messageId}`),
//         progressBar: document.querySelector(`#pdf-${messageId} .progress`),
//         statusText: document.querySelector(`#pdf-${messageId} .upload-status`),
//     };

//     try {
//         const startResponse = await fetch(`${FILE_API_BASE_URL}/upload/v1beta/files?key=${API_KEY}`, {
//             method: 'POST',
//             headers: {
//                 'X-Goog-Upload-Protocol': 'resumable',
//                 'X-Goog-Upload-Command': 'start',
//                 'X-Goog-Upload-Header-Content-Length': file.size,
//                 'X-Goog-Upload-Header-Content-Type': file.type,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ 'file': { 'display_name': file.name } })
//         });
//         if (!startResponse.ok) throw new Error(`API Error: ${startResponse.statusText}`);
//         const uploadUrl = startResponse.headers.get('X-Goog-Upload-Url');
//         if (!uploadUrl) throw new Error("Could not get upload URL.");

//         const xhr = new XMLHttpRequest();
//         activePdfUploads[messageId] = xhr;
//         xhr.open('POST', uploadUrl, true);
//         xhr.setRequestHeader('X-Goog-Upload-Command', 'upload, finalize');
//         xhr.setRequestHeader('Content-Type', file.type);
//         xhr.upload.onprogress = (event) => {
//             if (event.lengthComputable) {
//                 const percentComplete = (event.loaded / event.total) * 100;
//                 ui.progressBar.style.width = percentComplete + '%';
//                 ui.statusText.textContent = `${Math.round(percentComplete)}% uploaded`;
//             }
//         };

//         xhr.onload = () => {
//             delete activePdfUploads[messageId];
//             if (xhr.status === 200) {
//                 const response = JSON.parse(xhr.responseText);
//                 const fileUri = response.file.uri;

//                 ui.container.classList.add('completed');
//                 ui.progressBar.parentElement.style.display = 'none';
//                 ui.statusText.innerHTML = `<span class="material-symbols-rounded completed-check">check_circle</span> Completed`;
                
//                 const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//                 const msgToUpdate = currentChat?.messages.find(msg => msg.id === messageId);
//                 if (msgToUpdate) {
//                     msgToUpdate.fileUri = fileUri;
//                     saveChatHistory();
//                 }

//                 userData.message = userQuery || `The user uploaded a file named "${file.name}". Please provide a brief summary of this document.`;
//                 userData.file = { uri: fileUri, mime_type: file.type, data: null, rawFile: null };
//                 handleBotResponse();
//             } else {
//                 throw new Error(`Upload failed: ${xhr.statusText}`);
//             }
//         };

//         xhr.onerror = () => {
//             delete activePdfUploads[messageId];
//             ui.statusText.textContent = "Upload failed.";
//             ui.statusText.style.color = "#d93025";
//         };
//         xhr.send(file);
//     } catch (error) {
//         console.error("PDF Upload Error:", error);
//         if(ui.statusText) {
//             ui.statusText.textContent = "Error!";
//             ui.statusText.style.color = "#d93025";
//         }
//     }
// }

// const renderPdfMessageFromHistory = (msg) => {
//     const content = `
//         ${msg.content ? `<div class="message-text">${msg.content}</div>` : ''}
//         ${createPdfUploadElement(msg.id, msg.fileName, msg.fileSize, true, msg.fileUri)}
//         <div class="user-message-time">${formatMessageTime(msg.timestamp)}</div>`;
//     return createMessageElement(content, "user-message");
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
//         let messageDiv;
//         if (msg.sender === "bot") {
//             let messageContent = msg.formattedContent || msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
//             const content = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" fill="#fff"></path></svg><div class="message-text">${messageContent}</div>`;
//             messageDiv = createMessageElement(content, "bot-message");
//         } else {
//             if (msg.type === 'pdf') {
//                 messageDiv = renderPdfMessageFromHistory(msg);
//             } else {
//                 const content = `
//                     ${msg.content ? `<div class="message-text">${msg.content}</div>` : ''}
//                     ${msg.type === "image" && msg.fileData ? `<img src="data:${msg.mimeType};base64,${msg.fileData}" class="attachment" />` : ""}
//                     <div class="user-message-time">${formatMessageTime(msg.timestamp)}</div>`;
//                 messageDiv = createMessageElement(content, "user-message");
//             }
//         }
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
//     userData.file = { data: null, mime_type: null, uri: null, rawFile: null };
//     pendingPdfFile = null;
//     pdfPreviewContainer.style.display = 'none';
//     pdfPreviewContainer.innerHTML = '';
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
//     const welcomeMessageHTML = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" fill="#fff"></path></svg><div class="message-text">${welcomeMessageContent}</div>`;
//     const welcomeDiv = createMessageElement(welcomeMessageHTML, "bot-message");
//     chatBody.appendChild(welcomeDiv);
//     const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//     if (currentChat && currentChat.messages.length === 0) {
//         currentChat.messages.push({ sender: "bot", type: "text", content: welcomeMessageContent, formattedContent: welcomeMessageContent });
//         currentChat.lastActive = Date.now();
//         saveChatHistory();
//         renderChatHistory();
//     }
// };

// const generateBotResponse = async (incomingMessageDiv) => {
//     const messageElement = incomingMessageDiv.querySelector(".message-text");
//     const parts = [];
//     if (userData.message) parts.push({ text: userData.message });
//     if (userData.file.uri) {
//         parts.push({ file_data: { mime_type: userData.file.mime_type, file_uri: userData.file.uri } });
//     } else if (userData.file.data) {
//         parts.push({ inline_data: { mime_type: userData.file.mime_type, data: userData.file.data } });
//     }
//     const requestBody = { contents: [{ parts }] };
//     const requestOptions = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestBody) };
//     let botResponseText = "";
//     let formattedResponse = "";
//     try {
//         const response = await fetch(GEMINI_API_URL, requestOptions);
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error.message || `API Error: ${response.status}`);
//         }
//         const data = await response.json();
//         let rawText = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process that.";
//         formattedResponse = rawText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>').replace(/#+\s*(.*?)(?:\n|$)/g, '<strong>$1</strong>').replace(/- /g, '• ').replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre>$1</pre>').replace(/\`(.*?)\`/g, '<code>$1</code>');
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
//             currentChat.messages.push({ sender: "bot", type: "text", content: botResponseText, formattedContent: formattedResponse });
//             currentChat.lastActive = Date.now();
//             saveChatHistory();
//             renderChatHistory();
//         }
//         userData.file = { data: null, mime_type: null, uri: null, rawFile: null };
//         incomingMessageDiv.classList.remove("thinking");
//         chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
//     }
// };

// const handleBotResponse = () => {
//     setTimeout(() => {
//         const thinkingMessageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" fill="#fff"></path></svg><div class="message-text"><div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`;
//         const incomingMessageDiv = createMessageElement(thinkingMessageContent, "bot-message", "thinking");
//         chatBody.appendChild(incomingMessageDiv);
//         chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
//         generateBotResponse(incomingMessageDiv);
//     }, 600);
// }

// const handleOutgoingMessage = (e) => {
//     e.preventDefault();
//     const userMessage = messageInput.value.trim();

//     if (!userMessage && !userData.file.data && !pendingPdfFile) return;

//     const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//     if (!currentChat) return;

//     if (pendingPdfFile) {
//         const messageId = `msg_${Date.now()}`;
//         const messageData = {
//             id: messageId,
//             sender: "user",
//             type: "pdf",
//             content: userMessage,
//             fileName: pendingPdfFile.name,
//             fileSize: pendingPdfFile.size,
//             fileUri: null, 
//             timestamp: Date.now()
//         };
//         currentChat.messages.push(messageData);

//         const pdfUploadHTML = createPdfUploadElement(messageId, pendingPdfFile.name, pendingPdfFile.size);
//         const messageHTML = `
//             ${userMessage ? `<div class="message-text">${userMessage}</div>` : ''}
//             ${pdfUploadHTML}
//             <div class="user-message-time">${formatMessageTime(Date.now())}</div>`;
        
//         const outgoingMessageDiv = createMessageElement(messageHTML, "user-message");
//         chatBody.appendChild(outgoingMessageDiv);

//         startPdfUploadProcess(pendingPdfFile, messageId, userMessage);
        
//         pendingPdfFile = null;
//         pdfPreviewContainer.style.display = 'none';
//         pdfPreviewContainer.innerHTML = '';
//         fileUploadWrapper.classList.remove("file-uploaded");
//         messageInput.value = "";
//         messageInput.dispatchEvent(new Event("input"));

//     } else if (userData.file.data) {
//         const messageData = {
//             sender: "user",
//             type: "image",
//             content: userMessage,
//             fileData: userData.file.data,
//             mimeType: userData.file.mime_type,
//             timestamp: Date.now()
//         };
//         currentChat.messages.push(messageData);
        
//         const messageHTML = `
//             ${userMessage ? `<div class="message-text">${userMessage}</div>` : ''}
//             <img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />
//             <div class="user-message-time">${formatMessageTime(Date.now())}</div>`;

//         const outgoingMessageDiv = createMessageElement(messageHTML, "user-message");
//         chatBody.appendChild(outgoingMessageDiv);
        
//         userData.message = userMessage; 
//         handleBotResponse();

//         // Clear the file preview and input after sending
//         userData.file = { data: null, mime_type: null, uri: null, rawFile: null };
//         fileUploadWrapper.classList.remove("file-uploaded");
//         messageInput.value = "";
//         messageInput.dispatchEvent(new Event("input"));

//     } else if (userMessage) {
//         const messageData = {
//             sender: "user",
//             type: "text",
//             content: userMessage,
//             timestamp: Date.now()
//         };
//         currentChat.messages.push(messageData);

//         const messageHTML = `<div class="message-text">${userMessage}</div><div class="user-message-time">${formatMessageTime(Date.now())}</div>`;
//         const outgoingMessageDiv = createMessageElement(messageHTML, "user-message");
//         chatBody.appendChild(outgoingMessageDiv);
        
//         userData.message = userMessage; 
//         handleBotResponse();

//         // Clear the input after sending
//         messageInput.value = "";
//         messageInput.dispatchEvent(new Event("input"));
//     }

//     currentChat.lastActive = Date.now();
//     saveChatHistory();
//     renderChatHistory();
    
//     chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
// };

// userInfoForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const name = userNameInput.value.trim();
//     const email = userEmailInput.value.trim();
//     if (!name || !email) return;
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
// });

// chatbotToggler.addEventListener("click", () => {
//     const isAnythingOpen = document.body.classList.contains("show-user-form") || document.body.classList.contains("show-chatbot");
//     document.body.classList.toggle("show-user-form", !isAnythingOpen && !userInfo);
//     document.body.classList.toggle("show-chatbot", !isAnythingOpen && userInfo);
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

// const clearPdfPreview = () => {
//     pendingPdfFile = null;
//     pdfPreviewContainer.innerHTML = '';
//     pdfPreviewContainer.style.display = 'none';
//     fileInput.value = ''; 
// };

// fileInput.addEventListener("change", () => {
//     const file = fileInput.files[0];
//     if (!file) return;

//     clearPdfPreview();
//     fileUploadWrapper.classList.remove("file-uploaded");
//     userData.file = { data: null, mime_type: null, uri: null, rawFile: null };

//     if (file.type === "application/pdf") {
//         pendingPdfFile = file; 
//         pdfPreviewContainer.innerHTML = `
//             <div class="preview-content">
//                 <span class="material-symbols-rounded preview-icon">picture_as_pdf</span>
//                 <div class="preview-info">
//                     <div class="preview-name">${file.name}</div>
//                     <div class="preview-size">${formatFileSize(file.size)}</div>
//                 </div>
//             </div>
//             <button class="material-symbols-rounded preview-cancel-btn">close</button>
//         `;
//         pdfPreviewContainer.style.display = 'flex';
//         pdfPreviewContainer.querySelector(".preview-cancel-btn").addEventListener("click", clearPdfPreview);

//     } else if (file.type.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             fileUploadWrapper.querySelector("img").src = e.target.result;
//             fileUploadWrapper.classList.add("file-uploaded");
//             const base64String = e.target.result.split(",")[1];
//             userData.file = { data: base64String, mime_type: file.type, uri: null, rawFile: null };
//         };
//         reader.readAsDataURL(file);
//     } else {
//         alert("Unsupported file type. Please select an image or a PDF.");
//     }
//     fileInput.value = ""; 
// });

// fileCancelButton.addEventListener("click", () => {
//     userData.file = { data: null, mime_type: null, uri: null, rawFile: null };
//     fileUploadWrapper.classList.remove("file-uploaded");
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
// document.querySelector(".chat-form").addEventListener("submit", handleOutgoingMessage);
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
//     if (!e.target.closest(".header-actions")) dropdownMenu.classList.remove("show");
//     if (!e.target.closest("em-emoji-picker") && e.target.id !== "emoji-picker") {
//         document.body.classList.remove("show-emoji-picker");
//     }
// });

// chatHistoryButton.addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//     document.body.classList.toggle("show-chat-history");
//     renderChatHistory();
// });

// closeHistoryButton.addEventListener("click", () => document.body.classList.remove("show-chat-history"));

// document.querySelector("#clear-chat").addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//     const chatToClearId = currentChatId;
//     const currentChat = chatHistory.find(chat => chat.id === chatToClearId);
//     if (currentChat) {
//         currentChat.messages = currentChat.messages.filter(msg => msg.sender === "bot" && msg.content.includes("Hey there 👋"));
//     }
//     clearChatMessages();
//     createWelcomeMessage();
//     saveChatHistory();
//     renderChatHistory();
// });

// document.querySelector("#new-chat").addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//     startNewChat();
// });

// deleteAllHistoryButton.addEventListener("click", deleteAllHistory);

// const setupVoiceRecognition = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//         voiceAssistButton.style.display = "none";
//         return;
//     }
//     recognition = new webkitSpeechRecognition();
//     recognition.continuous = false;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';
//     recognition.onstart = () => { isListening = true; voiceAssistButton.classList.add("listening"); };
//     recognition.onresult = (event) => {
//         let interimTranscript = '', finalTranscript = '';
//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//             const transcript = event.results[i][0].transcript;
//             if (event.results[i].isFinal) finalTranscript += transcript;
//             else interimTranscript += transcript;
//         }
//         messageInput.value = finalTranscript || interimTranscript;
//         messageInput.dispatchEvent(new Event("input"));
//     };
//     recognition.onerror = (event) => { console.error('Speech recognition error:', event.error); isListening = false; voiceAssistButton.classList.remove("listening"); };
//     recognition.onend = () => {
//         isListening = false;
//         voiceAssistButton.classList.remove("listening");
//         if (messageInput.value.trim() !== "" || pendingPdfFile || userData.file.data) {
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
// injectHistoryStyles();
// setupVoiceRecognition();















































































































































































































// latest with ai answering with image and pdf preview --- 26-06-25 

const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");

const pdfPreviewContainer = document.querySelector("#pdf-preview");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");

const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

const userInfoPopup = document.querySelector(".user-info-popup");
const userInfoForm = document.querySelector("#user-info-form");
const userNameInput = document.querySelector("#user-name");
const userEmailInput = document.querySelector("#user-email");

const chatHistoryButton = document.querySelector("#chat-history");
const chatHistorySidebar = document.querySelector(".chat-history-sidebar");
const closeHistoryButton = document.querySelector("#close-history");
const historyList = document.querySelector(".history-list");
const deleteAllHistoryButton = document.querySelector("#delete-all-history");

const voiceAssistButton = document.querySelector("#voice-assist");

const API_KEY = "AIzaSyCND8_k9nMfIrl8OhpVAYXoMGwh7dlR3Xs"; // Replace with your actual Gemini API Key

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const FILE_API_BASE_URL = `https://generativelanguage.googleapis.com`;

let currentChatId = null;
let chatHistory = [];
let userInfo = null;
let pendingPdfFile = null;

const userData = {
    message: null,
    file: {
        data: null, // For image base64
        mime_type: null,
        uri: null, // For PDF file URI
        rawFile: null
    }
};

const initialInputHeight = messageInput.scrollHeight;
let recognition;
let isListening = false;
let activePdfUploads = {};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const injectHistoryStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        .chat-history-item-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .chat-time { font-size: 0.75rem; color: #6c757d; flex-shrink: 0; margin-left: 10px; }
        .user-message-time { font-size: 0.7rem; color: #888; text-align: right; margin-top: 5px; padding-right: 10px; }
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
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } else if (targetDateOnly.getTime() === yesterday.getTime()) {
        return "Yesterday";
    } else {
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short'
        });
    }
};

const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const renderChatHistory = () => {
    historyList.innerHTML = "";
    const sortedHistory = [...chatHistory].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
    sortedHistory.forEach(chat => {
        const chatItem = document.createElement("li");
        chatItem.setAttribute("data-chat-id", chat.id);
        const firstUserMessage = chat.messages.find(msg => msg.sender === "user" && (msg.type === "text" || msg.type === "pdf"));
        let chatTitleText = "New Chat";
        if (firstUserMessage) {
            if (firstUserMessage.type === 'pdf') {
                chatTitleText = firstUserMessage.fileName || "PDF Document";
            } else {
                chatTitleText = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "");
            }
        } else if (chat.messages.length > 0 && chat.messages[0].content) {
            chatTitleText = chat.messages[0].content.substring(0, 30) + (chat.messages[0].content.length > 30 ? "..." : "");
        }
        const chatTime = formatChatTimestamp(chat.lastActive);
        chatItem.innerHTML = `<div class="chat-history-item-content"><span class="chat-title">${chatTitleText}</span><span class="chat-time">${chatTime}</span></div><button class="material-symbols-rounded delete-chat-item">delete</button>`;
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
        alertDiv.innerHTML = `<p>Are you sure you want to delete all your chat history?</p><div class="delete-confirmation-buttons"><button class="confirm-delete">Delete</button><button class="cancel-delete">Cancel</button></div>`;
        deleteAllHistoryButton.parentNode.insertBefore(alertDiv, deleteAllHistoryButton);
        alertDiv.querySelector(".confirm-delete").addEventListener("click", () => {
            if (!userInfo || !userInfo.email) return;
            chatHistory = [];
            localStorage.removeItem(`chatHistory_${userInfo.email}`);
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

const createPdfUploadElement = (messageId, fileName, fileSize, isCompleted = false, fileUri = null) => {
    const formattedSize = formatFileSize(fileSize);
    const statusContent = isCompleted ?
        `<span class="upload-status"><span class="material-symbols-rounded completed-check">check_circle</span> Completed</span>` :
        `<span class="file-size">${formattedSize}</span><span class="upload-status">Uploading...</span>`;

    const fileNameContent = isCompleted ?
        `<a href="${fileUri}" target="_blank" style="text-decoration: none; color: #fff;"><div class="file-name">${fileName}</div></a>` :
        `<div class="file-name">${fileName}</div>`;

    return `
        <div class="pdf-upload-container ${isCompleted ? 'completed' : ''}" id="pdf-${messageId}">
            <span class="material-symbols-rounded pdf-icon">picture_as_pdf</span>
            <div class="file-info">
                ${fileNameContent}
                <div class="progress-details">${statusContent}</div>
                ${!isCompleted ? '<div class="progress-bar"><div class="progress"></div></div>' : ''}
            </div>
        </div>`;
};

const startPdfUploadProcess = async (file, messageId, userQuery) => {
    const ui = {
        container: document.getElementById(`pdf-${messageId}`),
        progressBar: document.querySelector(`#pdf-${messageId} .progress`),
        statusText: document.querySelector(`#pdf-${messageId} .upload-status`),
    };

    try {
        const startResponse = await fetch(`${FILE_API_BASE_URL}/upload/v1beta/files?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'X-Goog-Upload-Protocol': 'resumable',
                'X-Goog-Upload-Command': 'start',
                'X-Goog-Upload-Header-Content-Length': file.size,
                'X-Goog-Upload-Header-Content-Type': file.type,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'file': {
                    'display_name': file.name
                }
            })
        });
        if (!startResponse.ok) throw new Error(`API Error: ${startResponse.statusText}`);
        const uploadUrl = startResponse.headers.get('X-Goog-Upload-Url');
        if (!uploadUrl) throw new Error("Could not get upload URL.");

        const xhr = new XMLHttpRequest();
        activePdfUploads[messageId] = xhr;
        xhr.open('POST', uploadUrl, true);
        xhr.setRequestHeader('X-Goog-Upload-Command', 'upload, finalize');
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                ui.progressBar.style.width = percentComplete + '%';
                ui.statusText.textContent = `${Math.round(percentComplete)}% uploaded`;
            }
        };

        xhr.onload = () => {
            delete activePdfUploads[messageId];
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                const fileUri = response.file.uri;

                ui.container.classList.add('completed');
                ui.progressBar.parentElement.style.display = 'none';
                ui.statusText.innerHTML = `<span class="material-symbols-rounded completed-check">check_circle</span> Completed`;

                const currentChat = chatHistory.find(chat => chat.id === currentChatId);
                const msgToUpdate = currentChat?.messages.find(msg => msg.id === messageId);
                if (msgToUpdate) {
                    msgToUpdate.fileUri = fileUri;
                    saveChatHistory();
                }

                userData.message = userQuery || `The user uploaded a file named "${file.name}". Please provide a brief summary of this document.`;
                userData.file = {
                    uri: fileUri,
                    mime_type: file.type,
                    data: null,
                    rawFile: null
                };
                handleBotResponse();
            } else {
                throw new Error(`Upload failed: ${xhr.statusText}`);
            }
        };

        xhr.onerror = () => {
            delete activePdfUploads[messageId];
            ui.statusText.textContent = "Upload failed.";
            ui.statusText.style.color = "#d93025";
        };
        xhr.send(file);
    } catch (error) {
        console.error("PDF Upload Error:", error);
        if (ui.statusText) {
            ui.statusText.textContent = "Error!";
            ui.statusText.style.color = "#d93025";
        }
    }
}

const renderPdfMessageFromHistory = (msg) => {
    const content = `
        ${msg.content ? `<div class="message-text">${msg.content}</div>` : ''}
        ${createPdfUploadElement(msg.id, msg.fileName, msg.fileSize, true, msg.fileUri)}
        <div class="user-message-time">${formatMessageTime(msg.timestamp)}</div>`;
    return createMessageElement(content, "user-message");
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
        let messageDiv;
        if (msg.sender === "bot") {
            let messageContent = msg.formattedContent || msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            const content = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" fill="#fff"></path></svg><div class="message-text">${messageContent}</div>`;
            messageDiv = createMessageElement(content, "bot-message");
        } else {
            if (msg.type === 'pdf') {
                messageDiv = renderPdfMessageFromHistory(msg);
            } else {
                const content = `
                    ${msg.content ? `<div class="message-text">${msg.content}</div>` : ''}
                    ${msg.type === "image" && msg.fileData ? `<img src="data:${msg.mimeType};base64,${msg.fileData}" class="attachment" />` : ""}
                    <div class="user-message-time">${formatMessageTime(msg.timestamp)}</div>`;
                messageDiv = createMessageElement(content, "user-message");
            }
        }
        chatBody.appendChild(messageDiv);
    });
    chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth"
    });
};

const startNewChat = () => {
    currentChatId = Date.now().toString();
    chatHistory.push({
        id: currentChatId,
        messages: [],
        lastActive: Date.now()
    });
    saveChatHistory();
    renderChatHistory();
    clearChatMessages();
    createWelcomeMessage();
};

const clearChatMessages = () => {
    chatBody.innerHTML = "";
    userData.message = null;
    userData.file = {
        data: null,
        mime_type: null,
        uri: null,
        rawFile: null
    };
    pendingPdfFile = null;
    pdfPreviewContainer.style.display = 'none';
    pdfPreviewContainer.innerHTML = '';
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
    const welcomeMessageHTML = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" fill="#fff"></path></svg><div class="message-text">${welcomeMessageContent}</div>`;
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
    const parts = [];
    if (userData.message) parts.push({
        text: userData.message
    });
    if (userData.file.uri) {
        parts.push({
            file_data: {
                mime_type: userData.file.mime_type,
                file_uri: userData.file.uri
            }
        });
    } else if (userData.file.data) {
        parts.push({
            inline_data: {
                mime_type: userData.file.mime_type,
                data: userData.file.data
            }
        });
    }
    const requestBody = {
        contents: [{
            parts
        }]
    };
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    };
    let botResponseText = "";
    let formattedResponse = "";
    try {
        const response = await fetch(GEMINI_API_URL, requestOptions);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || `API Error: ${response.status}`);
        }
        const data = await response.json();
       let rawText = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process that.";
        formattedResponse = rawText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>').replace(/#+\s*(.*?)(?:\n|$)/g, '<strong>$1</strong>').replace(/- /g, '• ').replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre>$1</pre>').replace(/\`(.*?)\`/g, '<code>$1</code>');
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
        
        // --- CORRECTED ---
        // Reset file data AFTER the bot response has been generated and sent.
        userData.file = { data: null, mime_type: null, uri: null, rawFile: null };

        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({
            top: chatBody.scrollHeight,
            behavior: "smooth"
        });
    }
};

const handleBotResponse = () => {
    setTimeout(() => {
        const thinkingMessageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" fill="#fff"></path></svg><div class="message-text"><div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`;
        const incomingMessageDiv = createMessageElement(thinkingMessageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({
            top: chatBody.scrollHeight,
            behavior: "smooth"
        });
        generateBotResponse(incomingMessageDiv);
    }, 600);
}

// --- FULLY CORRECTED FUNCTION ---
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();

    // Do not proceed if there's no text, no staged PDF, and no staged Image.
    if (!userData.message && !userData.file.data && !pendingPdfFile) return;

    const currentChat = chatHistory.find(chat => chat.id === currentChatId);
    if (!currentChat) return;

    // Handle PDF upload
    if (pendingPdfFile) {
        const messageId = `msg_${Date.now()}`;
        const messageData = {
            id: messageId,
            sender: "user",
            type: "pdf",
            content: userData.message,
            fileName: pendingPdfFile.name,
            fileSize: pendingPdfFile.size,
            fileUri: null,
            timestamp: Date.now()
        };
        currentChat.messages.push(messageData);

        const pdfUploadHTML = createPdfUploadElement(messageId, pendingPdfFile.name, pendingPdfFile.size);
        const messageHTML = `
            ${userData.message ? `<div class="message-text">${userData.message}</div>` : ''}
            ${pdfUploadHTML}
            <div class="user-message-time">${formatMessageTime(Date.now())}</div>`;

        const outgoingMessageDiv = createMessageElement(messageHTML, "user-message");
        chatBody.appendChild(outgoingMessageDiv);

        startPdfUploadProcess(pendingPdfFile, messageId, userData.message);

        // Clear staged PDF and input
        pendingPdfFile = null;
        pdfPreviewContainer.style.display = 'none';
        pdfPreviewContainer.innerHTML = '';
        messageInput.value = "";
        messageInput.dispatchEvent(new Event("input"));

    } else { // Handle regular text or image messages
        currentChat.messages.push({
            sender: "user",
            type: userData.file.data ? "image" : "text",
            content: userData.message,
            fileData: userData.file.data,
            mimeType: userData.file.mime_type,
            timestamp: Date.now()
        });

        const messageHTML = `
            ${userData.message ? `<div class="message-text">${userData.message}</div>` : ''}
            ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}
            <div class="user-message-time">${formatMessageTime(Date.now())}</div>`;

        const outgoingMessageDiv = createMessageElement(messageHTML, "user-message");
        chatBody.appendChild(outgoingMessageDiv);

        // Trigger the bot response. `userData` still contains the message and file data.
        handleBotResponse();

        // Clear ONLY the input field and UI preview.
        // DO NOT clear userData.file here.
        messageInput.value = "";
        fileUploadWrapper.classList.remove("file-uploaded");
        messageInput.dispatchEvent(new Event("input"));
    }

    currentChat.lastActive = Date.now();
    saveChatHistory();
    renderChatHistory();

    chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth"
    });
};


userInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    if (!name || !email) return;
    userInfo = {
        name,
        email
    };
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
});

chatbotToggler.addEventListener("click", () => {
    const isAnythingOpen = document.body.classList.contains("show-user-form") || document.body.classList.contains("show-chatbot");
    document.body.classList.toggle("show-user-form", !isAnythingOpen && !userInfo);
    document.body.classList.toggle("show-chatbot", !isAnythingOpen && userInfo);
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

const clearPdfPreview = () => {
    pendingPdfFile = null;
    pdfPreviewContainer.innerHTML = '';
    pdfPreviewContainer.style.display = 'none';
    fileInput.value = '';
};

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    clearPdfPreview();
    fileUploadWrapper.classList.remove("file-uploaded");
    userData.file = {
        data: null,
        mime_type: null,
        uri: null,
        rawFile: null
    };

    if (file.type === "application/pdf") {
        pendingPdfFile = file;
        pdfPreviewContainer.innerHTML = `
            <div class="preview-content">
                <span class="material-symbols-rounded preview-icon">picture_as_pdf</span>
                <div class="preview-info">
                    <div class="preview-name">${file.name}</div>
                    <div class="preview-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button class="material-symbols-rounded preview-cancel-btn">close</button>
        `;
        pdfPreviewContainer.style.display = 'flex';
        pdfPreviewContainer.querySelector(".preview-cancel-btn").addEventListener("click", clearPdfPreview);

    } else if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            fileUploadWrapper.querySelector("img").src = e.target.result;
            fileUploadWrapper.classList.add("file-uploaded");
            const base64String = e.target.result.split(",")[1];
            userData.file = {
                data: base64String,
                mime_type: file.type,
                uri: null,
                rawFile: null
            };
        };
        reader.readAsDataURL(file);
    } else {
        alert("Unsupported file type. Please select an image or a PDF.");
    }
    fileInput.value = "";
});

fileCancelButton.addEventListener("click", () => {
    userData.file = {
        data: null,
        mime_type: null,
        uri: null,
        rawFile: null
    };
    fileUploadWrapper.classList.remove("file-uploaded");
});

const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const {
            selectionStart: start,
            selectionEnd: end
        } = messageInput;
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
document.querySelector(".chat-form").addEventListener("submit", handleOutgoingMessage);
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
    if (!e.target.closest(".header-actions")) dropdownMenu.classList.remove("show");
    if (!e.target.closest("em-emoji-picker") && e.target.id !== "emoji-picker") {
        document.body.classList.remove("show-emoji-picker");
    }
});

chatHistoryButton.addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
    document.body.classList.toggle("show-chat-history");
    renderChatHistory();
});

closeHistoryButton.addEventListener("click", () => document.body.classList.remove("show-chat-history"));

document.querySelector("#clear-chat").addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
    const chatToClearId = currentChatId;
    const currentChat = chatHistory.find(chat => chat.id === chatToClearId);
    if (currentChat) {
        currentChat.messages = currentChat.messages.filter(msg => msg.sender === "bot" && msg.content.includes("Hey there 窓"));
    }
    clearChatMessages();
    createWelcomeMessage();
    saveChatHistory();
    renderChatHistory();
});

document.querySelector("#new-chat").addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
    startNewChat();
});

deleteAllHistoryButton.addEventListener("click", deleteAllHistory);

const setupVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
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
        let interimTranscript = '',
            finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) finalTranscript += transcript;
            else interimTranscript += transcript;
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
        if (messageInput.value.trim() !== "" || pendingPdfFile || userData.file.data) {
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