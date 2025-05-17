import storageService from "../services/storage";
import { RequestData,ReqResHeaders, ResponseData } from "../models/requests";
import { messageService, MessageType } from "../services/messaging";

let isCapturing = true;

const inFlightReqStore = new Map<string, { startTime: number, data: RequestData }>()

storageService.initDB().then(() => {
    console.log("DB initialised successfully")
}).catch(e => console.error("Failed to init DB: ", e))

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("devtools/index.html")
    })
})

// Add message listener to the background script
messageService.addListener((message, _sender) => {
  switch (message.type) {
    case MessageType.TOGGLE_CAPTURE:
      isCapturing = message.payload.enabled;
      console.log(`Request capture ${isCapturing ? 'enabled' : 'disabled'}`);
      break;
      
    case MessageType.CLEAR_REQUESTS:
      storageService.clearAllData()
        .then(() => {
          console.log('All request data cleared');
        })
        .catch(error => {
          console.error('Failed to clear request data:', error);
        });
      break;
  }
});

function shouldCaptureReq(details: chrome.webRequest.WebRequestBodyDetails): boolean {

    if (!isCapturing) return false;


    if (details.url.startsWith("chrome-extension://")) {
        return false
    };

    //since we cant definitively differentiate between XHR or fetch, we accept both
    return details.type === "xmlhttprequest" || details.initiator?.indexOf('http') === 0
}

function getRequestBody(request: chrome.webRequest.WebRequestBodyDetails): string | null {
    if (!request.requestBody) {
        return null
    }

    if (request.requestBody.raw) {
        try {
            const decoder = new TextDecoder('utf-8');
            const rawBytes = request.requestBody.raw[0]
            return decoder.decode(rawBytes.bytes)
        } catch (e) {
            console.error("Failed to decode request body: ", e)
        }
    } else if (request.requestBody.formData) {
        return JSON.stringify(request.requestBody.formData);
    }

    return null
}

chrome.webRequest.onBeforeRequest.addListener((details) => {

    if (shouldCaptureReq(details)) {
        const requestID = details.requestId
        const requestData: RequestData = {
            url: details.url,
            method: details.method,
            body: getRequestBody(details),
            timestamp: Date.now(),
            headers: {},
            sourceTab: details.tabId.toString()
        }

        inFlightReqStore.set(requestID, {
            startTime: Date.now(),
            data: requestData
        })
    }

    //prevent the request from blocking (not being sent)
    return { cancel: false };
}, { urls: ["<all_urls>"] }, ["requestBody"])

chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    const reqID = details.requestId
    const inFlightRequest = inFlightReqStore.get(reqID)

    if (inFlightRequest) {
        details.requestHeaders?.forEach((header) => {
            inFlightRequest.data.headers[header.name] = header.value || ""
        })

        const contentType = details.requestHeaders?.find((head) => {
            return head.name.toLowerCase() == "content-type"
        })

        if (contentType && contentType.value) {
            inFlightRequest.data.contentType = contentType.value
        }
    }

    return { requestHeaders: details.requestHeaders }


}, { urls: ["<all_urls>"] }, ["blocking", "requestHeaders"])

chrome.webRequest.onHeadersReceived.addListener((details) => {
    const reqID = details.requestId
    const inFlightRequest = inFlightReqStore.get(reqID)

    if (inFlightRequest) {
        const responseHeaders: ReqResHeaders = {};
        details.responseHeaders?.forEach((h) => {
            responseHeaders[h.name] = h.value || ""
        })

        const responseData: ResponseData = {
            headers: responseHeaders,
            requestID: reqID,

            status: details.statusCode,
            statusText: details.statusLine,

            timestamp: Date.now(),
            duration: Date.now() - inFlightRequest.startTime
        }

        storageService.saveRequest(inFlightRequest.data)
        .then(()=>{
            storageService.saveResponse(responseData)
        })
        .catch(e => {
            console.error("failed to save request/response", e)
        })
    }

}, { urls: ["<all_urls>"] }, ["responseHeaders"])

// chrome.webRequest.onCompleted.addListener((details)=> {
//     details
// }, { urls: [""]},[])

// Clean up completed requests periodically
setInterval(() => {
    const now = Date.now();
    inFlightReqStore.forEach((value, key) => {
      // Remove requests older than 5 minutes
      if (now - value.startTime > 5 * 60 * 1000) {
        inFlightReqStore.delete(key);
      }
    });
  }, 60000);
