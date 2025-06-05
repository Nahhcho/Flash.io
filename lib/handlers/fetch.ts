import { ActionResponse } from "@/types/global";
import handlerError from "./error";
import { RequestError } from "../http-errors";

interface FetchOptions extends RequestInit {
    timeout?: number;
}

function isError(error: unknown): error is Error {
    return error instanceof Error;
}

export async function fetchHandler<T>(url: string, options: FetchOptions = {}): Promise<ActionResponse<T>> {
    const { headers: customHeaders = {}, ...restOptions } = options;


    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
    
    const isFormData = restOptions.body instanceof FormData;
    const hasBody = "body" in restOptions && restOptions.body != null;

    const headers: HeadersInit = isFormData ? {...customHeaders} 
    : hasBody ?  {...defaultHeaders, ...customHeaders} : {...customHeaders};
    
    const config: RequestInit = {
        ...restOptions,
        headers,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) throw new RequestError(response.status, `HTTP error: ${response.status}`);

        return await response.json()
    } catch (err) {
        const error = isError(err) ? err: new Error("Unkown error");

        if (error.name === "AbortError") {
            console.log(`Request to ${url} timed out`);
        } else {
            console.log(`Error fetching ${url}: ${error.message}`);
        }

        return handlerError(error) as ActionResponse<T>
    }
}