import { ChatData } from "@/types/chatData";
import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa"; // FaCopy and FaCheck for copy functionality
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Dark theme for syntax highlighting
import { CSSProperties } from "react"; // Import CSSProperties for type casting

// Define CodeComponentProps locally to avoid import issues
interface CodeComponentProps {
  node?: any; // Optional, as it's not used in the component
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any; // For additional props
}

interface GrokTileViewerProps {
  chatData: ChatData;
}

const GrokTileViewer: React.FC<GrokTileViewerProps> = (props) => {
  // State to track which response was copied (index-based, null for none, -1 for all)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Function to handle copying individual response to clipboard
  const handleCopy = async (response: string, index: number) => {
    try {
      // Remove markdown code block delimiters for clean copying
      const cleanText = response.replace(/```[a-z]*\n|\n```/g, "").trim();
      await navigator.clipboard.writeText(cleanText);
      setCopiedIndex(index); // Show checkmark for this response
      setTimeout(() => setCopiedIndex(null), 1000); // Revert to copy icon after 1 second
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text.");
    }
  };

  // Function to handle copying all responses to clipboard
  const handleCopyAll = async () => {
    try {
      const allResponses = props.chatData.responses
        .map((response) => response.replace(/```[a-z]*\n|\n```/g, "").trim())
        .join("\n\n"); // Join responses with double newline
      await navigator.clipboard.writeText(allResponses);
      setCopiedIndex(-1); // Show checkmark for Copy All button
      setTimeout(() => setCopiedIndex(null), 1000); // Revert to copy icon after 1 second
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
          {/* Copy All Button with right margin */}
          <button
            onClick={handleCopyAll}
            className="mr-4 text-[#8b949e] hover:text-[#58a6ff] transition duration-200 flex items-center gap-2"
            aria-label={copiedIndex === -1 ? "All responses copied" : "Copy all responses"}
          >
            {copiedIndex === -1 ? <FaCheck size={16} /> : <FaCopy size={16} />}
            <span className="text-sm">Copy All</span>
          </button>
        </div>
        {props.chatData.responses.map((response, index) => {
          const isUser = index % 2 === 0;
          return (
            <div
              key={index}
              className={`relative mb-3 p-3 rounded transition duration-200 hover:border-[#58a6ff] border border-transparent ${
                isUser ? "bg-[#2a323a]/80" : "bg-[#3a4047]/80"
              }`}
            >
              <div className="pr-10">
                <ReactMarkdown
                  components={{
                    code: ({ node, inline, className, children, ...props }: CodeComponentProps) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline ? (
                        <SyntaxHighlighter
                          {...props}
                          style={oneDark as { [key: string]: CSSProperties }}
                          language={match?.[1] || "text"}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            padding: "0.75rem",
                            borderRadius: "0.25rem",
                            backgroundColor: "#1e252d",
                          }}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="text-[#c9d1d9] bg-[#1e252d] px-1 rounded" {...props}>
                          {children}
                        </code>
                      );
                    },
                    p: ({ children }) => (
                      <p className="text-sm text-[#c9d1d9] leading-relaxed whitespace-pre-wrap mb-2">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {response}
                </ReactMarkdown>
              </div>
              {/* Individual Copy Button */}
              <button
                onClick={() => handleCopy(response, index)}
                className="absolute bottom-2 right-2 text-[#8b949e] hover:text-[#58a6ff] transition duration-200"
                aria-label={copiedIndex === index ? "Text copied" : "Copy response text"}
              >
                {copiedIndex === index ? <FaCheck size={16} /> : <FaCopy size={16} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GrokTileViewer;
