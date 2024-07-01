import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {SweetAlertService} from "../../../core/services/sweet-alert.service";
import {firstValueFrom} from "rxjs";
import {User} from "../../../core/models/user";
import {UserService} from "../../../core/services/user.service";
import {UserDialogComponent} from "./user-dialog/user-dialog.component";
import {MatCardModule} from "@angular/material/card";
import {MatFabButton} from "@angular/material/button";
import {TablerIconsModule} from "angular-tabler-icons";
import {NgOptimizedImage} from "@angular/common";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatCardModule,
    MatFabButton,
    TablerIconsModule,
    MatTableModule,
    NgOptimizedImage,
    MatSlideToggleModule,
    MatPaginatorModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'user', 'contact', 'active', 'actions'];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private dialog: MatDialog, private alertService: SweetAlertService) {
  }

  ngAfterViewInit() {
    this.users().then();
  }

  private async users(): Promise<void> {
    try {
      const users = await firstValueFrom(this.userService.users());
      this.dataSource.data = users || [];
      this.dataSource.paginator = this.paginator;
      console.log(users)
    } catch (error) {
      await this.alertService.errorAlert('Error loading users.');
      console.error('Error loading users', error);
    }
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '700px',
      height: '660px',
      data: user || {}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.users().then();
    });
  }

  async confirmChange(event: any, user: User): Promise<void> {
    const confirmed = await this.alertService.confirmationAlert("¿Quieres actualizar el estado?");
    if (confirmed.isConfirmed) {
      user.active = event.checked;
      await this.save(user);
    } else {
      await this.alertService.infoAlert('Operación cancelada.');
      await this.users();
    }
  }

  private async save(user: User): Promise<void> {
    try {
      await firstValueFrom(this.userService.updateActiveState(user.key, user.active));
      await this.alertService.successAlert('Estado actualizado con éxito.');
      await this.users();
    } catch (error) {
      await this.alertService.errorAlert('Error al guardar.');
    }
  }

  async delete(user: User): Promise<void> {
    const confirmed = await this.alertService.confirmationAlert(`¿Seguro que quieres eliminar: "${user.name}"?`);
    if (confirmed.isConfirmed) {
      try {
        if (user.key != null) {
          await firstValueFrom(this.userService.delete(user));
        }
        await this.alertService.successAlert('Eliminación exitosa.');
        await this.users();
      } catch (error) {
        await this.alertService.errorAlert('Error al eliminar.');
      }
    }
  }
}
