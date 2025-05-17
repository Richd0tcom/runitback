/* eslint-disable @typescript-eslint/no-explicit-any */
export enum MessageType {
    TOGGLE_CAPTURE = 1,
    CLEAR_REQUESTS ,
    REQUEST_CAPTURED ,
    REQUEST_REPLAYED 
}

export interface Message {
    type: MessageType;
    payload?: any
}

export class MessageService {
    sendToBackground(message: Message): Promise<any>{
        return chrome.runtime.sendMessage(message)
    }


    sendToContentScript(message: Message) {
        chrome.tabs.query({}, (tabs)=>{
            tabs.forEach((t)=>{
                if (t.id) {
                    chrome.tabs.sendMessage(t.id, message)
                }
            })
        })
    }

    // Listen for messages
    addListener(callback: (message: Message, sender: chrome.runtime.MessageSender)=> void): void {
        return chrome.runtime.onMessage.addListener((message, sender, sendResponse)=> {
            callback(message, sender)

            return true
        })
    }
}

export const messageService = new MessageService();
