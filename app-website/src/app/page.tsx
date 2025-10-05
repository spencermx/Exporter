// src/app/page.tsx
'use client'; // Enable client-side rendering for state management
import React, { useState, useEffect } from 'react';
import GrokTile from '../components/GrokTile';
import GrokTileViewer from '../components/GrokTileViewer';

interface ChatData {
  id: string;
  title: string;
  description: string;
}

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
    setSelectedTile(null); // Return to grid after delete
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-8 flex flex-col items-center">
      {selectedTile ? (
        <GrokTileViewer
          title={selectedTile.title}
          description={selectedTile.description}
          onClose={() => setSelectedTile(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile) => (
            <GrokTile
              key={tile.id}
              {...tile}
              onClick={() => setSelectedTile(tile)}
            />
          ))}
        </div>
      )}
      <footer className="mt-auto text-center text-sm text-[#8b949e] py-4">
        View and manage your exports.
      </footer>
    </main>
  );
}
