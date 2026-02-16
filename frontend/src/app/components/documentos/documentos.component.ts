import { Component, OnInit } from '@angular/core';
import { TipoDocumento } from '../../interfaces/TipoDocumento';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CasoService } from '../../services/caso.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documentos',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css'
})
export class DocumentosComponent implements OnInit  {


   tiposDocumento: TipoDocumento[] = [];
  tipoSeleccionado!: number;

 

    constructor(private tipoDocumentoService: TipoDocumentoService) {}

     ngOnInit(): void {
    this.tipoDocumentoService.getTiposDocumento().subscribe({
      next: (res) => this.tiposDocumento = res,
      error: (err) => console.error(err)
    });
  }

  
}
