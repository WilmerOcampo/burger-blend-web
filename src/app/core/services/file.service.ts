import {Injectable} from '@angular/core';
import {from, Observable, switchMap} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private storage: AngularFireStorage) {
  }

  uploadFile(file: File, basePath: string, fileName: string): Observable<string> {
    const filePath = `${basePath}/${fileName}`;
    const ref = this.storage.ref(filePath);
    return from(this.storage.upload(filePath, file)).pipe(
      switchMap(() => ref.getDownloadURL())
    );
  }

  deleteFile(fileName: string): Observable<void> {
    const ref = this.storage.ref(fileName);
    return from(ref.delete());
  }

  findFileNameByUrl(url: string): string {
    const decodedUrl = decodeURIComponent(url);
    const urlSegments = decodedUrl.split('/');
    return urlSegments[urlSegments.length - 1].split('?')[0];
  }
}
