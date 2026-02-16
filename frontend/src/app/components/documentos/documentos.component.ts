import { Component, OnInit } from '@angular/core';
import { TipoDocumento } from '../../interfaces/TipoDocumento';
import { TipoDocumentoService } from '../../services/tipo-documento.service';

@Component({
  selector: 'app-documentos',
  imports: [],
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
