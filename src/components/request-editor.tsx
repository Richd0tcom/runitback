import React, { useState, useEffect } from 'react';
import { ReqResHeaders, RequestData } from '../models/requests';

interface ReqEditorProps {
  request: RequestData
  onSave: (editedRequest: RequestData) => void;
  onCancel: () => void;
}

const RequestEditor: React.FC<ReqEditorProps> = ({ request, onSave, onCancel }) => {

  const [editedRequest, setEditedRequest] = useState<RequestData>({ ...request });
  const [editingHeaders, setEditingHeaders] = useState<Array<{ key: string, value: string }>>([]);
  const [bodyFormat, setBodyFormat] = useState<'raw' | 'json'>('raw');



  useEffect(() => {
    const headers = Object.entries(request.headers).map(([key, value]) => ({ key, value }))
    setEditingHeaders(headers)

    if (request.body) {
      try {
        JSON.parse(request.body)
        setBodyFormat("json")
      } catch {
        setBodyFormat("raw")
      }
    }
  }, [request])

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedRequest({ ...editedRequest, method: e.target.value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedRequest({ ...editedRequest, url: e.target.value });
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedRequest({ ...editedRequest, body: e.target.value });
  };


  const handleHeaderKeyChange = (index: number, value: string) => {
    const updatedHeaders = [...editingHeaders];
    updatedHeaders[index].key = value;
    setEditingHeaders(updatedHeaders);
  };

  const handleHeaderValueChange = (index: number, value: string) => {
    const updatedHeaders = [...editingHeaders]
    updatedHeaders[index].value = value
    setEditingHeaders(updatedHeaders)
  }


  const addHeader = () => {
    setEditingHeaders([...editingHeaders, {key: "", value: ""}])
  }

  const removeHeader = (index: number) => {
    const updatedHeaders = [...editingHeaders];
    updatedHeaders.splice(index, 1);
    setEditingHeaders(updatedHeaders);
  };

  const handleFormatBody = ()=> {
    if (!editedRequest.body) return;

    if (bodyFormat === 'json') {
      try {
        const parsed = JSON.parse(editedRequest.body);
        setEditedRequest({
          ...editedRequest,
          body: JSON.stringify(parsed, null, 2)
        });
      } catch (e) {
        console.log("Invalid JSON body", e)
        alert('Invalid JSON body');
      }
    }
  }


  const handleSave = ()=> {
    const requestHeaderObj: ReqResHeaders = {}

    editingHeaders.forEach(({key, value})=> {
      if (key.trim()){
        requestHeaderObj[key] = value
      }

      const finalReq: RequestData = {
        ...editedRequest,
        headers: requestHeaderObj
      }

      onSave(finalReq)
      
    })


  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-gray-100 border-b">
        <h2 className="text-lg font-bold">Edit Request</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Method</label>
          <select
            className="w-full p-2 border rounded"
            value={editedRequest.method}
            onChange={handleMethodChange}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">URL</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={editedRequest.url}
            onChange={handleUrlChange}
          />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold mb-2">Headers</label>
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={addHeader}
            >
              + Add Header
            </button>
          </div>
          
          {editingHeaders.map((header, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                className="w-1/3 p-2 border rounded-l"
                placeholder="Header name"
                value={header.key}
                onChange={(e) => handleHeaderKeyChange(index, e.target.value)}
              />
              <input
                type="text"
                className="w-2/3 p-2 border border-l-0 rounded-r"
                placeholder="Value"
                value={header.value}
                onChange={(e) => handleHeaderValueChange(index, e.target.value)}
              />
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeHeader(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold mb-2">Body</label>
            <div>
              <select
                className="mr-2 p-1 border rounded"
                value={bodyFormat}
                onChange={(e) => setBodyFormat(e.target.value as 'raw' | 'json')}
              >
                <option value="raw">Raw</option>
                <option value="json">JSON</option>
              </select>
              
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={handleFormatBody}
              >
                Format
              </button>
            </div>
          </div>
          
          <textarea
            className="w-full h-64 p-2 border rounded font-mono"
            value={editedRequest.body || ''}
            onChange={handleBodyChange}
          />
        </div>
      </div>
      
      <div className="p-4 border-t bg-gray-100 flex justify-end">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2 hover:bg-gray-400"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default RequestEditor