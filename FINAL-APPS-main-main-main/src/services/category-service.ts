import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { Categoria, NewCategory, UpdateCategoryRequestDto } from '../app/interfaces/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  authService = inject(AuthService);
  categories = signal<Categoria[]>([]);
 
  readonly API_USERS_URL = "https://w370351.ferozo.com/api/Users";
  readonly API_CATEGORIES_URL = "https://w370351.ferozo.com/api/Categories";


  // --- OBTENER CATEGORÍAS ---
  async getCategoriesByRestaurant(restaurantId: number) {
    try {
      const res = await fetch(`${this.API_USERS_URL}/${restaurantId}/categories`);
      if (!res.ok) {
        this.categories.set([]);
        return;
      }
      const data = (await res.json()) as Categoria[];
      this.categories.set(data);
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
    }
  }


  // --- AGREGAR CATEGORÍA---
  async addCategory(category: NewCategory) {
    // 1. Verificamos datos antes de enviar
    console.log("Intentando crear categoría:", category);
    console.log("Token actual:", this.authService.token);


    if (!this.authService.token) {
      console.error("❌ ERROR: No hay token de autenticación.");
      return undefined;
    }


    try {
      const res = await fetch(this.API_CATEGORIES_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          // USAMOS EL SIGNO + PARA CONCATENAR (Es más seguro que las backticks)
          'Authorization': "Bearer " + this.authService.token
        },
        body: JSON.stringify(category)
      });


      if (!res.ok) {
        console.error("❌ Error del servidor:", res.status, res.statusText);
        // Intentamos leer el mensaje de error del backend si existe
        const errorText = await res.text();
        console.error("Detalle del error:", errorText);
        return undefined;
      }
     
      const newCategory: Categoria = await res.json();
      console.log("✅ Categoría creada:", newCategory);
     
      this.categories.update(current => [...current, newCategory]);
      return newCategory;


    } catch (error) {
      console.error("❌ Error de red:", error);
      return undefined;
    }
  }


  // --- ACTUALIZAR CATEGORÍA ---
  async updateCategory(id: number, categoryData: Categoria) {
    if (!this.authService.token) return undefined;


    try {
      const res = await fetch(this.API_CATEGORIES_URL + "/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': "Bearer " + this.authService.token
        },
        body: JSON.stringify(categoryData)
      });


      if (!res.ok) {
        console.error("Error al actualizar:", res.status);
        return undefined;
      }


      const updatedCategory = await res.json() as Categoria;
      this.categories.update(currentCategories =>
        currentCategories.map(cat => cat.id === id ? updatedCategory : cat)
      );
      return updatedCategory;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }


  // --- BORRAR CATEGORÍA ---
  async deleteCategory(id: string | number) {
    if (!this.authService.token) return false;
    try {
      const res = await fetch(this.API_CATEGORIES_URL + "/" + id, {
        method: "DELETE",
        headers: {
          'Authorization': "Bearer " + this.authService.token
        }
      });

      if (!res.ok) return false;

      const numId = Number(id);
      this.categories.update(currentCategories =>
        currentCategories.filter(cat => cat.id !== numId)
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
