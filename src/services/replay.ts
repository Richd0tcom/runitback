import { ReqResHeaders, RequestData, ResponseData } from "../models/requests";

class Replay {
    private prepareHeaders(headers: Record<string, string>): Headers {
        const result = new Headers();

        for (const [key, value] of Object.entries(headers)) {
            // Skip certain headers that cannot be set by JavaScript
            const forbiddenHeaders = [
                'host', 'connection', 'content-length', 'origin',
                'referer', 'user-agent', 'sec-fetch-mode'
            ];

            if (!forbiddenHeaders.includes(key.toLowerCase())) {
                result.append(key, value);
            }
        }

        return result;
    }

    private extractResponseHeaders(response: Response): ReqResHeaders {
        const headers: ReqResHeaders = {}
        for (const [key, value] of response.headers) {
            headers[key] = value
        }

        return headers
    } 

    async replayRequest(request: RequestData): Promise<ResponseData> {
        const startTime = Date.now();


        try {
            const options: RequestInit = {
                method: request.method,
                headers: this.prepareHeaders(request.headers), //TODO
                body: request.body ? request.body : undefined,
                mode: "cors",
                credentials: "include"

            }

            const response = await fetch(request.url, options)

            const responseData: ResponseData = {
                requestID: request.id || '',
                status: response.status,
                statusText: response.statusText,
                headers: this.extractResponseHeaders(response), 
                timestamp: Date.now(),
                duration: Date.now() - startTime,
            }

            try {
                const contentType = response.headers.get("content-type")
                if (contentType && contentType.includes("application/json")) {
                    const json = await response.json();
                    responseData.body = JSON.stringify(json);
                } else {
                    const text = await response.text()
                    responseData.body = text
                }

            } catch (error) {
                console.error('Failed to parse response body:', error);
                responseData.body = 'Failed to parse response body';
            }

            return responseData
        } catch (error) {
            return {
                requestID: request.id || '',
                status: 0,
                statusText: "Network Error",
                headers: {}, 
                timestamp: Date.now(),
                duration: Date.now() - startTime,
                body: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }
}

export const replayService = new Replay();