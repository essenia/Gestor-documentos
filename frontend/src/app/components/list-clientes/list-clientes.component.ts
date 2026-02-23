import { Component, HostListener, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Cliente } from '../../interfaces/cliente';
import { ToastrService,ActiveToast } from 'ngx-toastr';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NavbarComponent } from "../navbar/navbar.component";
@Component({
  selector: 'app-list-clientes',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-clientes.component.html',
  styleUrl: './list-clientes.component.css'
})
export class ListClientesComponent implements OnInit  {
showScrollButton = false;
isAtBottom = false;

  selectedCliente: Cliente | null = null;  // Cliente seleccionado
mostrarModal: boolean = false; 
clientesFiltrados: Cliente[] = [];
textoBuscar: string = '';

   clientes: Cliente[] = [];
  paginatedClientes: Cliente[] = [];
  loading: boolean = false;


  mostrarFiltros: boolean = false;

filtro = {
  nombre: '',
  apellido: '',
    dni: '',

  activo: ''
};
  // Paginación simple
  currentPage: number = 1;
  pageSize: number = 8;
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
        this.clientesFiltrados = [...res]; 
               this.ordenarClientes();

        // this.totalPages = Math.ceil(this.clientes.length / this.pageSize);
              this.totalPages = Math.ceil(this.clientesFiltrados.length / this.pageSize);
               this.currentPage = 1;

        this.updatePagination();
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error('Error al cargar clientes');
      }
    });
  }
@HostListener('window:scroll', [])

  onWindowScroll() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  this.showScrollButton = scrollTop > 100;

  // Detecta si estás abajo del todo
  this.isAtBottom = scrollTop + windowHeight >= documentHeight - 50;
}


scrollAction() {
  if (this.isAtBottom) {
    // subir
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // bajar
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
}


 updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    // this.paginatedClientes = this.clientes.slice(start, end);
      this.paginatedClientes = this.clientesFiltrados.slice(start, end);
  this.totalPages = Math.ceil(this.clientesFiltrados.length / this.pageSize);
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
// ordenar por  nombre ASC
  ordenarClientes(): void {
  this.clientesFiltrados.sort((a, b) =>
    a.nombre?.toLowerCase().localeCompare(b.nombre?.toLowerCase())
  );
}

  //Buscador 

  buscarClientes(): void {
  const texto = this.textoBuscar.trim().toLowerCase();

  if (!texto) {
    this.clientesFiltrados = [...this.clientes];
  } else {
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombre?.toLowerCase().includes(texto) ||
      cliente.apellido?.toLowerCase().includes(texto) ||
      cliente.dni?.toLowerCase().includes(texto)
    );
  }

  this.currentPage = 1;
  this.updatePagination();
}

  editCliente(cliente: Cliente) {
    this.router.navigate(['/clientes/add-edit-cliente', cliente.id]);
  }

  // viewCliente(cliente: Cliente) {
  //   // Aquí podrías abrir un modal o redirigir a detalle
  //   this.toastr.info(`Cliente: ${cliente.nombre} ${cliente.apellido}`);
  // }

  // Función para abrir el modal
viewCliente(cliente: Cliente) {
  this.selectedCliente = cliente;
  this.mostrarModal = true;
}

// Función para cerrar el modal
cerrarModal() {
  this.mostrarModal = false;
  this.selectedCliente = null;
}
filtrarClientes(): void {
  this.clientesFiltrados = this.clientes.filter(c => {
    const nombreMatch = c.nombre?.toLowerCase().includes(this.filtro.nombre.toLowerCase());
    const apellidoMatch = c.apellido?.toLowerCase().includes(this.filtro.apellido.toLowerCase());
    const dniMatch = c.dni?.toLowerCase().includes(this.filtro.dni.toLowerCase());

    let activoMatch = true;
    if (this.filtro.activo === 'true') activoMatch = c.activo === true;
    else if (this.filtro.activo === 'false') activoMatch = c.activo === false;

    return nombreMatch && apellidoMatch && dniMatch && activoMatch;
  });

  this.currentPage = 1;
  this.updatePagination();
}



limpiarFiltros(): void {
  this.filtro = { nombre: '', apellido: '', dni: '', activo: '' };
  this.clientesFiltrados = [...this.clientes];
  this.currentPage = 1;
  this.updatePagination();
}



volverInicio() {
  this.router.navigate(['/navbar']);
}


deleteCliente(cliente: Cliente) {
  // Confirmación nativa (evita problemas de sanitización)
  const mensaje = `¿Deseas marcar como NO ACTIVO al cliente ${cliente.nombre} ${cliente.apellido}?`;
  
  if (confirm(mensaje)) {
    // Llamada al backend
    this.clienteService.desactivarCliente(cliente.id!).subscribe({
      next: (res) => {
        // Actualizar objeto cliente local
        cliente.activo = false;

        // Refrescar arrays para que Angular detecte el cambio
        this.clientes = [...this.clientes];
        this.filtrarClientes(); // refresca paginación y tabla

        // Mensaje de éxito
        this.toastr.success('Cliente marcado como no activo');
      },
      error: () => {
        this.toastr.error('Error al marcar cliente como no activo');
      }
    });
  }
}

}
