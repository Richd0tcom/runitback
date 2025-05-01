import React from 'react'

const Popup: React.FC = () => {
    return (
        <div className="w-80 p-4">
          <h1 className="text-lg font-bold mb-2">Request Replay</h1>
          <p className="text-sm mb-2">Capture and replay network requests</p>
          
          <div className="flex flex-col gap-2">
            <button className="bg-blue-500 text-white px-3 py-1 rounded">
              Open DevTools Panel
            </button>
            
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Enable Capture</span>
            </label>
          </div>
        </div>
      );
}

export default Popup
