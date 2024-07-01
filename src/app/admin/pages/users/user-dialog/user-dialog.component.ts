import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SweetAlertService} from "../../../../core/services/sweet-alert.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../../core/services/user.service";
import {User} from "../../../../core/models/user";
import {MatCardModule} from "@angular/material/card";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {TablerIconsModule} from "angular-tabler-icons";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ConfirmedValidator} from "../../../../core/utils/confirmed.validator";

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatFabButton,
    TablerIconsModule,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    MatButton
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent implements OnInit {
  userForm: FormGroup;
  initialUser: User;
  roles: string[];
  maxId: number = 0;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: SweetAlertService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.userForm = this.fb.group({
      key: [data?.key],
      id: [data?.id],
      name: [data?.name || '', Validators.required],
      lastname: [data?.lastname || '', Validators.required],
      username: [data?.username || '', Validators.required],
      email: [data?.email || '', Validators.required],
      phone: [data?.phone || '', Validators.required],
      image: [data?.image || '', Validators.required],
      address: [data?.address || '', Validators.required],
      password: [data?.password || '', Validators.required],
      repeatPassword: ['', [Validators.required]],
      role: [data?.role],
      active: [data?.active]
    }, {validator: ConfirmedValidator('password', 'repeatPassword')});
    delete this.userForm.value.repeatPassword; // Elimnar el campo repeatUsuario para no alterar los datos del User
    this.initialUser = {...this.userForm.value};
    this.roles = ["ADMIN", "USER"]
  }

  ngOnInit(): void {
    this.userService.maxId().subscribe(maxId => {
      this.maxId = maxId + 1;
    });

    if (this.data.key) {
      this.imagePreview = this.data.image
    }
  }

  get f() {
    return this.userForm.controls;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.userForm.patchValue({image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  }

  private async closeDialogWithAlert(message: string, isSuccess: boolean): Promise<void> {
    this.dialogRef.close();
    if (isSuccess) {
      await this.alertService.successAlert(message);
    } else {
      await this.alertService.infoAlert(message);
    }
  }

  async save(): Promise<void> {
    delete this.userForm.value.repeatPassword; // Eliminando repetaPassword para no mandar a la base de datos
    if (this.userForm.valid) {
      const user: User = {...this.userForm.value};
      if (this.data.id && this.initialUser.password !== user.password) {
        await this.closeDialogWithAlert("No se puede cambiar Password, solo los datos.", false);
        return;
      }

      if (JSON.stringify(this.initialUser) === JSON.stringify(user)) {
        await this.closeDialogWithAlert('Sin cambios.', false);
        return;
      }

      if (!user.id) {
        user.id = this.maxId;
        user.role = "USER";
        user.active = true;

        if (this.selectedFile) {
          this.userService.save(user, this.selectedFile).subscribe(async () => {
            await this.closeDialogWithAlert('Registro exitoso.', true);
          });
        }
      } else {
        const result = await this.alertService.confirmationAlert('¿Seguro de guardar los cambios?');
        if (result.isConfirmed) {
          if (this.selectedFile) {
            this.userService.save(user, this.selectedFile).subscribe(async () => {
              await this.closeDialogWithAlert('Datos actualizados.', true)
            })
          }
        } else {
          await this.closeDialogWithAlert("Operacion Cancelada", false)
        }
      }

      /*this.userService.save(user, this.selectedFile).subscribe(async () => {
        await this.closeDialogWithAlert(user.key ? 'Datos actualizados.' : 'Registro exitoso.', true);
      });*/
    }
  }
}
