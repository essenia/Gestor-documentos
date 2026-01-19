// import { CanActivateFn } from '@angular/router';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';

import { AuthServiceService } from '../services/auth-service.service';

export const roleGuardGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean | UrlTree => {
  // Inyectamos los servicios
  const auth = inject(AuthServiceService); // inyecta AuthService
  const router = inject(Router); // inyecta Router
  // Roles permitidos definidos en la ruta
  const expectedRoles = route.data['roles'] as string[];
  const rolUsuario = auth.getRol();
  // Si no está logueado, redirige a login
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  // Si tiene rol permitido, deja pasar
  if (expectedRoles.includes(rolUsuario)) {
    return true;
  }



  // Si tiene rol pero no permitido, redirige a dashboard

  return router.createUrlTree(['/dashboard']);
};
