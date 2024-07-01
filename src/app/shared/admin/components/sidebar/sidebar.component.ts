import { Component } from '@angular/core';
import {MatNavList} from "@angular/material/list";
import {NgForOf} from "@angular/common";
import {NgScrollbar} from "ngx-scrollbar";
import {BrandingComponent} from "./branding.component";
import {NavItemComponent} from "./nav-item/nav-item.component";
import { navItems } from './sidebar-data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatNavList,
    NgForOf,
    NgScrollbar,
    BrandingComponent,
    NavItemComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  protected readonly navItems = navItems;
}
