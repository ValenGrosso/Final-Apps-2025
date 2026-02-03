import { Component, inject, input, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // 👈 Importar RouterLink
import { CommonModule } from '@angular/common';
import { Spinner } from '../spinner/spinner';
import { ProductService } from '../../../services/product-service';
import { CategoriesService } from '../../../services/category-service';
import { AuthService } from '../../../services/auth-service';
import { NewProduct, Producto } from '../../interfaces/productos';
import { Categoria } from '../../interfaces/categoria';

@Component({
  selector: 'app-restaurants-product',
  standalone: true,
  imports: [Spinner, FormsModule, CommonModule, RouterLink], // 👈 AGREGAR RouterLink AQUÍ
  templateUrl: './productos-edicion.html',
  styleUrl: './productos-edicion.scss',
})
export class ProductosEdicion implements OnInit {
  private restaurantService = inject(ProductService);
  private categoriesService = inject(CategoriesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  idProduct = input<string>(); 
  form = viewChild<NgForm>('newProductForm');

  categories: Categoria[] = [];
  productData: any = {}; 
  isLoading = false;
  errorEnBack = false;
  restaurantId: number | null = null;
  isEditing = false;

  async ngOnInit() {
    this.isLoading = true;
    try {
      this.restaurantId = this.authService.getUserId();
      if (!this.restaurantId) {
        this.router.navigate(['/login']);
        return;
      }

      await this.categoriesService.getCategoriesByRestaurant(this.restaurantId);
      this.categories = this.categoriesService.categories();

      const id = this.idProduct();
      if (id && id !== 'nuevo') {
        this.isEditing = true;
        await this.loadProductData(Number(id));
      }

    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadProductData(id: number) {
  const product = await this.restaurantService.getProductById(id);
  if (product) {
    // Guardamos los datos para usarlos en el HTML
    this.productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      labels: product.labels ? product.labels.join(', ') : '', 
      discount: product.discount || 0,
      featured: product.featured || false,
      hasHappyHour: product.hasHappyHour || false,
      isDestacado: product.isDestacado || false
    };

    // Mantenemos esto por si acaso, pero el HTML usará [ngModel]
    setTimeout(() => {
      this.form()?.setValue(this.productData);
    });
  }
}

  async handleFormSubmission(form: NgForm) {
    if (form.invalid || !this.restaurantId) return;

    this.isLoading = true;
    this.errorEnBack = false;

    try {
      const productData: NewProduct = {
        name: form.value.name,
        description: form.value.description,
        price: Number(form.value.price),
        categoryId: Number(form.value.categoryId),
        restaurantId: this.restaurantId,
        labels: form.value.labels ? form.value.labels.split(',').map((l: string) => l.trim()) : [],
        
        // 🛠️ FIX: Enviamos 1 por defecto por si el backend lo requiere, pero no lo pedimos
        recommendedFor: 1, 

        discount: Number(form.value.discount),
        featured: !!form.value.featured,
        hasHappyHour: !!form.value.hasHappyHour,
        isDestacado: !!form.value.isDestacado,
      };

      let result;

      if (this.isEditing) {
        const id = Number(this.idProduct());
        result = await this.restaurantService.editProduct({ ...productData, id: id });
      } else {
        result = await this.restaurantService.addProduct(productData);
      }

      if (result) {
        this.router.navigate(['/Perfil']);
      } else {
        this.errorEnBack = true;
      }

    } catch (e) {
      console.error(e);
      this.errorEnBack = true;
    } finally {
      this.isLoading = false;
    }
  }
}