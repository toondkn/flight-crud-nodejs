import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const genericErrorHandler: ErrorHandler = (e, c) => {
    console.error(`${e.name} - ${e.message}: ${e.cause ?? 'Unknown cause.'}`);
    if (e instanceof HTTPException)
        return c.text(e.message, e.status);
    console.trace(e);
    return c.text('Something went wrong', 500);
};
