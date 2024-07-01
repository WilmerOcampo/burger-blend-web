import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {map, Observable, switchMap} from "rxjs";
import {FoodService} from "./food.service";
import {UserService} from "./user.service";
import {Order} from "../models/order";
import {OrderItem} from "../models/order-item";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private basePath = 'orders';
  private pathItem = 'orderItems';
  private ordersRef: AngularFireList<Order>;
  private itemsRef: AngularFireList<OrderItem>

  constructor(db: AngularFireDatabase, private foodService: FoodService, private userService: UserService) {
    this.ordersRef = db.list(this.basePath);
    this.itemsRef = db.list(this.pathItem);
  }

  findAllOrders(): Observable<Order[]> {
    return this.ordersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          key: c.key as string,
          ...(c.payload.val() as Order)
        }))
      )
    );
  }

  orders(): Observable<Order[]> {
    return this.findAllOrders().pipe(
      switchMap(orders => {
        const userId = orders.map(order => order.userId);
        return this.userService.users().pipe(
          map(users => {
            return orders.map(order => {
              const user = users.find(u => u.id === order.userId);
              if (user) {
                order.userName = user.name + " " + user.lastname;
                order.userAddress = user.address
                order.userImage = user.image;
                order.userContact = user.email + ' | ' + user.phone;
              }
              return order;
            });
          })
        );
      })
    );
  }

  findAllItems(): Observable<OrderItem[]> {
    return this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          key: c.key as string,
          ...(c.payload.val() as OrderItem)
        }))
      )
    );
  }

  orderItems(): Observable<OrderItem[]> {
    return this.findAllItems().pipe(
      switchMap(items => {
        const foodId = items.map(item => item.foodId);
        return this.foodService.foods().pipe(
          map(foods => {
            return items.map(item => {
              const food = foods.find(f => f.id === item.foodId);
              if (food) {
                item.foodName = food.name;
                item.foodDescription = food.description;
                item.foodImage = food.image;
                item.categoryName = food.categoryName;
              }
              return item;
            });
          })
        );
      })
    );
  }

  orderWithItems(): Observable<Order[]> {
    return this.orders().pipe(
      switchMap(orders => {
        return this.orderItems().pipe(
          map(items => {
            const groupedItems: { [key: number]: OrderItem[] } = {};
            items.forEach(item => {
              if (!groupedItems[item.orderId]) {
                groupedItems[item.orderId] = [];
              }
              groupedItems[item.orderId].push(item);
            });

            return orders.map(order => {
              order.orderItems = groupedItems[order.id] || [];
              return order;
            });
          })
        );
      })
    );
  }
}
