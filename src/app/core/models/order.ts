import {OrderItem} from "./order-item";

export interface Order {
  key?: string;
  id: number;
  userId: number;
  orderDate: string;
  total: number;
  orderItems: OrderItem[];
  instructions: string;
  userName?: string;

  userImage?: string;
  userAddress?: string;
  userContact?: string;
}
