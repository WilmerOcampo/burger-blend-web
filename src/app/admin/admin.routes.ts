import {Routes} from "@angular/router";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {FoodsComponent} from "./pages/foods/foods.component";
import {CategoriesComponent} from "./pages/categories/categories.component";
import {UsersComponent} from "./pages/users/users.component";
import {OrdersComponent} from "./pages/orders/orders.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";

export const adminRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Starter Page',
    },
  },
  {path: 'foods', component: FoodsComponent},
  {path: 'categories', component: CategoriesComponent},
  {path: 'users', component: UsersComponent},
  {path: 'orders', component: OrdersComponent},
  //{path: 'not-found', component: NotFoundComponent},
]
