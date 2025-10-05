import React from "react";

interface GrokTileViewerProps {
  title: string;
  description: string;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const GrokTileViewer: React.FC<GrokTileViewerProps> = ({
  title,
  description,
  onClose,
  onEdit,
  onDelete,
}) => {
  let x = 10;
  console.log(x);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 max-w-2xl mx-auto shadow-lg">
      <button
        onClick={onClose}
        className="mb-4 text-[#58a6ff] hover:underline transition duration-300 ease-in-out"
      >
        Back to Grid
      </button>
      <h1 className="text-2xl font-bold mb-2 text-[#ffffff]">{title}</h1>
      <p className="text-base mb-4 text-[#c9d1d9]">{description}</p>
      <div className="flex space-x-4">
        {onEdit && (
          <button
            onClick={onEdit}
            className="bg-[#21262d] text-[#c9d1d9] px-4 py-2 rounded border border-[#30363d] font-semibold hover:bg-[#30363d] hover:border-[#58a6ff] transition duration-300 ease-in-out hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:ring-opacity-50"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-[#21262d] text-[#c9d1d9] px-4 py-2 rounded border border-[#30363d] font-semibold hover:bg-[#30363d] hover:border-[#f85149] transition duration-300 ease-in-out hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-[#f85149] focus:ring-opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default GrokTileViewer;
