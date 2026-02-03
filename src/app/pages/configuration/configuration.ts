import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth-service';
import { ProductService } from '../../../services/product-service';
import { CategoriesService } from '../../../services/category-service';
import { UsersService } from '../../../services/user-service';
import { Perfil } from '../../interfaces/perfil';
import { Producto } from '../../interfaces/productos';
import { Categoria } from '../../interfaces/categoria';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './configuration.html',
  styleUrl: './configuration.scss',
})
export class Configuracion implements OnInit {
  authService = inject(AuthService);
  restaurantService = inject(ProductService);
  categoriesService = inject(CategoriesService);
  userService = inject(UsersService);
  router = inject(Router);

  user?: Perfil;
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  cargando = true;
  error = '';
  isDeleting = false;

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    this.cargando = true;
    this.error = '';

    try {
      const userId = this.authService.getUserId();
      if (!userId) {
        this.error = 'Sesión expirada';
        return;
      }

      const [userInfo, productos, categorias] = await Promise.all([
        this.userService.getUsersbyId(userId),
        this.restaurantService.getProductbyrestaurant(userId),
        this.categoriesService.getCategoriesByRestaurant(userId),
      ]);

      this.user = userInfo ?? undefined;
      this.productos = productos ?? [];
      this.categorias = this.categoriesService.categories();

      if (!this.user) {
        this.error = 'No se pudieron cargar tus datos';
      }
    } catch (err) {
      console.error(err);
      this.error = 'Error cargando datos';
    } finally {
      this.cargando = false;
    }
  }

  async borrarUsuario(): Promise<void> {
    if (!this.user) return;

    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu cuenta permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmacion.isConfirmed) return;

    this.isDeleting = true;
    try {
      const eliminado = await this.userService.deleteUser(this.user.id);

      if (eliminado) {
        await Swal.fire({
          title: 'Cuenta eliminada',
          text: 'Tu cuenta se eliminó correctamente.',
          icon: 'success',
        });
        this.authService.logout();
      } else {
        this.isDeleting = false;
        await Swal.fire('Error', 'No se pudo eliminar la cuenta.', 'error');
      }
    } catch (err) {
      console.error(err);
      this.isDeleting = false;
      await Swal.fire('Error', 'Ocurrió un error al eliminar la cuenta.', 'error');
    }
  }

  async borrarProducto(id: number): Promise<void> {
    const confirmacion = await Swal.fire({
      title: '¿Borrar producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmacion.isConfirmed) return;

    const success = await this.restaurantService.deleteProduct(id);
    if (success) {
      this.productos = this.productos.filter((p) => p.id !== id);
      Swal.fire('Eliminado', 'El producto fue eliminado', 'success');
    } else {
      Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
    }
  }

  async borrarCategoria(id: number): Promise<void> {
    const confirmacion = await Swal.fire({
      title: '¿Borrar categoría?',
      text: 'Esto podría afectar productos asociados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmacion.isConfirmed) return;

    const success = await this.categoriesService.deleteCategory(id);
    if (success) {
      this.categorias = this.categorias.filter((c) => c.id !== id);
      Swal.fire('Eliminada', 'La categoría fue eliminada', 'success');
    } else {
      Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
    }
  }
}