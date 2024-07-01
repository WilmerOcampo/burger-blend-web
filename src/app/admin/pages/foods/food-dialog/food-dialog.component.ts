import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Food} from "../../../../core/models/food";
import {FoodService} from "../../../../core/services/food.service";
import {SweetAlertService} from "../../../../core/services/sweet-alert.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatFabButton} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Category} from "../../../../core/models/category";
import {CategoryService} from "../../../../core/services/category.service";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {TablerIconsModule} from "angular-tabler-icons";

@Component({
  selector: 'app-food-dialog',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgForOf,
    MatSlideToggleModule,
    MatFabButton,
    TablerIconsModule,
  ],
  templateUrl: './food-dialog.component.html',
  styleUrl: './food-dialog.component.scss'
})
export class FoodDialogComponent implements OnInit {

  foodForm: FormGroup;
  initialFood: Food;
  categories: Category[] = [];
  maxId: number = 0;

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private categoryService: CategoryService,
    private alertService: SweetAlertService,
    private dialogRef: MatDialogRef<FoodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Food
  ) {
    this.foodForm = this.fb.group({
      key: [data?.key],
      id: [data?.id],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '', Validators.required],
      image: [data?.image || '', Validators.required],
      price: [data?.price || '', Validators.required],
      category: [data?.category || '', Validators.required],
      active: [data?.active],
    });
    this.initialFood = {...this.foodForm.value};
  }

  ngOnInit(): void {
    this.categoryService.categories().subscribe(categories => {
      this.categories = categories;
    });
    this.foodService.maxId().subscribe(maxId => {
      this.maxId = maxId + 1;
    });
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
    if (this.foodForm.valid) {
      const food: Food = {
        ...this.foodForm.value,
        price: +this.foodForm.value.price // Convertir el precio a número
      };

      if (JSON.stringify(this.initialFood) === JSON.stringify(food)) {
        await this.closeDialogWithAlert('Sin cambios.', false);
        return;
      }

      if (!food.id) {
        food.id = this.maxId;
        food.active = true;
        this.foodService.save(food).subscribe(async () => {
          await this.closeDialogWithAlert('Nuevo producto registrado.', true);
        });
      } else {
        const result = await this.alertService.confirmationAlert('¿Seguro de guardar los cambios?');
        if (result.isConfirmed) {
          this.foodService.save(food).subscribe(async () => {
            await this.closeDialogWithAlert('Datos del producto actualizados.', true);
          });
        } else {
          await this.closeDialogWithAlert('Operación cancelada.', false);
        }
      }
    }
  }
}
