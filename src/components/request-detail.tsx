import React, { useEffect, useState } from 'react';
import { RequestData, ResponseData } from '../models/requests';
import storage from '../services/storage';
import replayService from '../services/replay';
import RequestEditor from './request-editor';


interface RequestDetailProps {
  request: RequestData | null;
  onRequestModified?: (request: RequestData) => void
}

const RequestDetail: React.FC<RequestDetailProps> = ({ request, onRequestModified }) => {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');
  const [formattedBody, setFormattedBody] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const loadResponse = async (requestId: string) => {
    try {
      const res = await storage.getResponse(requestId);
      setResponse(res);
    } catch (error) {
      console.error('failed to load response', error)
    }
  }
  useEffect(() => {
    if (request?.id) {
      loadResponse(request.id);
    } else {
      setResponse(null);
    }
  }, [request]);

  const formatBody = () => {
    if (activeTab == 'request' && request?.body) {
      try {

        const parsed = JSON.parse(request.body);
        setFormattedBody(JSON.stringify(parsed, null, 2));
      } catch {

        setFormattedBody(request.body);
      }
    } else if (activeTab == 'response' && response?.body) {
      try {

        const parsed = JSON.parse(response.body);
        setFormattedBody(JSON.stringify(parsed, null, 2));
      } catch {

        setFormattedBody(response.body);
      }
    } else {
      setFormattedBody('No body content');
      console.warn('no active body')
    }
  }

  useEffect(() => {
    formatBody();
  }, [activeTab, request, response])


  if (!request) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a request to view details
      </div>
    );
  }

  const handleRequestReplay = async () => {
    if (!request) return;

    try {
      const replayedResponse = await replayService.replayRequest(request)
      setResponse(replayedResponse)
    } catch (error) {
      console.error('Failed to replay request:', error);
      alert('Failed to replay request. See console for details.');
    }
  }

  const handleEditRequest = () => {
    setIsEditing(true)
  }

  const handleEditSave = (modifiedRequest: RequestData) => {
    setIsEditing(false)

    /**
     * TODO: 
     * 1. update the UI with the edited request
     * 2. save this to a "modified requests" collection
     * 
     */

    onRequestModified?.(modifiedRequest)

  }

  if (isEditing && request) {
    return (
      <RequestEditor
        request={request}
        onSave={handleEditSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-gray-100 border-b">
        <h2 className="font-bold">{request.method} {new URL(request.url).pathname}</h2>
        <div className="text-sm text-gray-600">{request.url}</div>
      </div>

      <div className="border-b">
        <div className="flex">
          <button
            className={`px-4 py-2 ${activeTab === 'request' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            Request
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'response' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('response')}
          >
            Response
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {activeTab === 'request' ? (
          <div>
            <h3 className="font-bold mb-2">Headers</h3>
            <div className="bg-gray-50 p-2 rounded mb-4">
              {Object.entries(request.headers).map(([key, value]) => (
                <div key={key} className="mb-1">
                  <span className="font-semibold">{key}:</span> {value}
                </div>
              ))}
            </div>

            <h3 className="font-bold mb-2">Body</h3>
            <pre className="bg-gray-50 p-2 rounded overflow-auto">
              {formattedBody}
            </pre>
          </div>
        ) : (<div>
          {response ? (
            <>
              <div className="mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${response.status < 300 ? 'bg-green-100 text-green-800' :
                  response.status < 400 ? 'bg-yellow-100 text-yellow-800' :
                    response.status < 500 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {response.status} {response.statusText}
                </span>
                {response.duration && (
                  <span className="ml-2 text-sm text-gray-500">
                    {response.duration}ms
                  </span>
                )}
              </div>

              <h3 className="font-bold mb-2">Headers</h3>
              <div className="bg-gray-50 p-2 rounded mb-4">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="mb-1">
                    <span className="font-semibold">{key}:</span> {value}
                  </div>
                ))}
              </div>

              <h3 className="font-bold mb-2">Body</h3>
              <pre className="bg-gray-50 p-2 rounded overflow-auto">
                {formattedBody}
              </pre>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No response data available
            </div>
          )}
        </div>
        )}
      </div>

      <div className="p-2 border-t bg-gray-50 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleRequestReplay}
        >
          Replay Request
        </button>

        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          onClick={handleEditRequest}
        >
          Edit Request
        </button>
      </div>
    </div>
  );
}

export default RequestDetail;