// src/app/page.tsx
'use client'; // Enable client-side rendering for state management
import React, { useState, useEffect } from 'react';
import GrokTile from '../components/GrokTile';
import GrokTileViewer from '../components/GrokTileViewer';
import { ChatData } from '@/types/chatData';

export default function Home() {
  const [tiles, setTiles] = useState<ChatData[]>([]);
  const [selectedTile, setSelectedTile] = useState<ChatData | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window) {
        return;
      }
      if (!event.data) {
        return;
      }
      if (event.data.type !== 'chatDataResponse') {
        return;
      }
      if (event.data.data) {
        setTiles(event.data.data);
      } else {
        console.warn('No data received from extension.');
      }
    };
    window.addEventListener('message', handleMessage);
    // Send the request
    window.postMessage({ type: 'getChatData' }, '*');
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleEdit = () => {
    console.log('Edit operation for tile:', selectedTile?.id);
    // Implement edit logic here
  };

  const handleDelete = () => {
    console.log('Delete operation for tile:', selectedTile?.id);
    // Implement delete logic here
    setSelectedTile(null); // Close overlay after delete
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-8 flex flex-col items-center relative">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <GrokTile
            key={tile.id}
            chatData={tile}
            onClick={() => setSelectedTile(tile)}
          />
        ))}
      </div>
      {selectedTile && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setSelectedTile(null)}
        >
          <div 
            className=""
            onClick={(e) => e.stopPropagation()}
          >
            <GrokTileViewer
              chatData={selectedTile}
              onClose={() => setSelectedTile(null)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
      <footer className="mt-auto text-center text-sm text-[#8b949e] py-4">
        View and manage your exports.
      </footer>
    </main>
  );
}
