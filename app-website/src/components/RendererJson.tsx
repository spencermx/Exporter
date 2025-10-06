// components/renderers/RendererJson.tsx
import React from "react";
import { ChatData } from "@/types/chatData";

interface RendererJsonProps {
  chatData: ChatData;
}

const RendererJson: React.FC<RendererJsonProps> = ({ chatData }) => {
  return (
    <div className="bg-[#1e252d] text-[#c9d1d9] text-sm p-4 rounded overflow-x-auto border border-[#3a4047]">
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(chatData, null, 2)}
      </pre>
    </div>
  );
};

export default RendererJson;
