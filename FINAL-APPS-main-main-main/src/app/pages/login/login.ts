import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Importar Router
import { AuthService } from '../../../services/auth-service';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login{
  errorLogin = false;
  authService = inject(AuthService);
  router = inject(Router);
  isLoading = false;

  async login(form: NgForm) {
    this.errorLogin = false;
   
    // Validaciones básicas
    if (!form.value.restaurantName || !form.value.password) {
      this.errorLogin = true;
      return;
    }

    this.isLoading = true;

    // cambiar nombre a login exitoso
    const loginExitoso = await this.authService.login(form.value);
   
    this.isLoading = false;

    if (loginExitoso) {
      // CASO ÉXITO: Redirigir al panel de administración
      // existe? en tu app.routes.ts
      this.router.navigate(['Perfil']);
    } else {
      //  CASO ERROR: Mostrar mensaje rojo
      this.errorLogin = true;
    }
  }
}