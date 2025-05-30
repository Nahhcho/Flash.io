import { NextResponse } from "next/server";

// This is  a generic base response type used to structure API responses
type ActionResponse<T = null> = { 
    success: boolean; // indicates if the api call was successful
    data?: T; // optional payload present only on success
    error?: {
        message: string;
        details: Record<string, string[]>;
    };
    status?: number; // optional HTTP status code
}

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>; 