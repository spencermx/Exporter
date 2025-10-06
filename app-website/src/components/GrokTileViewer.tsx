import { ChatData } from "@/types/chatData";
import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import RendererPretty from "./RendererPretty";
import RendererRaw from "./RendererRaw";
import RendererJson from "./RendererJson";

type ViewMode = "pretty" | "raw" | "json";

// Function to process response for artifacts
const processResponse = (text: string): string => {
  return text.replace(
    /<xaiArtifact[^>]*title="([^"]*)"[^>]*contentType="text\/([^"]*)"[^>]*>([\s\S]*?)<\/xaiArtifact>/g,
    (match, title: string, lang: string, code: string) => {
      return `### ${title}\n\n\`\`\`${lang}\n${code.trim()}\n\`\`\``;
    },
  );
};

interface GrokTileViewerProps {
  chatData: ChatData;
  defaultViewMode: ViewMode;
}

const GrokTileViewer: React.FC<GrokTileViewerProps> = (props) => {
  // State to track which response was copied (index-based, null for none, -1 for all)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(props.defaultViewMode);

  const renderByMode = (response: string, index: number) => {
    const processed = processResponse(response);
    switch (viewMode) {
      case "raw":
        return <RendererRaw response={response} index={index} />;
      case "pretty":
      default:
        return <RendererPretty response={processed} index={index} />;
    }
  };
  // Function to handle copying individual response to clipboard
  const handleCopy = async (response: string, index: number) => {
    try {
      const processed = processResponse(response);
      // Remove markdown code block delimiters for clean copying
      const cleanText = processed.replace(/```[a-z]*\n|\n```/g, "").trim();
      await navigator.clipboard.writeText(cleanText);
      setCopiedIndex(index); // Show checkmark for this response
      setTimeout(() => setCopiedIndex(null), 1000); // Revert to copy icon after 1 second
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text.");
    }
  };

  const handleCopyAll = async () => {
    try {
      let textToCopy: string;

      if (viewMode === "json") {
        // Copy full chatData as pretty JSON
        textToCopy = JSON.stringify(props.chatData, null, 2);
      } else {
        // Copy all responses (processed for artifacts) as plain text
        const allProcessed = props.chatData.responses.map(processResponse);
        textToCopy = allProcessed
          .map((processed) =>
            processed.replace(/```[a-z]*\n|\n```/g, "").trim(),
          )
          .join("\n\n");
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopiedIndex(-1); // Indicate all copied
      setTimeout(() => setCopiedIndex(null), 1000);
    } catch (err) {
      console.error("Failed to copy all responses: ", err);
      alert("Failed to copy all responses.");
    }
  };

  return (
    <div
      className="bg-[#1e252d] border border-[#3a4047] rounded-lg p-4 mx-auto overflow-hidden"
      style={{ width: "55vw", height: "75vh", boxSizing: "border-box" }}
    >
      <div
        className="overflow-y-auto h-full"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#4a5568 #1e252d" }}
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-semibold text-[#e0e0e0]">
            {props.chatData.title}
          </h1>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex gap-1 text-sm text-[#8b949e]">
              {(["pretty", "raw", "json"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-2 py-0.5 rounded ${
                    viewMode === mode
                      ? "bg-[#2a323a] text-white"
                      : "hover:text-white"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyAll}
              className="text-[#8b949e] hover:text-[#58a6ff] transition duration-200 flex items-center gap-2"
              aria-label={
                copiedIndex === -1
                  ? "All responses copied"
                  : "Copy all responses"
              }
            >
              {copiedIndex === -1 ? (
                <FaCheck size={16} />
              ) : (
                <FaCopy size={16} />
              )}
              <span className="text-sm">Copy All</span>
            </button>
          </div>
        </div>

        {viewMode === "json" ? (
          <RendererJson chatData={props.chatData} />
        ) : (
          props.chatData.responses.map((response, index) => {
            const isUser = index % 2 === 0;
            return (
              <div
                key={index}
                className={`relative mb-3 p-3 rounded transition duration-200 hover:border-[#58a6ff] border border-transparent ${
                  isUser ? "bg-[#2a323a]/80" : "bg-[#3a4047]/80"
                }`}
              >
                <div className="pr-10">{renderByMode(response, index)}</div>

                <button
                  onClick={() => handleCopy(response, index)}
                  className="absolute bottom-2 right-2 text-[#8b949e] hover:text-[#58a6ff] transition duration-200"
                  aria-label={
                    copiedIndex === index ? "Text copied" : "Copy response text"
                  }
                >
                  {copiedIndex === index ? (
                    <FaCheck size={16} />
                  ) : (
                    <FaCopy size={16} />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GrokTileViewer;
