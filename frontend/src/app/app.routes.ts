import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LoginComponent } from './components/login/login.component';
import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { roleGuardGuard } from './guards/role-guard.guard';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { AddEditClienteComponent } from './components/clientes/add-edit-cliente/add-edit-cliente.component';
import { ListClientesComponent } from './components/list-clientes/list-clientes.component';

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
    path: 'listusers',
    component: ListUsersComponent,
    canActivate: [roleGuardGuard],
    data: { roles: ['ADMIN'] } // solo ADMIN puede acceder
  },
  {
  path: 'change-password',
  component: ChangePasswordComponent
},
  // CLIENTES (ADMIN + ABOGADA)
  {
    path: 'clientes/add',

    component: AddEditClienteComponent,
    
    // canActivate: [roleGuardGuard],
    // data: { roles: ['ADMIN', 'ABOGADA'] }
  },
    // Listado de clientes
  {
    path: 'clientes',
    component: ListClientesComponent,
    canActivate: [roleGuardGuard],
    data: { roles: ['ABOGADA', 'ADMIN'] } // Solo estos roles pueden ver
  },

    { path: 'clientes/editar/:id', component: AddEditClienteComponent },

    {path:'login', component:LoginComponent},
    {path:'signIn',component: SignInComponent},
    {path:'dashboard',component: DashboardComponent},
        {path:'navbar',component: NavbarComponent},


        {path:'**',redirectTo: '/login', pathMatch:'full'}


];
