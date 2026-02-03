import { Component, inject, input, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../../services/user-service';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurants-page',
  imports: [RouterModule, FormsModule ],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
})
export class RestaurantsPage implements OnInit{
 
    ngOnInit(): void {
      this.userService.getusers();
    }
    authservice = inject(AuthService);
    userService = inject(UsersService);
    user = input.required<User>();
    router = inject (Router)

  viewMenu(id: number) {
    Swal.fire({
      title: " ¿Desea ver el menu?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Sí, ver menú",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/restaurants-menu', id]);
      }
    });
  }
}