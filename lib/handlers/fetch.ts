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
    const { timeout = 5000, headers: customHeaders = {}, ...restOptions } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

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
        signal: controller.signal // The signal to support request cancellation 
    };

    try {
        const response = await fetch(url, config);
        
        clearTimeout(id);

        if (!response.ok) throw new RequestError(response.status, `HTTP error: ${response.status}`);

        return await response.json()
    } catch (err) {
        clearTimeout(id);
        const error = isError(err) ? err: new Error("Unkown error");

        if (error.name === "AbortError") {
            console.log(`Request to ${url} timed out`);
        } else {
            console.log(`Error fetching ${url}: ${error.message}`);
        }

        return handlerError(error) as ActionResponse<T>
    }
}