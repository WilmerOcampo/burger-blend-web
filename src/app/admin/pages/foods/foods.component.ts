import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatFabButton} from "@angular/material/button";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Food} from "../../../core/models/food";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {FoodService} from "../../../core/services/food.service";
import {MatDialog} from "@angular/material/dialog";
import {firstValueFrom} from "rxjs";
import {DecimalPipe, NgOptimizedImage} from "@angular/common";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FoodDialogComponent} from "./food-dialog/food-dialog.component";
import {SweetAlertService} from "../../../core/services/sweet-alert.service";

@Component({
  selector: 'app-foods',
  standalone: true,
    imports: [
        MatCardModule,
        MatFabButton,
        TablerIconsModule,
        MatTableModule,
        NgOptimizedImage,
        MatSlideToggleModule,
        MatPaginatorModule,
        DecimalPipe
    ],
  templateUrl: './foods.component.html',
  styleUrl: './foods.component.scss'
})
export class FoodsComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'food', 'description', 'price', 'active', 'actions'];
  dataSource = new MatTableDataSource<Food>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private foodService: FoodService, private dialog: MatDialog, private alertService: SweetAlertService) {
  }

  ngAfterViewInit() {
    this.foods().then();
  }

  private async foods(): Promise<void> {
    try {
      const foods = await firstValueFrom(this.foodService.foods());
      this.dataSource.data = foods || [];
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.error('Error loading foods', error);
    }
  }

  openFoodDialog(food?: Food): void {
    const dialogRef = this.dialog.open(FoodDialogComponent, {
      width: '500px',
      height: '660px',
      data: food || {}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.foods().then();
    });
  }

  async confirmChange(event: any, food: Food): Promise<void> {
    const confirmed = await this.alertService.confirmationAlert("¿Quieres actualizar el estado?");
    if (confirmed.isConfirmed) {
      food.active = event.checked;
      await this.save(food);
    } else {
      await this.alertService.infoAlert('Operación cancelada.');
      await this.foods();
    }
  }

  private async save(food: Food): Promise<void> {
    try {
      await firstValueFrom(this.foodService.save(food));
      await this.alertService.successAlert('Estado actualizado con éxito.');
      await this.foods();
    } catch (error) {
      await this.alertService.errorAlert('Error al guardar.');
    }
  }

  async delete(food: Food): Promise<void> {
    const confirmed = await this.alertService.confirmationAlert(`¿Seguro que quieres eliminar: "${food.name}"?`);
    if (confirmed.isConfirmed) {
      try {
        if (food.key != null) {
          await firstValueFrom(this.foodService.delete(food.key));
        }
        await this.alertService.successAlert('Eliminación exitosa.');
        await this.foods();
      } catch (error) {
        await this.alertService.errorAlert('Error al eliminar.');
      }
    }
  }
}
