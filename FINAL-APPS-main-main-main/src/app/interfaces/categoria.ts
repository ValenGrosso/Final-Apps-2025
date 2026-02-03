export interface Categoria {
    id: number,
    name: string,
    restaurantId: number,
}

export type NewCategory = Omit<Categoria, "id">;

export interface UpdateCategoryRequestDto {
  name: string;
}