import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../../services/auth-service';
import { ProductService } from '../../../services/product-service';
import { CategoriesService } from '../../../services/category-service';
import { UsersService } from '../../../services/user-service';
import { User } from '../../interfaces/user';
import { Producto } from '../../interfaces/productos';
import { Categoria } from '../../interfaces/categoria';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil implements OnInit {
  // Inyecciones
  private userService = inject(UsersService);
  private authService = inject(AuthService);
  private restaurantService = inject(ProductService);
  private categoriesService = inject(CategoriesService);
  public router = inject(Router);
  
  // Estado
  user: User | undefined = undefined;
  products: Producto[] = [];     
  categories: Categoria[] = [];  
  
  cargando = true;
  error = '';
  isDeleting = false;

  async ngOnInit() {
    await this.loadAllData();
  }

  async loadAllData() {
    this.cargando = true;
    try {
      const userId = this.authService.getUserId();
      console.log("Cargando datos para usuario ID:", userId);

      if (!userId) { 
        this.error = "Sesión expirada"; 
        return; 
      }

      // 1. Caragar Usuario
      this.user = await this.userService.getUsersbyId(userId);

      // 2. Caragar Productos
      const prods = await this.restaurantService.getProductbyrestaurant(userId);
      console.log("Productos recibidos en componente:", prods);
      this.products = prods || [];

      // 3. Caragar Categorías
      await this.categoriesService.getCategoriesByRestaurant(userId);
      this.categories = this.categoriesService.categories();

    } catch (err) {
      console.error(err);
      this.error = 'Error cargando datos';
    } finally {
      this.cargando = false;
    }
  }

  confirmDeleteUser() {
    if (!this.user) return;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminarán tu cuenta y todos tus datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0047ab',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar todo',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.deleteUser();
      }
    });
  }

  confirmDeleteCategory(id: number) {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'No vas a poder revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0047ab',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.deleteCategory(id);
      }
    });
  }

  confirmDeleteProduct(id: number) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'No vas a poder revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0047ab',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.deleteProduct(id);
      }
    });
  }
// Private porque el método es interno del componente
  private async deleteUser() {
    if (!this.user) return;
    this.isDeleting = true;

    try {
      const result = await this.userService.deleteUser(this.user.id);
      if (result) {
        await Swal.fire({
          title: 'Cuenta eliminada',
          text: 'Tu cuenta fue eliminada correctamente.',
          icon: 'success'
        });
        this.authService.logout();
      } else {
        this.isDeleting = false;
        Swal.fire({
          title: 'Error',
          confirmButtonColor: '#0047ab',
          text: 'No se pudo eliminar la cuenta.',
          icon: 'error'
        });
      }
    } catch (err) {
      this.isDeleting = false;
      Swal.fire({
        title: 'Error',
        text: 'Error al eliminar la cuenta.',
        icon: 'error'
      });
    }
  }

  private async deleteProduct(id: number) {
    const success = await this.restaurantService.deleteProduct(id);
    if (success) {
      this.products = this.products.filter(p => p.id !== id);
      Swal.fire({
        title: 'Eliminado',
        confirmButtonColor: '#0047ab',
        text: 'El producto fue eliminado.',
        icon: 'success'
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Error al eliminar producto.',
        icon: 'error'
      });
    }
  }

  private async deleteCategory(id: number) {
    const success = await this.categoriesService.deleteCategory(id);
    if (success) {
      this.categories = this.categories.filter(c => c.id !== id);
      Swal.fire({
        title: 'Eliminado',
        confirmButtonColor: '#0047ab',
        text: 'La categoría fue eliminada.',
        icon: 'success'
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Error al eliminar categoría.',
        icon: 'error'
      });
    }
  }
}
