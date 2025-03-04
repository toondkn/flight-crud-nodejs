import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const genericErrorHandler: ErrorHandler = (e, c) => {
    if (e instanceof HTTPException)
        return c.text(e.message, e.status);
    return c.text('Something went wrong', 500);
};
