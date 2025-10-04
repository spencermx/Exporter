// content-script.js

// Async function to inject the export button on individual chat pages
async function injectExportButton() {
  if (!location.href.match(/\/c\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)) return; // Match URLs like /c/<guid>
  
  let targetDiv = document.querySelector("div.ml-auto.flex.flex-row.items-end.gap-1");

  if (!targetDiv) {
    // Wait for the target div to appear if not present
    await new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        targetDiv = document.querySelector("div.ml-auto.flex.flex-row.items-end.gap-1");
        if (targetDiv) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      // No timeout; observer will disconnect once the element appears
    });
  }
  
  if (targetDiv.querySelector("[data-export-btn]")) return; // Avoid duplicates
  
  const exportBtn = document.createElement("button");
  exportBtn.setAttribute("data-export-btn", "true");
  exportBtn.textContent = "Export";
  exportBtn.className =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 [&_svg]:shrink-0 select-none hover:bg-blue-600 bg-blue-500 text-white border border-blue-700 h-10 py-1.5 text-sm rounded-full px-3.5 focus:outline-none";
  exportBtn.type = "button";
  exportBtn.style.marginLeft = "4px"; // Small gap to fit with existing buttons
  exportBtn.onclick = async () => {
    try {
      showToast("Exporting...", "info");
      
      // Retrieve the current tab's title
      const documentTitle = document.title;
      let chatTitle = documentTitle.replace(" - Grok", "");

      const collectedData = await collectChatData(chatTitle);
      if (collectedData.length > 1) {
        const chatId = location.pathname.split("/").pop();
        chrome.storage.local.set(
          { [`chat_${chatId}`]: JSON.stringify(collectedData) },
          () => {
            showToast("Chat exported successfully!", "success");
          },
        );
      } else {
        throw new Error("No data collected");
      }
    } catch (error) {
      console.error("Export error:", error);
      showToast("Error exporting chat. Try Refreshing the tab.", "error");
    }
  };
  targetDiv.appendChild(exportBtn); // Append at the end of the flex row
}

// Async function to collect data by simulating copy button clicks
async function collectChatData(chatTitle) {
  const collectedData = [chatTitle];
  let matchingDivs = document.querySelectorAll('div[id^="response-"]');
  // Wait for elements if not present (dynamic loading)
  if (matchingDivs.length === 0) {
    await new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        matchingDivs = document.querySelectorAll('div[id^="response-"]');
        if (matchingDivs.length > 0) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      // Removed timeout to avoid time-based dependency
    });
  }
  for (let divIndex = 0; divIndex < matchingDivs.length; divIndex++) {
    const div = matchingDivs[divIndex];
    const copyButtonsInDiv = div.querySelectorAll('button[aria-label="Copy"]');
    if (copyButtonsInDiv.length > 0) {
      const lastCopyButton = copyButtonsInDiv[copyButtonsInDiv.length - 1];
      lastCopyButton.click(); // Simulate click - user activation should allow writeText
      await new Promise((resolve) => setTimeout(resolve, 500)); // Short delay for clipboard update (retained as necessary for clipboard API)
      try {
        const clipboardText = await navigator.clipboard.readText();
        collectedData.push(clipboardText);
      } catch (error) {
        console.error(`Clipboard read error in div ${divIndex + 1}:`, error);
      }
    }
  }
  return collectedData;
}

let intervalId = null;
let lastUrl = location.href;

function startPolling() {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        injectExportButton(); // Re-inject on actual URL change
      }
    }, 300);
  }
}

function stopPolling() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// Initial check
if (document.visibilityState === 'visible') {
  startPolling();
}

// Listen for visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    startPolling();
  } else {
    stopPolling();
  }
});

function showToast(message, type = "info", duration = 3000) {
  const toast = document.createElement("div");
  toast.textContent = message;

  const colors = {
    success: "#4CAF50", // Green
    error: "#F44336",   // Red
    info: "#323232",    // Dark gray
  };

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: colors[type] || colors.info,
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    zIndex: 9999,
    fontSize: "14px",
    opacity: "0",
    transition: "opacity 0.3s ease",
  });

  document.body.appendChild(toast);

  // Fade in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
  });

  // Remove after duration
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, duration);
}

// Initial injection
injectExportButton();
