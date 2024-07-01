import {Component} from '@angular/core';
import {MatSidenavModule} from "@angular/material/sidenav";
import {RouterModule} from "@angular/router";
import {MatFabButton} from "@angular/material/button";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterModule,
    MatFabButton
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
