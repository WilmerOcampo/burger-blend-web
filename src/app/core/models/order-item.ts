export interface OrderItem {
  key?: string;
  orderKey: string;
  foodId: number;
  quantity: number;
  subtotal: number;

  foodName?: string;
  foodDescription?: string;
  foodImage?: string;
  categoryName?: string;
}
