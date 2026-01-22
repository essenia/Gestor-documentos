import { Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';


import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-list-users',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent implements OnInit  {


    users: any[] = [];
      paginatedUsers: any[] = [];  // Solo los usuarios que se muestran en la página actual

  loading: boolean = false;
   // Paginación
  currentPage: number = 1;
  pageSize: number = 10; // 10 usuarios por página
  totalPages: number = 1;
  pages: number[] = [];
constructor (private userService: UserService, private toastr: ToastrService){
}
  ngOnInit() {
    this.fetchUsers();
  }
fetchUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (res: any[]) => {
        this.users = res;
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.setPage(1);
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al cargar usuarios');
        this.loading = false;
      }
    });
  }

    setPage(page: number) {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
  }
  
  goToPage(page: number, event: Event) {
    event.preventDefault();
    this.setPage(page);
  }
    prevPage(event: Event) {
    event.preventDefault();
    if (this.currentPage > 1) this.setPage(this.currentPage - 1);
  }
    nextPage(event: Event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages) this.setPage(this.currentPage + 1);
  }
   viewUser(user: any) { console.log('Ver usuario:', user); }
  editUser(user: any) { console.log('Editar usuario:', user); }
  deleteUser(user: any) { console.log('Eliminar usuario:', user); }
}
