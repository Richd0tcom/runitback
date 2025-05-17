import React from 'react';

const GettingStarted: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Getting Started</h2>
      
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          Click the "Open DevTools Panel" button to open the full interface.
        </li>
        <li>
          Make sure "Capture Requests" is enabled to start recording XHR/fetch requests.
        </li>
        <li>
          Navigate to websites or use web applications to capture their network requests.
        </li>
        <li>
          In the DevTools panel, you'll see captured requests in the left sidebar.
        </li>
        <li>
          Click on a request to view its details. From there, you can:
          <ul className="list-disc pl-5 mt-1">
            <li>View request/response details</li>
            <li>Edit the request parameters</li>
            <li>Replay the request with or without modifications</li>
          </ul>
        </li>
      </ol>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>This extension works best with JSON API requests and RESTful web services.</p>
      </div>
    </div>
  );
};

export default GettingStarted;