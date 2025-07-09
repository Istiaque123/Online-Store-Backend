import {BadRequestException, Injectable, PipeTransform} from "@nestjs/common";

import {ObjectSchema} from "joi";

@Injectable()
export class JoiValidationPipe implements PipeTransform{

    constructor(private readonly schema: ObjectSchema) {
    }

    transform(value: Record<string, any>, ): any {
        const {error} = this.schema.validate(value);

        if (error){
            throw new BadRequestException({
                message: error.message.replace(/("|\[|\d|])/g, ""),
                error: true
            });
        }

        return value;
    }

}