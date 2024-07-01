import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {from, map, Observable, switchMap} from "rxjs";
import {Food} from "../models/food";
import {CategoryService} from "./category.service";
import {Category} from "../models/category";

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private basePath = 'foods';
  private foodsRef: AngularFireList<Category>;

  constructor(private db: AngularFireDatabase, private categoryService: CategoryService) {
    this.foodsRef = db.list(this.basePath);
  }

  findAll(): Observable<Food[]> {
    return this.foodsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          key: c.key as string,
          ...(c.payload.val() as Food)
        }))
      )
    );
  }

  foodById(id: number): Observable<Food | null> {
    return this.db.object<Food>(`${this.basePath}/${id}`).valueChanges();
  }

  create(food: Food): Observable<void> {
    return from(this.foodsRef.push(food)).pipe(
      map(() => void 0)
    );
  }

  update(key: string, food: Food): Observable<void> {
    return from(this.foodsRef.update(key, food)).pipe(
      map(() => void 0)
    );
  }

  delete(key: string): Observable<void> {
    return from(this.foodsRef.remove(key)).pipe(
      map(() => void 0)
    );
  }

  save(food: Food): Observable<void> {
    delete food.categoryName;
    if (food.key) {
      return this.update(food.key, food);
    } else {
      return this.create(food);
    }
  }

  maxId(): Observable<number> {
    return this.foodsRef.valueChanges().pipe(
      map(foods => Math.max(...foods.map(food => food.id), 0))
    );
  }

  foods(): Observable<Food[]> {
    return this.findAll().pipe(
      switchMap(foods => {
        const categoryIds = foods.map(food => food.category);
        return this.categoryService.categories().pipe(
          map(categories => {
            return foods.map(food => {
              const category = categories.find(cat => cat.id === food.category);
              if (category) {
                food.categoryName = category.name;
              }
              return food;
            });
          })
        );
      })
    );
  }
}
