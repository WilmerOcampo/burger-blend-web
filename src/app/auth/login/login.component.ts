import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../core/models/user";
import {UserDialogComponent} from "../../admin/pages/users/user-dialog/user-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {SweetAlertService} from "../../core/services/sweet-alert.service";
import {AuthService} from "../../core/services/auth.service";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private alertService: SweetAlertService,
    private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    const login: User = this.loginForm.value;
    this.authService.login(login.email, login.password).then(() => {
      this.router.navigateByUrl("/").then(r => {
        this.alertService.successAlert("Bienvenido a Burger Blend")
      });
    }).catch(() => {
      this.alertService.errorAlert('Inicio de Sesión Fallido');
    });
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '700px',
      height: '660px',
      data: user || {}
    });
    dialogRef.afterClosed()/*.subscribe(() => {
      this.users().then();
    });*/
  }

}
