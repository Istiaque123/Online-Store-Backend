import {ROLE} from "../../../common/enums";

export class RegisterDto {
    email:string;
    password:string;
    confirmPassword:string;
    role?:ROLE
}