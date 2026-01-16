import { LoginComponent } from './components/login/login.component';
import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';

export const routes: Routes = [

   { path: '', redirectTo: '/login', pathMatch: 'full' },

    {path:'login', component:LoginComponent},
    {path:'signIn',component: SignInComponent},
    {path:'dashboard',component: DashboardComponent},
        {path:'navbar',component: NavbarComponent},


        {path:'**',redirectTo: '/login', pathMatch:'full'}


];
