import { CanActivateChildFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { inject } from '@angular/core';

export const onlyLoggedUserGuard: CanActivateChildFn = (childRoute, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.token) { /**
   
el ! convierte el token en booleano, si no existe es null, y !null es true(!si es false lo vuelve true y viceversa)*/
  const newPath = router.parseUrl("/login");
  return new RedirectCommand(newPath, {
    skipLocationChange: true,});}
return true;
};
