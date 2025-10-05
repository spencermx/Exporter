import { ChatData } from "@/types/chatData";
import React from "react";

interface GrokTileViewerProps {
  chatData: ChatData;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const GrokTileViewer: React.FC<GrokTileViewerProps> = (props) => {
  const x = 10;
  console.log(x);
  return (
    <div
      className="bg-[#1e252d] border border-[#3a4047] rounded-lg p-4 mx-auto overflow-hidden"
      style={{ width: "55vw", height: "75vh", boxSizing: "border-box" }}
    >
      <div
        className="overflow-y-auto h-full"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#4a5568 #1e252d" }}
      >
        <h1 className="text-xl font-semibold mb-2 text-[#e0e0e0]">
          {props.chatData.title}
        </h1>
        {props.chatData.responses.map((response, index) => {
          const isUser = index % 2 === 0;
          return (
<p
  key={index}
  className={`
    text-sm text-white leading-relaxed whitespace-pre-wrap mb-3 p-3 rounded
    ${isUser ? "bg-purple-500/20" : "bg-teal-500/20"}
  `}
>
  {response}
</p>
          );
        })}
      </div>
    </div>
  );
};

export default GrokTileViewer;
