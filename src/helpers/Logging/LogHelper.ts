import path from 'path';
import date from 'date-and-time';

export default class LogHelper {
    
    private static getCallerFileName(): string | undefined {
        const error = new Error();
        const stack = error.stack?.split('\n');
        
        if (stack && stack.length > 2) {
            const callerStackLine = stack[3]; // The 3rd line should be the caller
            const match = callerStackLine.match(/\((.*):\d+:\d+\)/);
            if (match && match[1]) {
                const fullPath = match[1];
                return path.basename(fullPath);
            }
        }
        return undefined;
    }

    public static log(message: string): void {
        const now = new Date();
        const formattetDate = date.format(now, 'MM/DD/YY hh:mmA');
        const fileName = this.getCallerFileName();
        console.log(`[${formattetDate}][${fileName}]: ${message}`);
    }

    public static error(message: string): void {
        const now = new Date();
        const formattetDate = date.format(now, 'MM/DD/YY hh:mmA');
        const fileName = this.getCallerFileName();
        console.error(`[${formattetDate}][${fileName}]: ${message}`);
    }
}