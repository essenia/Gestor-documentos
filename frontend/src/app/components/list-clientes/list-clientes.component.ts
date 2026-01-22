import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Cliente } from '../../interfaces/cliente';
import { ToastrService } from 'ngx-toastr';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-list-clientes',
  imports:  [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-clientes.component.html',
  styleUrl: './list-clientes.component.css'
})
export class ListClientesComponent implements OnInit  {

   clientes: Cliente[] = [];
  paginatedClientes: Cliente[] = [];
  loading: boolean = false;

  // Paginación simple
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(
    private clienteService: ClientService,
    private toastr: ToastrService,
    public router: Router
  ) {}
   ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.loading = true;
    this.clienteService.getClientes().subscribe({
      next: (res: Cliente[]) => {
        this.clientes = res;
        this.totalPages = Math.ceil(this.clientes.length / this.pageSize);
        this.updatePagination();
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error('Error al cargar clientes');
      }
    });
  }
 updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedClientes = this.clientes.slice(start, end);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
 goToPage(page: number, event: Event) {
    event.preventDefault();
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage(event: Event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
   nextPage(event: Event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  editCliente(cliente: Cliente) {
    this.router.navigate(['/clientes/add-edit-cliente', cliente.id]);
  }

  viewCliente(cliente: Cliente) {
    // Aquí podrías abrir un modal o redirigir a detalle
    this.toastr.info(`Cliente: ${cliente.nombre} ${cliente.apellido}`);
  }

  //  deleteCliente(cliente: Cliente) {
  //   if (!confirm(`¿Eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`)) return;

  //   this.clienteService.deleteCliente(cliente.id!).subscribe({
  //     next: () => {
  //       this.toastr.success('Cliente eliminado');
  //       this.getClientes();
  //     },
  //     error: (e: HttpErrorResponse) => {
  //       this.toastr.error('Error al eliminar cliente');
  //     }
  //   });
  // }
}
