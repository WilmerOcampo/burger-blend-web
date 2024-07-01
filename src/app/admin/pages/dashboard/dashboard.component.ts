import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import {MatCard, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AsyncPipe, DatePipe, DecimalPipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {TablerIconsModule} from "angular-tabler-icons";
import {RouterLink} from "@angular/router";
import {MatTooltip} from "@angular/material/tooltip";
import {FoodService} from "../../../core/services/food.service";
import {Food} from "../../../core/models/food";
import {firstValueFrom, Observable, of} from "rxjs";
import {UserService} from "../../../core/services/user.service";
import {User} from "../../../core/models/user";
import {OrderService} from "../../../core/services/order.service";
import {Order} from "../../../core/models/order";

interface month {
  value: string;
  viewValue: string;
}

export interface profitExpanceChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

export interface trafficChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

export interface salesChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardTitle,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFabButton,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMiniFabButton,
    MatRow,
    MatRowDef,
    MatTableModule,
    NgApexchartsModule,
    NgForOf,
    TablerIconsModule,
    TitleCasePipe,
    MatMenuTrigger,
    NgIf,
    RouterLink,
    MatTooltip,
    AsyncPipe,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public profitExpanceChart!: Partial<profitExpanceChart> | any;
  public trafficChart!: Partial<trafficChart> | any;
  public salesChart!: Partial<salesChart> | any;

  users$: Observable<User[]> = of([]);
  orders$: Order[] = [];
  totalSales: number = 0;

  displayedColumns: string[] = ['profile', 'address', 'phone', 'active'];
  dataSource = this.users$;

  months: month[] = [
    {value: 'mar', viewValue: 'March 2023'},
    {value: 'apr', viewValue: 'April 2023'},
    {value: 'june', viewValue: 'June 2023'},
  ];

  /* Foods */
  foods$: Observable<Food[]> = of([]);

  ngOnInit() {
    this.foods$ = this.foodService.foods();
    this.users$ = this.userService.users();
    this.orderService.orderWithItems().subscribe(orders => {
      this.orders$ = orders;
      this.calculateTotalSales();
    });
  }

  calculateTotalSales() {
    this.totalSales = this.orders$.reduce((sum, order) => sum + order.total, 0);
  }

  constructor(private foodService: FoodService, private userService: UserService, private orderService: OrderService) {
    // sales overview chart
    this.profitExpanceChart = {
      series: [
        {
          name: 'Eanings this month',
          data: [9, 5, 3, 7, 5, 10, 3],
          color: '#0085db',
        },
        {
          name: 'Expense this month',
          data: [6, 3, 9, 5, 4, 6, 4],
          color: '#fb977d',
        },
      ],

      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 4,
          endingShape: "rounded",
        },
      },
      chart: {
        type: 'bar',
        height: 390,
        offsetY: 10,
        foreColor: '#adb0bb',
        fontFamily: 'inherit',
        toolbar: {show: false},
      },
      dataLabels: {enabled: false},
      markers: {size: 0},
      legend: {show: false},
      xaxis: {
        type: 'category',
        categories: ['Lun', 'Mar', 'Mie', 'jue', 'Vie', 'Sab', 'Dom'],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {cssClass: 'grey--text lighten-2--text fill-color'},
        },
      },
      stroke: {
        show: true,
        width: 5,
        colors: ['transparent'],
      },
      tooltip: {theme: 'light'},

      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 3,
              },
            },
          },
        },
      ],
    };

    // yearly breakup chart
    this.trafficChart = {
      series: [5368, 3500, 4106],
      labels: ['5368', 'Refferal Traffic', 'Oragnic Traffic'],
      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 160,
      },
      colors: ['#e7ecf0', '#fb977d', '#0085db'],
      plotOptions: {
        pie: {
          donut: {
            size: '80%',
            background: 'none',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '12px',
                color: undefined,
                offsetY: 5,
              },
              value: {
                show: false,
                color: '#98aab4',
              },
            },
          },
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 991,
          options: {
            chart: {
              width: 120,
            },
          },
        },
      ],
      tooltip: {
        enabled: false,
      },
    };

    // mohtly earnings chart
    this.salesChart = {
      series: [
        {
          name: '',
          color: '#8763da',
          data: [25, 66, 20, 40, 12, 58, 20],
        },
      ],

      chart: {
        type: 'area',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 60,
        sparkline: {
          enabled: true,
        },
        group: 'sparklines',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        colors: ['#8763da'],
        type: 'solid',
        opacity: 0.05,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };
  }

  protected readonly name = name;
}
