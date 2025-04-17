export interface RequestHeaders {
    [key: string]: string
}

export interface RequestData {
    id?: string;
    url: string;
    method: string;
    headers: RequestHeaders
    body?: string | null
    timestamp: number
    contentType?: string
    sourceTab?: string

    //extension specific keys
    collectionID?: string
    name?: string
    description?: string
    tags?: string[]
}

export interface ResponseData {
    requestID: string
    body?: string | null
    status: number
    statusText: string;
    headers: RequestHeaders;
    timestamp: number
    duration?: number
    size?: number
}

export interface RequestCollection {
    id: string;
    name: string;
    description?: string
    createdAt: number
    updatedAt: number
    requestCount?: number
}