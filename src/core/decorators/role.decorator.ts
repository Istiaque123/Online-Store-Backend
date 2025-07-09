import {ROLE} from "../../common/enums";
import {SetMetadata} from "@nestjs/common";

export const ROLE_KEY = 'roles';
export const Roles = (...roles: ROLE[]) => SetMetadata(ROLE_KEY, roles);