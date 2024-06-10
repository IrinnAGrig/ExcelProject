import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [{ path: '', redirectTo: 'auth', pathMatch: 'full' },
{
  path: 'auth',
  loadChildren: () =>
    import('./auth/auth.module').then(m => m.AuthModule),
},
{
  path: '',
  canActivateChild: [AuthGuard],
  children: [
    {
      path: 'home',
      loadChildren: () =>
        import('./home/home.module').then(m => m.HomeModule),
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '',
          loadChildren: () =>
            import('./dashboard/dashboard.module').then(
              m => m.DashboardModule
            ),
        },
        {
          path: ':file',
          loadChildren: () =>
            import('./dashboard/dashboard.module').then(
              m => m.DashboardModule
            ),
        },
      ]

    },

  ],
},
{
  path: '**',
  redirectTo: 'auth',
}];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
