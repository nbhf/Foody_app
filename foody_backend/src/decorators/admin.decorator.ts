import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorateur récupérable via @Admin
export const Admin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.admin;
  },
);