// Function to inject the external script
function injectExternalScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected-script.js');
  script.onload = () => script.remove(); // Clean up after loading
  (document.head || document.documentElement).appendChild(script);
}

injectExternalScript(); // Execute injection early

// The rest of your existing code (event listeners, handleGetChatData, etc.) remains unchanged
// Main event listener for messages
window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data || !event.data.type) {
    return;
  }

  switch (event.data.type) {
    case 'getChatData':
      handleGetChatData();
      break;
    case 'deleteChat':
      handleDeleteChat(event.data);
      break;
    default:
      console.warn(`Unhandled message type: ${event.data.type}`);
  }
});

// Function to handle 'getChatData' messages
function handleGetChatData() {
  chrome.storage.local.get(null, (items) => {
    const chatEntries = [];
    for (const key in items) {
      if (key.startsWith('chat_')) {
        try {
          const value = JSON.parse(items[key]); // Parse the JSON-stringified array
          if (Array.isArray(value) && value.length >= 1) {
            const id = key.split('_')[1];
            const title = value[0];
            const responses = value.slice(1);
            chatEntries.push({ id, title, responses });
          }
        } catch (error) {
          console.error(`Error parsing stored item ${key}:`, error);
        }
      }
    }
    window.postMessage({ type: 'chatDataResponse', data: chatEntries }, '*');
  });
}

// Function to handle 'deleteChat' messages
function handleDeleteChat(data) {
  const id = data.data.id;
  if (!id) {
    window.postMessage({ type: 'deleteChatResponse', success: false, error: 'No ID provided' }, '*');
    return;
  }
  const key = `chat_${id}`;
  chrome.storage.local.remove(key, () => {
    if (chrome.runtime.lastError) {
      console.error(`Error deleting ${key}:`, chrome.runtime.lastError);
      window.postMessage({ type: 'deleteChatResponse', success: false, error: chrome.runtime.lastError.message }, '*');
    } else {
      window.postMessage({ type: 'deleteChatResponse', success: true, id }, '*');
    }
  });
}
