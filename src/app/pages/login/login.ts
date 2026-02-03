import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
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
   
    if (!form.value.restaurantName || !form.value.password) {
      this.errorLogin = true;
      return;
    }

    this.isLoading = true;

    const loginExitoso = await this.authService.login(form.value);
   
    this.isLoading = false;

    if (loginExitoso) {
      this.router.navigate(['Perfil']);
    } else {
      this.errorLogin = true;
    }
  }
}