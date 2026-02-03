import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { Producto, NewProduct } from '../app/interfaces/productos'; 

@Injectable({
  providedIn: 'root'
})


export class ProductService {
  aleatorio = Math.random();
  authService = inject(AuthService);
  Product: Producto[] = [];


  async addProduct (NewProduct:NewProduct) {
    const res = await fetch("https://w370351.ferozo.com/api/products",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer "+this.authService.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(NewProduct)
        });


    if (!res.ok) return;
    const resProduct:Producto = await res.json();
    this.Product.push(resProduct);
    return resProduct;


}

// --- OBTENER PRODUCTOS DEL RESTAURANTE ---
  async getProductbyrestaurant(id: string | number): Promise<Producto[]> {
    try {
      const res = await fetch(`https://w370351.ferozo.com/api/Users/${id}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + this.authService.token
        }
      });


      if (!res.ok) {
        console.error("Error al traer productos:", res.status);
        return [];
      }
     
      const data = await res.json();
      return data;  // Devuelve el array de productos


    } catch (err) { // Si ocurre un error de red (por ejemplo, la API no responde), se captura acá para evitar que el programa falle
      console.error("Error de red:", err);
      return [];
    }
  }
async getProductById(id: string | number) {
  const res = await fetch('https://w370351.ferozo.com/api/products/'+ id,  
    {
      headers:{
        Authorization: "Bearer "+this.authService.token,
      },
    });
 
  if (!res.ok) return;
  const resProduct: Producto = await res.json();
  return resProduct;


}
async editProduct(productoEditado: Producto) {
  const res = await fetch ('https://w370351.ferozo.com/api/products/'+ productoEditado.id, 
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.authService.token,
    },
    body: JSON.stringify(productoEditado)
    });
  if (!res.ok) return;


    /**edita la lista reemplazando solamente el que editamos  */
  this.Product = this.Product.map(product => {
    if (product.id === productoEditado.id) {
      return productoEditado;
    };
    return product;
  });
  return productoEditado;
}
 /** Borra un producto*/
 async deleteProduct(id:string | number) {
  const res = await fetch('https://w370351.ferozo.com/api/products/' + id,
    {
      method: "DELETE",
      headers:{
        Authorization: "Bearer "+this.authService.token,
      },
    });
  if (!res.ok) return false;
  this.Product = this.Product.filter(Product => Product.id !== id);
  return true;
}
async toggleDestacado(id: string | number) {
  const res = await fetch('https://w370351.ferozo.com/api/products/' + id + '/destacado', 
    {
      method: "POST",
      headers:{
        Authorization: "Bearer "+this.authService.token,
      },
    });
  if (!res.ok) return;
/**edita la lista reemplazando solamente el que editamos  */
this.Product = this.Product.map(Product =>{
if (Product.id === id) {
  return {...Product, isDestacado: !Product.isDestacado};
};
return Product;
});
return true;
}
async toggleHappyHour(id: string | number, p0: { toggleHappyHour: boolean; }) {
  const res = await fetch('https://w370351.ferozo.com/api/products/' + id + '/hayppyhour', 
    {
      method: "PUT",
      headers:{
        Authorization: "Bearer "+this.authService.token,
      },
    });
  if (!res.ok) return;
/**edita la lista reemplazando solamente el que editamos  */
this.Product = this.Product.map(Product =>{
if (Product.id === id) {
  return {...Product, hasHappyHour: !Product.hasHappyHour};
};
return Product;
});
return true;
}
async toggleDiscount(id: string | number, p0: { discount: number; }) {
  const res = await fetch('https://w370351.ferozo.com/api/products/' + id + '/discount', 
    {
      method: "PUT",
      headers:{
        Authorization: "Bearer "+this.authService.token,
      },
    });
  if (!res.ok) return;

  this.Product = this.Product.map(Product =>{
if (Product.id === id) {
  return {...Product, hasDiscount: !Product.discount}; 
};
return Product;
});
return true;

}
}

 