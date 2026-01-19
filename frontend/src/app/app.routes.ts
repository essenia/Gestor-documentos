import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LoginComponent } from './components/login/login.component';
import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { roleGuardGuard } from './guards/role-guard.guard';

export const routes: Routes = [

   { path: '', redirectTo: '/login', pathMatch: 'full' },
      // Dashboard público para todos logueados
  { path: 'dashboard', component: DashboardComponent },



  // ADMIN + ABOGADA
  {
    path: 'sign',
    component: SignInComponent,
    canActivate: [roleGuardGuard],
    data: { roles: ['ADMIN', 'ABOGADA'] } // admin o abogada
  },
  {
  path: 'change-password',
  component: ChangePasswordComponent
},
    {path:'login', component:LoginComponent},
    {path:'signIn',component: SignInComponent},
    {path:'dashboard',component: DashboardComponent},
        {path:'navbar',component: NavbarComponent},


        {path:'**',redirectTo: '/login', pathMatch:'full'}


];
