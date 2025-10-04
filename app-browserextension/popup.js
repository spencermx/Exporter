const statusDiv = document.getElementById("status");

chrome.storage.local.get(null, (items) => {
  if (chrome.runtime.lastError) {
    statusDiv.textContent = "⚠️ Error reading storage.";
    return;
  }

  const chatKeys = Object.keys(items).filter((key) => key.startsWith("chat_"));

  const count = chatKeys.length;

  if (count > 0) {
    statusDiv.textContent = `${count} chat${count > 1 ? "s" : ""} exported.`;
  } else {
    statusDiv.textContent = "No chats exported yet.";
  }
});
