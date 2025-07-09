export class ResponseTypes{
    static SUCCESS = (data: any, message: string = "successful"): {data: any, message: string, error: boolean} => {
        return {
            data,
            message,
            error: false,
        }
    }
    static FAILED = (data = null, message: string = "failed"): {data: any, message: string, error: boolean} => {
        return {
            data,
            message,
            error: true,
        }
    }
}