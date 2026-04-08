import { CasoService } from './../../services/caso.service';
import { Component, OnInit,AfterViewInit  } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { Cliente } from '../../interfaces/cliente';
import { ClientService } from '../../services/client.service';
import { ListUsersComponent } from "../list-users/list-users.component";
import { Caso } from '../../interfaces/caso';
import { Chart } from 'chart.js/auto';



interface Persona {
  nombre: string;
  apellido: string;
  estado?: string; // Opcional para clientes
}
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CommonModule,
    FormsModule,
    RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
   rolUsuario: string = ''; //  aquí se guarda el rol actual

    totalClientes = 0;
  totalAbogadas = 0;
  casosActivos = 0;
  nuevosClientes = 0;
  ultimosClientes: Cliente[] = [];

  ultimasAbogadas: Persona[] = [];


     casos: Caso[] = [];
     casosAtrasados: Caso[] = [];

  loading = true;
    chart: any;
modoOscuro = false;

  constructor(private auth: AuthServiceService,private usuariosService: ClientService, private casoService:CasoService ) {}

  ngOnInit(): void {
     this.modoOscuro = localStorage.getItem('darkMode') === 'true';

  if (this.modoOscuro) {
    document.body.classList.add('dark-mode');
  }
    this.rolUsuario = this.auth.getRol(); // obtiene el rol del usuario logueado
    console.log('ROL:', this.rolUsuario); //  sirve para debug
        // this.cargarUltimosClientes();
           this.cargarCasos();
  }

    ngAfterViewInit(): void {}



  // constructor(private casoService: CasoService) {}

  // ngOnInit(): void {
  //   this.cargarCasos();
  // }

  cargarCasos() {
    this.casoService.getCasos().subscribe({
      next: (res) => {
        if (res.ok) {
          this.casos = res.casos;
                    this.crearGrafico();
     this.crearGraficoPorMes();
     this.crearGraficoEvolucion();

     this.detectarCasosAtrasados();
        }
      },
      error: (err) => console.error(err),
      complete: () => this.loading = false
    });
  }

  //  RESUMEN
  get total() {
    return this.casos.length;
  }

  get pendientes() {
    return this.casos.filter(c => c.estado === 'pendiente_documentos').length;
  }

  get enTramite() {
    return this.casos.filter(c => c.estado === 'en_tramite').length;
  }

  get completados() {
    return this.casos.filter(c => c.estado === 'completado').length;
  }

  get archivados() {
    return this.casos.filter(c => c.estado === 'archivado').length;
  }
//  CREAR GRÁFICO
  crearGrafico() {

    if (this.chart) {
      this.chart.destroy(); // evita duplicados
    }
    const textColor = this.modoOscuro ? '#fff' : '#000';

    this.chart = new Chart('graficoCasos', {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'En trámite', 'Completados', 'Archivados'],
        datasets: [{
          data: [
            this.pendientes,
            this.enTramite,
            this.completados,
            this.archivados
          ]
        }]
      },
          options: {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    }
    });

  }

 
  crearGraficoPorMes() {
  const textColor = this.modoOscuro ? '#fff' : '#000';

  const meses = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const conteoMeses = new Array(12).fill(0);

  this.casos.forEach(caso => {
    if (caso.fecha_creacion) {
      const fecha = new Date(caso.fecha_creacion);
      const mes = fecha.getMonth(); // 0-11
      conteoMeses[mes]++;
    }
  });

  new Chart('graficoMeses', {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [{
        label: 'Casos por mes',
        data: conteoMeses
      }]
    },
    options: {
      scales: {
        x: { ticks: { color: textColor } },
        y: { ticks: { color: textColor } }
      },
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      }
    }
  });
}
    
    detectarCasosAtrasados() {
  const hoy = new Date();

  this.casosAtrasados = this.casos.filter(caso => {

    if (caso.estado !== 'en_tramite' || !caso.fecha_estado) return false;

    const fechaEstado = new Date(caso.fecha_estado);
    const diffDias = (hoy.getTime() - fechaEstado.getTime()) / (1000 * 60 * 60 * 24);

    return diffDias > 20;
  });
    
 
   }
crearGraficoEvolucion() {
  const textColor = this.modoOscuro ? '#fff' : '#000';

  const meses = [
    'Ene','Feb','Mar','Abr','May','Jun',
    'Jul','Ago','Sep','Oct','Nov','Dic'
  ];

  const data = new Array(12).fill(0);

  this.casos.forEach(caso => {
    if (caso.fecha_creacion) {
      const mes = new Date(caso.fecha_creacion).getMonth();
      data[mes]++;
    }
  });

  new Chart('graficoEvolucion', {
    type: 'line',
    data: {
      labels: meses,
      datasets: [{
        label: 'Evolución de casos',
        data: data,
        tension: 0.3
      }]
    },
    // options: {
    //   responsive: true,
    //   maintainAspectRatio: false
    // }
    
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: textColor } },
        y: { ticks: { color: textColor } }
      },
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      }}
  });
}


// toggleModo() {
//   this.modoOscuro = !this.modoOscuro;

//   if (this.modoOscuro) {
//     document.body.classList.add('dark-mode');
//   } else {
//     document.body.classList.remove('dark-mode');
//   }
// }

toggleModo() {
  this.modoOscuro = !this.modoOscuro;

  if (this.modoOscuro) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
  }

  // 🔥 MUY IMPORTANTE → recrear gráficas
  this.crearGrafico();
  this.crearGraficoPorMes();
  this.crearGraficoEvolucion();
}
  }
    




  