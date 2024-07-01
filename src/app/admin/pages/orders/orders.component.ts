import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {SweetAlertService} from "../../../core/services/sweet-alert.service";
import {firstValueFrom} from "rxjs";
import {Order} from "../../../core/models/order";
import {OrderService} from "../../../core/services/order.service";
import {MatCardModule} from "@angular/material/card";
import {MatFabButton} from "@angular/material/button";
import {TablerIconsModule} from "angular-tabler-icons";
import {DecimalPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    MatCardModule,
    MatFabButton,
    MatTableModule,
    TablerIconsModule,
    MatPaginatorModule,
    NgForOf,
    DecimalPipe,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'user', 'product', 'instructions', 'total', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private orderService: OrderService, private dialog: MatDialog, private alertService: SweetAlertService) {
  }

  ngAfterViewInit() {
    this.orders().then();
  }

  private async orders(): Promise<void> {
    try {
      const orders = await firstValueFrom(this.orderService.orderWithItems());
      this.dataSource.data = orders || [];
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      await this.alertService.errorAlert('Error loading orders.');
      console.error('Error loading orders', error);
    }
  }
}
