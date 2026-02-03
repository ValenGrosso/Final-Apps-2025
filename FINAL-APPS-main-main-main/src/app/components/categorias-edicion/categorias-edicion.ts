import { Component, inject, input, viewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { Spinner } from '../../components/spinner/spinner';
import { AuthService } from '../../../services/auth-service';
import { CategoriesService } from '../../../services/category-service';
import { Categoria, NewCategory } from '../../interfaces/categoria';

@Component({
  selector: 'app-categorias-edicion',
  standalone: true,
  imports: [FormsModule, Spinner, CommonModule, RouterLink], 
  templateUrl: './categorias-edicion.html',
  styleUrl: './categorias-edicion.scss',
})
export class CategoriasEdicion implements OnInit {
  private authService = inject(AuthService);
  private categoryService = inject(CategoriesService);
  private router = inject(Router);

  // Recibe 'nuevo' o el ID numérico como string desde la URL
  idCategory = input<string>();
  
  form = viewChild<NgForm>("newCategoryForm");
  
  categoryOriginal: Categoria | undefined = undefined;
  isLoading = false;
  errorBack = false;
  isEditing = false;

  async ngOnInit() {
    this.isLoading = true;
    try {
      const userId = this.authService.getUserId();
      if (!userId) {
        this.router.navigate(['/login']);
        return;
      }

      // 1. Cargar todas las categorías del restaurante para buscar la actual
      // (Esto asegura que tengamos la data fresca si recargamos la página)
      await this.categoryService.getCategoriesByRestaurant(userId);
      const allCategories = this.categoryService.categories();

      // 2. Verificar si estamos editando
      const idParam = this.idCategory();
      
      if (idParam && idParam !== 'nuevo') {
        this.isEditing = true;
        // Buscamos la categoría en la lista cargada
        this.categoryOriginal = allCategories.find(c => c.id === Number(idParam));

        if (this.categoryOriginal) {
          // Llenamos el formulario
          setTimeout(() => {
            this.form()?.setValue({
              name: this.categoryOriginal!.name,
            });
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async handleFormSubmission(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.errorBack = false;
    let res;

    try {
      const userId = this.authService.getUserId();
      
if (this.isEditing) {
  // --- MODO EDICIÓN ---
  if (!this.categoryOriginal) {
    console.error("No se encontró la categoría original");
    this.errorBack = true;
    this.isLoading = false;
    return;
  }

  const updateData: Categoria = {
    ...this.categoryOriginal,       // id, restaurantId, etc.
    name: form.value.name,          // solo cambiamos el nombre
  };

  res = await this.categoryService.updateCategory(
    Number(this.idCategory()),
    updateData
  );
} else {
  // --- MODO CREACIÓN ---
  const nuevaCategory: NewCategory = {
    name: form.value.name,
    restaurantId: userId,
  };
  res = await this.categoryService.addCategory(nuevaCategory);
}

      if (res) {
        // ÉXITO: Volver al panel
        this.router.navigate(["/Perfil"]);
      } else {
        this.errorBack = true;
      }
    } catch (error) {
      console.error(error);
      this.errorBack = true;
    } finally {
      this.isLoading = false;
    }
  }
}
