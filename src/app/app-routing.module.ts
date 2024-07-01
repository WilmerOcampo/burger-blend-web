import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsComponent} from "./shared/admin/components/components.component";
import {AuthGuard} from "./core/guards/auth.guard";
import {AuthenticatedGuard} from "./core/guards/authenticated.guard";
import {NotFoundComponent} from "./admin/pages/not-found/not-found.component";

const routes: Routes = [
  {
    path: '',
    component: ComponentsComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.routes').then((m) => m.adminRoutes),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: 'not-found',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.authRoutes),
    canActivate: [AuthenticatedGuard],
  },
  {
    path: '**', redirectTo: 'not-found', pathMatch: 'full'
  },
  {path: 'not-found', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
