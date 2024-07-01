import {inject, Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {catchError, from, map, Observable, of, switchMap} from "rxjs";
import {User} from "../models/user";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FileService} from "./file.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private basePath = 'users';
  private usersRef: AngularFireList<User>;
  private fileService = inject(FileService)

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage, private afAuth: AngularFireAuth) {
    this.usersRef = db.list(this.basePath);
  }

  users(): Observable<User[]> {
    return this.usersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          key: c.key as string,
          ...(c.payload.val() as User)
        }))
      )
    );
  }

  userByUID(uid: string): Observable<User | null> {
    return this.db.list<User>(this.basePath, ref => ref.orderByChild('uid').equalTo(uid))
      .valueChanges()
      .pipe(
        map(users => users.length > 0 ? users[0] : null)
      );
  }

  create(user: User): Observable<void> {
    return from(this.afAuth.createUserWithEmailAndPassword(user.email, user.password)).pipe(
      switchMap(credential => {
        user.uid = credential.user?.uid;
        const {key, ...userData} = user;
        return this.usersRef.push(user)
      }),
      map(() => void 0)
    );
  }

  update(key: string | undefined, user: User): Observable<void> {
    return from(this.usersRef.update(key!, user)).pipe(
      map(() => void 0)
    );
  }

  delete(user: User) {
    const fileName = this.fileService.findFileNameByUrl(user.image)
    this.fileService.deleteFile(`${this.basePath}/${fileName}`)
    return from(this.usersRef.remove(user.key).then());
  }

  save(user: User, file: File): Observable<void> {
    const fileName = `${Date.now()}_${user.lastname}_${user.name}`;
    /*const userInit = this.findByKey(user.key)
    const fName = this.fileService.findFileNameByUrl(userInit.image)
    console.log('esta es filename: ', fName);
    this.fileService.deleteFile(`${this.basePath}/${fName}`).subscribe();*/

    return this.fileService.uploadFile(file, this.basePath, fileName).pipe(
      switchMap((imageUrl: string) => {
        user.image = imageUrl;
        if (user.key) {
          return this.update(user.key, user);
        } else {
          return this.create(user);
        }
      })
    );
  }

  updateActiveState(key?: string, active?: boolean): Observable<void> {
    const userRef = this.db.object(`${this.basePath}/${key}`);
    return from(userRef.update({active: active}));
  }

  maxId(): Observable<number> {
    return this.usersRef.valueChanges().pipe(
      map(users => Math.max(...users.map(user => user.id), 1000))
    );
  }

  findByKey(key?: string): Observable<User | null> {
    if (!key) {
      return of(null);
    }
    return this.db.object<User>(`${this.basePath}/${key}`).valueChanges().pipe(
      map(user => user ? {...user} : null),
      catchError(error => {
        console.error('Error fetching user by key:', error);
        return of(null);
      })
    );
  }
}
