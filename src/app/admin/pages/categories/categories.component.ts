import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {firstValueFrom} from "rxjs";
import {Category} from "../../../core/models/category";
import {CategoryService} from "../../../core/services/category.service";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgOptimizedImage} from "@angular/common";
import {TablerIconsModule} from "angular-tabler-icons";
import {CategoryDialogComponent} from "./category-dialog/category-dialog.component";
import {SweetAlertService} from "../../../core/services/sweet-alert.service";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    TablerIconsModule,
    MatTableModule,
    NgOptimizedImage,
    MatSlideToggleModule,
    MatPaginatorModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'category', 'description', 'active', 'actions'];
  dataSource = new MatTableDataSource<Category>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private categoryService: CategoryService, private alertService: SweetAlertService, private dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.categories().then();
  }

  private async categories(): Promise<void> {
    try {
      const categories = await firstValueFrom(this.categoryService.categories());
      this.dataSource.data = categories || [];
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.error('Error loading categories', error);
    }
  }

  openCategoryDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: category || {}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.categories().then();
    });
  }

  async confirmChange(event: any, category: Category): Promise<void> {
    const confirmed = await this.alertService.confirmationAlert("¿Quieres actualizar el estado?");
    if (confirmed.isConfirmed) {
      category.active = event.checked;
      await this.save(category);
    } else {
      await this.alertService.infoAlert('Operación cancelada.');
      await this.categories();
    }
  }

  private async save(category: Category): Promise<void> {
    try {
      await firstValueFrom(this.categoryService.save(category));
      await this.alertService.successAlert('Estado actualizado con éxito.');
      await this.categories();
    } catch (error) {
      await this.alertService.errorAlert('Error al guardar.');
    }
  }

  async delete(category: Category): Promise<void> {
    const confirmed = await this.alertService.confirmationAlert(`¿Seguro que quieres eliminar la categoría "${category.name}"?`);
    if (confirmed.isConfirmed) {
      try {
        if (category.key != null) {
          await firstValueFrom(this.categoryService.delete(category.key));
        }
        await this.alertService.successAlert('Categoría eliminada correctamente.');
        await this.categories();
      } catch (error) {
        await this.alertService.errorAlert('Error al eliminar.');
      }
    }
  }
}
