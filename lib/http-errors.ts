export class RequestError extends Error {
    statusCode: number;
    errors?: Record<string, string[]>;

    constructor(statusCode: number, message: string, errors?: Record<string, string[]>) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = "RequestError";
    }
};

export class ValidationError extends RequestError {
    constructor(fieldErrors: Record<string, string[]>) {
        const message = ValidationError.formatFieldError(fieldErrors);
        super(400, message, fieldErrors);
        this.name = "ValidationError";
    }

    static formatFieldError(fieldErrors: Record<string, string[]>): string {
        const formattedMessages = Object.entries(fieldErrors).map(([field, messages]) => {
            if (messages[0] === "Required") return `${field} is required`;
            return messages.join(" and ")
        })

        return formattedMessages.join(", ")
    }
};

export class NotFoundError extends RequestError {
    constructor(resource: string) {
        super(404, `${resource} not found`);
        this.name = "NotFoundError";
    }
};

export class ForbiddenError extends RequestError {
    constructor(message: string = "Forbidden") {
        super(403, message);
        this.name = "ForbiddenError";
    }
};

export class UnauthorizedError extends RequestError {
    constructor(message: string = "Unauthorized") {
        super(401, message);
        this.name = "UnauthorizedError";
    }
};
