import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {from, map, Observable} from "rxjs";
import {Category} from "../models/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private basePath = 'categories';
  private categoriesRef: AngularFireList<Category>;

  constructor(db: AngularFireDatabase) {
    this.categoriesRef = db.list(this.basePath);
  }

  categories(): Observable<Category[]> {
    return this.categoriesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          key: c.key as string,
          ...(c.payload.val() as Category)
        }))
      )
    );
  }

  create(category: Category): Observable<void> {
    return from(this.categoriesRef.push(category)).pipe(
      map(() => void 0)
    );
  }

  update(key: string, category: Category): Observable<void> {
    return from(this.categoriesRef.update(key, category)).pipe(
      map(() => void 0)
    );
  }

  delete(key: string): Observable<void> {
    return from(this.categoriesRef.remove(key)).pipe(
      map(() => void 0)
    );
  }

  save(category: Category): Observable<void> {
    if (category.key) {
      return this.update(category.key, category);
    } else {
      return this.create(category);
    }
  }
  maxId(): Observable<number> {
    return this.categoriesRef.valueChanges().pipe(
      map(categories => Math.max(...categories.map(category => category.id), 2000))
    );
  }
}
