import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgForOf} from "@angular/common";
import {Category} from "../../../../core/models/category";
import {CategoryService} from "../../../../core/services/category.service";
import {SweetAlertService} from "../../../../core/services/sweet-alert.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FoodDialogComponent} from "../../foods/food-dialog/food-dialog.component";
import {MatIcon} from "@angular/material/icon";
import {TablerIconsModule} from "angular-tabler-icons";

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSlideToggle,
    NgForOf,
    ReactiveFormsModule,
    MatIcon,
    MatFabButton,
    TablerIconsModule
  ],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss'
})
export class CategoryDialogComponent implements OnInit {

  categoryForm: FormGroup;
  initialCategory: Category;
  maxId: number = 0;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private alertService: SweetAlertService,
    private dialogRef: MatDialogRef<FoodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category
  ) {
    this.categoryForm = this.fb.group({
      key: [data?.key],
      id: [data?.id],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '', Validators.required],
      image: [data?.image || '', Validators.required],
      active: [data?.active],
    });
    this.initialCategory = {...this.categoryForm.value};
  }

  ngOnInit(): void {
    this.categoryService.maxId().subscribe(maxId => {
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
    if (this.categoryForm.valid) {
      const category: Category = this.categoryForm.value;

      if (JSON.stringify(this.initialCategory) === JSON.stringify(category)) {
        await this.closeDialogWithAlert('Ningún cambio en los datos.', false);
        return;
      }

      if (!category.key) {
        category.id = this.maxId;
        category.active = true;
      }

      this.categoryService.save(category).subscribe({
        next: async () => {
          await this.closeDialogWithAlert(
            category.key ? 'Datos actualizados.' : 'Nuevo registro existoso.',
            true
          );
        },
        error: async (error) => {
          console.error('Error al guardar la categoría:', error);
          await this.closeDialogWithAlert('Error al guardar los datos.', false);
        }
      });
    }
  }
}
