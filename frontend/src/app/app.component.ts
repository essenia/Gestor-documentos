import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { FormsModule, NgModel } from '@angular/forms'; 
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { ToastrModule } from 'ngx-toastr';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AuthServiceService } from './services/auth-service.service';


@Component({
  selector: 'app-root',
  imports: [NavbarComponent,RouterModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

   isLoggedIn = false;

  constructor(public authService: AuthServiceService) {
    this.authService.isLoggedIn$.subscribe(
      status => this.isLoggedIn = status
    );
  }


}
