import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MatListItem, MatListItemIcon, MatListSubheaderCssMatStyler} from "@angular/material/list";
import {NgClass, NgIf} from "@angular/common";
import {TablerIconsModule} from "angular-tabler-icons";
import {NavItem} from "./nav-item";
import {NavService} from "../../../../../core/services/nav.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [
    MatListItem,
    MatListItemIcon,
    MatListSubheaderCssMatStyler,
    NgIf,
    TablerIconsModule,
    NgClass
  ],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss'
})
export class NavItemComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
      }
    });
  }

  @Input() item: NavItem | any;
  @Input() depth: any;

  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]).then();
    }

    // scroll
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0,
    });
  }
}
