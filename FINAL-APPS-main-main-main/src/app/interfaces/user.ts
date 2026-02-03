export interface User {
  restaurantName: string,
  password: string,
  firstName: string,
  lastName: string,
  address: string,
  phoneNumber: string,
  id: number
}

export type NewPerfil = Omit<User, "id" >;