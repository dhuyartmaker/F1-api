import express, {Request, Response} from 'express';

const StatusCode = {
    BadRequest: 400,
    AuthFail: 401,
    Forbidden: 403,
    Conflict: 409,
    NotFound: 404
}
const ResponseMessageCode = {
    Forbidden: 'Bad request errror!',
    AuthFail: 'Authenticate fail!',
    Conflict: 'Conflict error!',
    BadRequest: 'Bad request!',
    NotFound: 'Not found error!'
}
class ErrorResponse extends Error {
    status: number;
    constructor(message : string, status: number) {
        super(message || "Something error!")
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ResponseMessageCode.Conflict, status = StatusCode.Conflict) {
        super(message, status)
    }
}

class ForbiddenRequestError extends ErrorResponse {
    constructor(message = ResponseMessageCode.Forbidden, status = StatusCode.Forbidden) {
        super(message, status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ResponseMessageCode.BadRequest, status = StatusCode.BadRequest) {
        super(message, status)
    }
}

class AuthFailError extends ErrorResponse {
    constructor(message = ResponseMessageCode.AuthFail, status = StatusCode.AuthFail) {
        super(message, status)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ResponseMessageCode.NotFound, status = StatusCode.NotFound) {
        super(message, status)
    }
}

export default {
    ConflictRequestError,
    ForbiddenRequestError,
    BadRequestError,
    AuthFailError,
    NotFoundError
}