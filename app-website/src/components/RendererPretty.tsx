import React from "react";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ComponentPropsWithoutRef, CSSProperties } from "react";
import { RendererProps } from "@/types/viewer";

type CodeComponentProps = ComponentPropsWithoutRef<'code'> & ExtraProps & { inline?: boolean };
type PreComponentProps = ComponentPropsWithoutRef<'pre'> & ExtraProps;

const RendererPretty: React.FC<RendererProps> = ({ response }) => {
  return (
    <ReactMarkdown
      components={{
        pre: ({ children }: PreComponentProps) => <div>{children}</div>,
        code: ({ inline, className, children, ...props }: CodeComponentProps) => {
          const match = /language-(\w+)/.exec(className || "");
          return !inline ? (
            <SyntaxHighlighter
              {...props}
              style={oneDark as { [key: string]: CSSProperties }}
              language={match?.[1] || "text"}
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
  );
};

export default RendererPretty;
