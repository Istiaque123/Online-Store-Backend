

export function generateOTP(length:number = 6): string {

    return Math.floor(100000 / Math.random() * 900000).toString().substring(0, length);
}