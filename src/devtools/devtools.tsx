import React, { useState } from 'react';
import RequestList from '../components/request-list';
import RequestDetail from '../components/request-detail';
import { RequestData } from '../models/requests';

const Devtools: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(true);


  const toggleRequestCapture = ()=> {
    //TODO: communicate with background script to disable/enable capture
    setIsCapturing(!isCapturing)
  }


  const handleClearRequests = () => {
    //TODO: clear all stored requests
    console.log('Clear requests - to be implemented');
  };


  return (
    <div className="h-screen flex flex-col">
    <header className="bg-gray-100 p-4 border-b flex justify-between items-center">
      <h1 className="text-lg font-bold">Request Replay</h1>
      
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isCapturing}
            onChange={toggleRequestCapture}
            className="form-checkbox h-5 w-5 text-blue-500"
          />
          <span>Capture Requests</span>
        </label>
        
        <button 
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={handleClearRequests}
        >
          Clear All
        </button>
      </div>
    </header>
    
    <main className="flex-1 flex overflow-hidden">
      <div className="w-1/3 border-r">
        <RequestList onRequestSelected={setSelectedRequest} />
      </div>
      
      <div className="w-2/3">
        <RequestDetail request={selectedRequest} />
      </div>
    </main>
  </div>
  )
}

export default Devtools
