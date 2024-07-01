import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatBadgeModule} from "@angular/material/badge";
import {MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {NgScrollbar} from "ngx-scrollbar";
import {TablerIconsModule} from "angular-tabler-icons";
import {AuthService} from "../../../../core/services/auth.service";
import {User} from "../../../../core/models/user";
import {switchMap} from "rxjs";
import {UserService} from "../../../../core/services/user.service";
import {UserDialogComponent} from "../../../../admin/pages/users/user-dialog/user-dialog.component";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,

    TablerIconsModule,
    MatButtonModule,
    MatBadgeModule,

    NgScrollbar,
    NgIf,
    MatMenu,
    MatIcon,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  user: User | null = null;

  constructor(public dialog: MatDialog, private authService: AuthService, private userService: UserService) {
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authService.currentUserUID()
      .pipe(switchMap(uid => uid ? this.userService.userByUID(uid) : [null]))
      .subscribe(user => {
        this.user = user;
      });
  }


  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '700px',
      height: '660px',
      data: user || {}
    });
    dialogRef.afterClosed()/*.subscribe(() => {
      this.users().then();
    });*/
  }
}
