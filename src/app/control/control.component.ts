import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  @ViewChild('modalAnyadir', { static: false }) modalAnyadir!: TemplateRef<any>;
  @ViewChild('modalEliminar', { static: false }) modalEliminar!: TemplateRef<any>;
  @ViewChild('modalConfirmacion', { static: false }) modalConfirmacion!: TemplateRef<any>;

  url = 'http://192.168.1.10:9000/locales';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  id: any;
  direccion: any;
  nombre: any = '';
  asociados: any;
  asociadosArray: any;
  turnoActual: any;
  turnoUltimo: any;
  local: any;
  datos: any;
  idAsociado: any;
  eliminar: any;
  seleccionado: any;
  sectores: any;
  sector: any = [];
  sectorSeleccionado: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.idLocal();
    this.actualizarLocales();
  }

  idLocal(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  actualizarLocales(): void {
    // tslint:disable-next-line: deprecation
    this.http.get(this.url + '/local/' + this.id + '/edit').subscribe(data => {
      this.local = data;
      this.direccion = this.local.direccion;
      this.nombre = this.local.nombre;
      this.asociados = this.local.relacionados;
      this.turnoUltimo = this.local.turnoUltimo;
      this.turnoActual = this.local.turnoActual;
      this.sectores = this.local.sectores;
      this.sector = this.local.sector;
    }, (err: HttpErrorResponse) => {
      if (isNaN(this.id)) {
        this.router.navigate(['/local']);
      } else {
      }
    });
    setInterval(() => {
      // tslint:disable-next-line: deprecation
      this.http.get(this.url + '/local/' + this.id + '/edit').subscribe(data => {
        this.local = data;
        this.direccion = this.local.direccion;
        this.nombre = this.local.nombre;
        this.asociados = this.local.relacionados;
        this.turnoUltimo = this.local.turnoUltimo;
        this.turnoActual = this.local.turnoActual;
      }, (err: HttpErrorResponse) => {
        if (isNaN(this.id)) {
          this.router.navigate(['/local']);
        }
      });
    }, 30000);
  }

  menuAnyadir(): void {
    this.idAsociado = '';
    this.modal.open(this.modalAnyadir);
  }

  anyadirAsociado(): void {
    if (this.id !== this.idAsociado) {
      // tslint:disable-next-line: deprecation
      this.http.get(this.url + '/list?ids=' + this.idAsociado).subscribe(data => {
        this.asociados = this.asociados.concat(',', this.idAsociado);
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
    }
  }

  menuEliminar(): void {
    // tslint:disable-next-line: deprecation
    this.http.get(this.url + '/list?ids=' + this.asociados).subscribe(data => {
      this.eliminar = data;
    });
    this.modal.open(this.modalEliminar);
  }

  menuConfirmacion(): void {
    if (this.seleccionado !== undefined) {
      this.modal.open(this.modalConfirmacion);
    }
  }

  eliminarAsociado(): void {
    if (this.seleccionado !== undefined) {
      this.asociadosArray = this.asociados.split(',');
      this.asociadosArray.splice(this.asociadosArray.findIndex((e: any) => e === this.seleccionado.toString()), 1);
      this.asociados = this.asociadosArray.toString();
    }
  }

  pasarTurno(): void {
    // tslint:disable-next-line: deprecation
    this.http.put(this.url + '/local/' + this.id + '/pasaTurno', this.id, { headers: this.headers }).subscribe(data => {
      this.datos = data;
      this.turnoActual = this.datos.turnoActual;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  cogerTurno(): void {
    // tslint:disable-next-line: deprecation
    this.http.post(this.url + '/local/' + this.id + '/cogeTurno', this.id, { headers: this.headers }).subscribe(data => {
      this.datos = data;
      this.turnoUltimo = this.datos.turnoUltimo;
      console.log(this.turnoUltimo);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  retrocederTurno(): void {
    // tslint:disable-next-line: deprecation
    this.http.put(this.url + '/local/' + this.id + '/retrocedeTurno', this.id, { headers: this.headers }).subscribe(data => {
      this.datos = data;
      this.turnoActual = this.datos.turnoActual;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  guardarCambios(): void {
    this.local.nombre = this.nombre;
    this.local.direccion = this.direccion;
    this.local.relacionados = this.asociados;
    this.local.turnoActual = this.turnoActual;
    this.local.turnoUltimo = this.turnoUltimo;
    if (this.sectores[this.sectorSeleccionado - 1] !== undefined) {
      this.local.sector = this.sectores[this.sectorSeleccionado - 1];
      this.sector = this.sectores[this.sectorSeleccionado - 1];
    }
    // tslint:disable-next-line: deprecation
    this.http.put(this.url + '/local/' + this.id + '/update', this.local, { headers: this.headers }).subscribe(data => {
      console.log(data);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

}
