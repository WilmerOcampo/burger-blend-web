export interface OrderItem {
  key?: string;
  orderId: number;
  foodId: number;
  quantity: number;
  subtotal: number;

  foodName?: string;
  foodDescription?: string;
  foodImage?: string;
  categoryName?: string;
}
