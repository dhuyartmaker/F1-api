import express, {Request, Response} from 'express';

const StatusCode = {
    Created: 201,
    OK: 200
}

const ResponseMessageCode = {
    Created: 'Created',
    OK: 'Success'
}

interface ISuccessResponse {
    send?: (res: Response) => any;
}

class SuccessResponse implements ISuccessResponse {
    message: string;
    status: number;
    metadata: any;

    public constructor({ message, status, metadata } : { message: string, status: number, metadata: any }) {
        this.status = status
        this.message = message
        this.metadata = metadata
    }

    send(res: Response) : any {
        return res.status(this.status).send({
            message: this.message,
            metadata: this.metadata
        })
    } 
}

class CreatedResponseSuccess extends SuccessResponse {
    constructor({ message = ResponseMessageCode.Created, status = StatusCode.Created, metadata = {}}) {
        super({ message, status, metadata })
    }
}

class OkResponseMessage extends SuccessResponse {
    constructor({ message = ResponseMessageCode.OK, status = StatusCode.OK, metadata = {}}) {
        super({ message, status, metadata })
    }
}

export default {
    CreatedResponseSuccess,
    OkResponseMessage
}