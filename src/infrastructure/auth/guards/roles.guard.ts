import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      console.log(requiredRoles)
  
      if (!requiredRoles) {
        return true;
      }
  
      const { user } = context.switchToHttp().getRequest();
      
  
      if (!user || !user.permissions) {
        throw new ForbiddenException('No roles found for the user');
      }
  
      const hasRole = requiredRoles.some((role) => user.permissions.includes(role));
  
      if (!hasRole) {
        throw new ForbiddenException('Insufficient roles');
      }
  
      return hasRole;
    }
  }
  