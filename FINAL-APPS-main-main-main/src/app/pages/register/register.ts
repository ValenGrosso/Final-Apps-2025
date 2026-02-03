import { Component, inject, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Spinner } from '../../components/spinner/spinner'; // Ajusta ruta
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../../services/user-service';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterModule, FormsModule, Spinner],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  usersService = inject(UsersService);
  authService = inject(AuthService);
  router = inject(Router);
  
  isLoading = false;
  errorRegister = false;
  isEditing = false; // Bandera para saber en qué modo estamos

  userData: any = {
    restaurantName: '',
    firstName: '',
    lastName: '',
    email: '', // Si tienes email
    address: '',
    phoneNumber: '',
    password: '',
    password2: ''
  };

  form = viewChild<NgForm>('registerForm');

  async ngOnInit() {
    // Detectamos si estamos en la ruta de edición
    if (this.router.url.includes('/profile/edit')) {
      this.isEditing = true;
      await this.loadUserData();
    }
  }

  async loadUserData() {
    this.isLoading = true;
    try {
      const userId = this.authService.getUserId();
      if (userId) {
        const user = await this.usersService.getUsersbyId(userId);
        if (user) {
          // Rellenamos userData con lo que vino del back
          this.userData = {
            id: user.id, // Guardamos el ID para el update
            restaurantName: user.restaurantName,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phoneNumber,
            password: '', // Contraseña vacía por seguridad
            password2: ''
          };
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async register(form: NgForm) {
    this.errorRegister = false;
    
    // Validación de contraseñas iguales
    if (form.value.password !== form.value.password2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    this.isLoading = true;

    try {
      let result;

      if (this.isEditing) {
        // --- MODO EDICIÓN ---
        // Combinamos el ID original con los datos del formulario
        const updateData = { 
          ...form.value, 
          id: this.userData.id,
          // Si el backend pide userName, asegúrate de mandarlo
          userName: form.value.firstName // o email, según tu back
        };
        
        result = await this.usersService.updateUser(updateData);
        
        if (result) {
          this.router.navigate(['/Perfil']); // Volver al panel
        } else {
          this.errorRegister = true;
        }

      } else {
        // --- MODO REGISTRO ---
        result = await this.authService.register(form.value);

        if (result) {
          this.router.navigate(["/Login"]);
        } else {
          this.errorRegister = true;
        }
      }

    } catch (error) {
      console.error("Error:", error);
      this.errorRegister = true;
    } finally {
      this.isLoading = false;
    }
  }
}