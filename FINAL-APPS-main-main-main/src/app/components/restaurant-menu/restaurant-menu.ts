import { Component, inject, input, OnInit, signal, computed, numberAttribute } from '@angular/core';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common'; // Importante para pipes como currency
import { ProductService } from '../../../services/product-service';
import { UsersService } from '../../../services/user-service';
import { CategoriesService } from '../../../services/category-service';
import { Producto } from '../../interfaces/productos';
import { User } from '../../interfaces/user';
import { Categoria } from '../../interfaces/categoria';

@Component({
  selector: 'app-restaurants-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurant-menu.html',
  styleUrl: './restaurant-menu.scss',
})
export class RestaurantMenu implements OnInit {
  // Servicios
  private router = inject(Router);
  private usersService = inject(UsersService);
  private restaurantService = inject(ProductService);
  private categoriesService = inject(CategoriesService);

// ❌ ANTES: idRestaurant = input.required<number>();

  // ✅ AHORA: Usamos 'transform' para convertir el string de la URL en número automáticamente
  // El alias 'idRestaurant' coincide con la ruta que acabamos de arreglar.
  idRestaurant = input.required<number, string>({ transform: numberAttribute });

  // ESTADO (Signals)
  isLoading = signal<boolean>(true);
  user = signal<User | undefined>(undefined);
  products = signal<Producto[]>([]);
  categories = signal<Categoria[]>([]);
  selectedCategoryId = signal<number | null>(null);

  // LÓGICA COMPUTADA (La forma moderna de filtrar)
  // Se actualiza automáticamente si cambia 'products' o 'selectedCategoryId'
  filteredProducts = computed(() => {
    const selectedId = this.selectedCategoryId();
    const currentProducts = this.products();

    if (selectedId === null) {
      return currentProducts;
    }
    return currentProducts.filter(p => p.categoryId === selectedId);
  });
  async ngOnInit() {
  // 1. Obtenemos el ID del Input Signal
  const id = this.idRestaurant(); 
  console.log(this.idRestaurant)

  if (id) {
    //this.isLoading.set(true); // Activa el spinner
    console.log(this.idRestaurant)

    try {
      // --- A. Cargar Datos del Restaurante (Nombre, Dirección) ---
      // Primero buscamos si ya lo tenemos en memoria
      let restaurantUser = this.usersService.users.find(r => r.id === id);

      // Si no está en memoria, lo pedimos al backend
      if (!restaurantUser) {
        restaurantUser = await this.usersService.getUsersbyId(id);
      }
      this.user.set(restaurantUser);

      // --- B. Cargar Productos (SOLUCIÓN AL ERROR) ---
      // Usamos 'id' que definimos arriba, no 'restaurantId'
      const prods = await this.restaurantService.getProductbyrestaurant(id);
      this.products.set(prods);

      // --- C. Cargar Categorías ---
      await this.categoriesService.getCategoriesByRestaurant(id);
      this.categories.set(this.categoriesService.categories());

    } catch (error) {
      console.error("Falló la carga del menú:", error);
    } finally {
      // --- D. Apagar Spinner (SIEMPRE) ---
      this.isLoading.set(false);
      console.log(this.idRestaurant)
    }
  }
}

  selectCategory(categoryId: number | null) {
    this.selectedCategoryId.set(categoryId);
  }

  calculateFinalPrice(product: Producto): number {
    const discount = product.discount || 0;
    return product.price - (product.price * (discount / 100));
  }

  volver() {
    this.router.navigate(['/restaurants']);
  }
}
