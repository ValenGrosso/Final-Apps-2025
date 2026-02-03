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
  
  // Modales / Confirmaciones
  showDeleteConfirm = false;
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

    // 1. Cargar Usuario
    this.user = await this.userService.getUsersbyId(userId);

    // 2. Cargar Productos (Con logs)
    const prods = await this.restaurantService.getProductbyrestaurant(userId);
    console.log("Productos recibidos en componente:", prods);
    
    // Asignación directa
    this.products = prods || [];

    // 3. Cargar Categorías
    await this.categoriesService.getCategoriesByRestaurant(userId);
    this.categories = this.categoriesService.categories();

  } catch (err) {
    console.error(err);
    this.error = 'Error cargando datos';
  } finally {
    this.cargando = false;
  }
}

  openDeleteConfirm() { this.showDeleteConfirm = true; }
  closeDeleteConfirm() { this.showDeleteConfirm = false; }

  async deleteUser() {
    if (!this.user) return;
    this.isDeleting = true;
    try {
      const result = await this.userService.deleteUser(this.user.id);
      if (result) {
        this.authService.logout();
      } else {
        this.error = 'No se pudo eliminar la cuenta';
        this.isDeleting = false;
      }
    } catch (err) {
      this.error = 'Error al eliminar la cuenta';
      this.isDeleting = false;
    }
  }

  async deleteProduct(id: number) {
    if(!confirm('¿Estás seguro de borrar este producto?')) return;

    const success = await this.restaurantService.deleteProduct(id);
    if(success) {
      this.products = this.products.filter(p => p.id !== id);
    } else {
      alert('Error al eliminar producto');
    }
  }

  async deleteCategory(id: number) {
    if(!confirm('¿Borrar categoría? Esto podría afectar productos asociados.')) return;

    const success = await this.categoriesService.deleteCategory(id);
    if(success) {
      this.categories = this.categories.filter(c => c.id !== id);
    } else {
      alert('Error al eliminar categoría');
    }
  }
}

