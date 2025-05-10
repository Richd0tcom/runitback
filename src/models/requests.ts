export interface ReqResHeaders {
    [key: string]: string
}

export interface RequestData {
    id?: string;
    url: string;
    method: string;
    headers: ReqResHeaders
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
    headers: ReqResHeaders;
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

export interface GetRequestFilter {
    url?: string;
    method?: string;
    collectionId?: string;
    timeStart?: number;
    timeEnd?: number;
}