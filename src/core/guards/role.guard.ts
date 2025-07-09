import {CanActivate, ExecutionContext, Inject, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {ROLE_KEY} from "../decorators";
import {ROLE} from "../../common/enums";

@Injectable()
export class RoleGuard implements CanActivate{

    constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext):
        boolean | Promise<boolean> | Observable<boolean> {

        const roles: ROLE[] = this.reflector.getAllAndOverride<ROLE[]>(
            ROLE_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        );

        if (!roles){
            return true;
        }

        const {user} = context.switchToHttp().getRequest();
        return user.include(user.role)
    }

}