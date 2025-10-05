import { ChatData } from "@/types/chatData";
import React from "react";

interface GrokTileProps {
  chatData: ChatData;
  onClick: () => void;
}

const GrokTile: React.FC<GrokTileProps> = (props) => {
  return (
    <div
      onClick={props.onClick}
      className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:bg-[#30363d] hover:border-[#58a6ff] transition duration-300 ease-in-out hover:translate-y-[-2px] shadow-md h-50 overflow-hidden"
    >
      <h2 className="text-lg font-semibold text-[#ffffff]">
        {props.chatData.title}
      </h2>
      <p className="text-sm text-[#8b949e] line-clamp-3">
        {props.chatData.responses[0]}
      </p>
    </div>
  );
};

export default GrokTile;
