import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  confirmationAlert(text: string): Promise<any> {
    return Promise.resolve(
      Swal.fire({
        title: text,
        //text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      })
    );
  }

  infoAlert(text: string): Promise<any> {
    return Promise.resolve(
      Swal.fire({
        icon: 'info',
        title: text,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
        //text: text
      })
    );
  }

  successAlert(text: string): Promise<any> {
    return Promise.resolve(
      Swal.fire({
          title: text,
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        }
      )
    );
  }

  errorAlert(text: string): Promise<any> {
    return Swal.fire({
      title: 'Error',
      text: text,
      icon: 'error',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });
  }
}
