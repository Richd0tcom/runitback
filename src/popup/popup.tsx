import React, { useState, useEffect } from 'react'
import { messageService, MessageType } from '../services/messaging'

const Popup: React.FC = () => {
    const [isCaptureEnabled, setIsCaptureEnabled] = useState<boolean>(true);

    useEffect(() => {
        // Check initial capture state
        messageService.sendToBackground({
            type: MessageType.TOGGLE_CAPTURE,
            payload: { enabled: isCaptureEnabled }
        });
    }, []);

    const handleOpenDevTools = () => {
        chrome.tabs.create({
            // url: 'devtools://devtools/bundled/devtools_app.html'
            url: 'devtools://devtools/bundled/devtools_app.html'
        });
    };

    const toggleCapture = () => {
        const newState = !isCaptureEnabled;
        setIsCaptureEnabled(newState);
        
        messageService.sendToBackground({
            type: MessageType.TOGGLE_CAPTURE,
            payload: { enabled: newState }
        });
    };

    return (
        <div className="w-80 p-4">
            <h1 className="text-lg font-bold mb-2">Request Replay</h1>
            <p className="text-sm text-gray-600 mb-4">Capture and replay network requests</p>
            
            <div className="flex flex-col gap-4">
                <button 
                    onClick={handleOpenDevTools}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Open DevTools Panel
                </button>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isCaptureEnabled}
                            onChange={toggleCapture}
                            className="form-checkbox h-4 w-4 text-blue-500"
                        />
                        <span className="text-sm font-medium">Enable Capture</span>
                    </label>
                    <span className={`text-xs px-2 py-1 rounded ${isCaptureEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {isCaptureEnabled ? 'Active' : 'Paused'}
                    </span>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                    <p>• Click "Open DevTools Panel" to view captured requests</p>
                    <p>• Toggle capture to pause/resume request recording</p>
                    <p>• Select requests to view details and replay</p>
                </div>
            </div>
        </div>
    );
}

export default Popup
