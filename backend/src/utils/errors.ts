import { Request, Response, NextFunction } from 'express';

export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export class AppError extends Error {
    statusCode: number;
    errors: any[];

    constructor(message: string, statusCode: number, errors: any[] = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
