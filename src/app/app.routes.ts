import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Perfil } from './pages/perfil/perfil';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ProductosEdicion } from './components/productos-edicion/productos-edicion';
import { CategoriasEdicion } from './components/categorias-edicion/categorias-edicion';
import { onlyLoggedUserGuard } from './guards/only-logged-user-guard';
import { onlyPublicUserGuard } from './guards/only-public-user-guard';
import { RestaurantsPage } from './pages/restaurants/restaurants';
import { RestaurantMenu } from './components/restaurant-menu/restaurant-menu';
import { Configuracion } from './pages/configuration/configuration';

export const routes: Routes = [
    
    {
        path: "Login",
        component: Login
    },
    {
        path: "Registro",
        component: Register
    },
    {
        path: "Perfil",
        component: Perfil,
        canActivate: [onlyLoggedUserGuard] 
    },
    {
        path: 'products/edit/:idProduct', 
        component: ProductosEdicion,
        canActivate: [onlyLoggedUserGuard] 
    },
    {
        path: 'categorias/edit/:idCategory', // :idCategory debe coincidir con el input del componente
        component: CategoriasEdicion,
        canActivate: [onlyLoggedUserGuard]
    },
    {
        path:"restaurants",
        component:RestaurantsPage,
    },
    {
        path: "restaurants-menu/:idRestaurant", 
        component: RestaurantMenu,
    },
    {
        path: 'profile/edit',
        component: Register,
        canActivate: [onlyLoggedUserGuard]
    },
    {
        path: "**",
        component: Home
    },
];


