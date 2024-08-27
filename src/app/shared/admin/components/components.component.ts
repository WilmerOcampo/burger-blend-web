import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {Subscription} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Dir} from "@angular/cdk/bidi";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {HeaderComponent} from "./header/header.component";

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [
    Dir,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss'
})
export class ComponentsComponent implements OnInit {


  @ViewChild('leftsidenav')
  public sidenav: MatSidenav | any;

  //get options from service
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  //private htmlElement!: HTMLHtmlElement;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  constructor(private breakpointObserver: BreakpointObserver) {
    //this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes

        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];

        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
      });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
  }

}
