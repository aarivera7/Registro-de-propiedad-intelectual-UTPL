import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { el } from '@fullcalendar/core/internal-common';

export const hasRoleGuard: CanMatchFn = (route, segments) => {
  const allowedRoles: Array<string> = route.data?.['allowedRoles'];

  const uid = inject(LoginService).uid;

  inject(LoginService).getDataUser(uid).then(user => {
    
    if (!user) {
      inject(Router).createUrlTree(['projects']);
    } else if (!allowedRoles.includes(user.rol)) {
      inject(Router).createUrlTree(['projects']);
    }
  });
  return true;
};
