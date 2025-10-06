import { ChatData } from "@/types/chatData";
import React, { useState } from "react";
import { FaTrash, FaCopy, FaCheck } from "react-icons/fa"; // Added FaCheck for the checkmark icon

interface GrokTileProps {
  chatData: ChatData;
  onClick: () => void;
  onDelete: () => void; // Optional prop for handling deletion
}

const GrokTile: React.FC<GrokTileProps> = (props) => {
  // State to toggle between copy and checkmark icons
  const [isCopied, setIsCopied] = useState(false);

  // Function to handle copying text to clipboard
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    try {
      await navigator.clipboard.writeText(props.chatData.responses[0]);
      setIsCopied(true); // Show checkmark
      setTimeout(() => setIsCopied(false), 500); // Revert to copy icon after 1 second
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text.");
    }
  };

  return (
    <div
      onClick={props.onClick}
      className="relative bg-[#161b22] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:bg-[#30363d] hover:border-[#58a6ff] transition duration-300 ease-in-out hover:translate-y-[-2px] shadow-md h-50 overflow-hidden"
    >
      {/* Delete Icon/Button */}
      {props.onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            props.onDelete();
          }}
          className="absolute bottom-2 right-2 text-[#8b949e] hover:text-[#ff7b72] transition duration-200"
          aria-label="Delete chat"
        >
          <FaTrash size={20} />
        </button>
      )}
      {/* Copy Icon/Button */}
      <button
        onClick={handleCopy}
        className="absolute bottom-2 right-12 text-[#8b949e] hover:text-[#58a6ff] transition duration-200"
        aria-label={isCopied ? "Text copied" : "Copy response text"}
      >
        {isCopied ? <FaCheck size={20} /> : <FaCopy size={20} />}
      </button>
      <h2 className="text-lg font-semibold text-[#ffffff]">
        {props.chatData.title}
      </h2>
      <p className="text-sm text-[#8b949e] whitespace-pre-wrap max-h-24 overflow-hidden text-ellipsis">
        {props.chatData.responses[0]}
      </p>
    </div>
  );
};

export default GrokTile;
