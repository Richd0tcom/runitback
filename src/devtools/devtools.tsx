import React from 'react'

const Devtools: React.FC = () => {
    return (
        <div className="h-screen flex flex-col">
          <header className="bg-gray-100 p-4 border-b">
            <h1 className="text-lg font-bold">Request Replay</h1>
          </header>
          
          <main className="flex-1 p-4">
            <p>DevTools panel content will go here.</p>
          </main>
        </div>
      );
}

export default Devtools
