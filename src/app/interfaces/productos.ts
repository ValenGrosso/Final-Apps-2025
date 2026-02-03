export interface Producto {
    name: string,
    description: string,
    price: number,
    categoryId: number,
    featured: boolean,
    labels: string[],
    recommendedFor: number,
    discount: number,
    hasHappyHour: boolean,
    id: number,
    isDestacado: boolean,
    restaurantId: number,
}
export type NewProduct = Omit<Producto, "id">;