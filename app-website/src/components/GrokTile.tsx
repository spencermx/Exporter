import React from 'react';

interface GrokTileProps {
  id: string;
  title: string;
  description: string;
  onClick: () => void;
}

const GrokTile: React.FC<GrokTileProps> = ({ title, description, onClick }) => {
  
  let x = 10;
  console.log(x);

  return (
    <div
      onClick={onClick}
      className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:bg-[#30363d] hover:border-[#58a6ff] transition duration-300 ease-in-out hover:translate-y-[-2px] shadow-md"
    >
      <h2 className="text-lg font-semibold text-[#ffffff]">{title}</h2>
      <p className="text-sm text-[#8b949e]">{description}</p>
    </div>
  );
};

export default GrokTile;
