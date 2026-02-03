export interface Perfil {
  id: number;
  restaurantName: string;
  firstName: string;
  lastName: string;
  address: string;
  detalleEntrega?: string;
  phoneNumber?: string;
  password?: string;
}