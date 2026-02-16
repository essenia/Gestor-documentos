import { Component, OnInit  } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { CasoService } from '../../services/caso.service';

@Component({
  selector: 'app-casos',
  imports: [],
  templateUrl: './casos.component.html',
  styleUrl: './casos.component.css'
})
export class CasosComponent implements OnInit {

  clientes: any[] = [];
  tramites: any[] = [];
  idClienteSeleccionado!: number;
  idTramiteSeleccionado!: number;

  casoCreado: any = null;
  documentosCaso: any[] = [];

    constructor(private clientService: ClientService, private casoService: CasoService) {}


    ngOnInit(): void {
    this.clientService.getClientes().subscribe(res => this.clientes = res);

    // Suponiendo que tienes endpoint para tramites
    this.casoService.getTramites().subscribe(res => this.tramites = res);
  }


  crearCaso() {
    if (!this.idClienteSeleccionado || !this.idTramiteSeleccionado) return;

    this.casoService.crearCaso(this.idClienteSeleccionado, this.idTramiteSeleccionado)
      .subscribe(res => {
        this.casoCreado = res.caso;
        this.documentosCaso = res.documentos;
      });
  }
   subirArchivo(event: any, idDocumento: number) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.casoService.subirDocumento(idDocumento, file)
      .subscribe(res => {
        const index = this.documentosCaso.findIndex(d => d.id === idDocumento);
        if (index !== -1) this.documentosCaso[index] = res.documento;
      });
  }

  validarDocumento(idDocumento: number, estado: string) {
    this.casoService.validarDocumento(idDocumento, estado)
      .subscribe(res => {
        const index = this.documentosCaso.findIndex(d => d.id === idDocumento);
        if (index !== -1) this.documentosCaso[index] = res.documento;
      });
  }
}
 
