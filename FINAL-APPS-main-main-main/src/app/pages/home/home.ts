import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../../services/category-service';
import { Categoria } from '../../interfaces/categoria';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
  imports: [ CommonModule, RouterModule]
})
export class Home {
  categoriasService = inject(CategoriesService);
  categorias:Categoria[] = [];
  router = inject(Router)

  Login() {
    this.router.navigate(['/Login'])
  }

  Register() {
    this.router.navigate(['/Registro'])
  }

  Invitado() {
    this.router.navigate(['/restaurants']);
  }
}
