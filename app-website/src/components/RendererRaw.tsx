import { RendererProps } from "@/types/viewer";
import React from "react";


const RendererRaw: React.FC<RendererProps> = ({ response }) => {
  return (
    <pre className="text-sm text-[#c9d1d9] whitespace-pre-wrap bg-[#1e252d] p-3 rounded overflow-x-auto">
      {response}
    </pre>
  );
};

export default RendererRaw;
