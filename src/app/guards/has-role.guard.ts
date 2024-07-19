import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const hasRoleGuard: CanMatchFn = (route, segments) => {
  const allowedRoles: Array<string> = route.data?.['allowedRoles'];

  return allowedRoles.includes( inject(LoginService).aUser!.rol ) ? true : inject(Router).createUrlTree(['projects']);
};
