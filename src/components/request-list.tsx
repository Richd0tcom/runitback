import React, { useEffect, useState } from 'react';
import { RequestData } from '../models/requests';
import storage from '../services/storage';



//useEffect
// Load requests when component mounts
// Set up a timer to refresh the list periodically

//load request
//get req from store
// Sort by timestamp, newest first
//display (set) req


//handle req click


//filter by method and url

interface RequestListProps {
    onRequestSelected: (request: RequestData) => void;
}


const RequestList: React.FC<RequestListProps> = ({onRequestSelected}) => {
    const [requests, setRequests] = useState<RequestData[]>([]);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('');


    const loadRequests = async () => {
        try {
            const allRequests = await storage.getRequests()
            allRequests.sort((a, b)=> a.timestamp - b.timestamp)

            setRequests(allRequests)
        } catch (error) {
            console.error('failed to load requests', error)
        }
    } 


    useEffect(()=> {
        loadRequests();

        const intervalId = setInterval(loadRequests, 5000);

        return clearInterval(intervalId)
    },[])

    const handleRequestClick = (request: RequestData) => {
        setSelectedRequestId(request.id!);

        onRequestSelected(request)
    }

    //change to use GetRequest Filter
    const filteredRequests = requests.filter(req => 
        req.url.toLowerCase().includes(filter.toLowerCase()) ||
        req.method.toLowerCase().includes(filter.toLowerCase())
    );


    return (
        <div className="flex flex-col h-full">
          <div className="p-2">
            <input
              type="text"
              placeholder="Filter requests..."
              className="w-full p-2 border rounded"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Method</th>
                  <th className="p-2 text-left">URL</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => (
                  <tr
                    key={request.id}
                    className={`hover:bg-gray-100 cursor-pointer ${
                      selectedRequestId === request.id ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleRequestClick(request)}
                  >
                    <td className="p-2 border-t">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        request.method === 'GET' ? 'bg-green-100 text-green-800' :
                        request.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        request.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                        request.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.method}
                      </span>
                    </td>
                    <td className="p-2 border-t truncate max-w-xs">
                      {new URL(request.url).pathname}
                    </td>
                    <td className="p-2 border-t">
                      {/* Status will be filled in later */}
                      -
                    </td>
                    <td className="p-2 border-t text-sm text-gray-500">
                      {new Date(request.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
}

export default RequestList

