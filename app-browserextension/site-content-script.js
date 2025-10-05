// site-content-script.js

window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data || event.data.type !== 'getChatData') {
    return;
  }

  chrome.storage.local.get(null, (items) => {
    const chatEntries = [];
    for (const key in items) {
      if (key.startsWith('chat_')) {
        try {
          const value = JSON.parse(items[key]);  // Parse the JSON-stringified array
          if (Array.isArray(value) && value.length >= 1) {
            const id = key.split('_')[1];
            const title = value[0];
            const description = value.slice(1).join('\n');
            chatEntries.push({ id, title, description });
          }
        } catch (error) {
          console.error(`Error parsing stored item ${key}:`, error);
        }
      }
    }
    window.postMessage({ type: 'chatDataResponse', data: chatEntries }, '*');
  });
});
