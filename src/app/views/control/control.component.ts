import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { interval, of, Subscription } from 'rxjs';
import { catchError, startWith, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ILocal } from 'src/app/models/ILocal';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit, OnDestroy {

  @ViewChild('modalAnyadir', { static: false }) modalAnyadir!: TemplateRef<any>;
  @ViewChild('modalEliminar', { static: false }) modalEliminar!: TemplateRef<any>;
  @ViewChild('modalConfirmacion', { static: false }) modalConfirmacion!: TemplateRef<any>;

  private id: string | null = null;
  private interval: Subscription | undefined;
  public local: ILocal | undefined;
  public direccion: any;
  public nombre: any = '';
  public asociados: any;
  public asociadosArray: any;
  public turnoActual: any;
  public turnoUltimo: any;
  public datos: any;
  public idAsociado: any;
  public eliminar: any;
  public seleccionado: any;
  public sectores: any;
  public sector: any = [];
  public sectorSeleccionado: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
    private $api: ApiService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getIdLocal();
    this.actualizarLocales();
  }

  ngOnDestroy(): void {
    this.interval?.unsubscribe();
  }

  private getIdLocal(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  private actualizarLocales(): void {
    // Interval 30 seconds
    this.interval = interval(30000).pipe(startWith(0)).subscribe(() => {
      this.$api.getLocalById(this.id).pipe(
        tap((data: ILocal) => {
          this.local = data;
          this.direccion = this.local.direccion;
          this.nombre = this.local.nombre;
          this.asociados = this.local.relacionados;
          this.turnoUltimo = this.local.turnoUltimo;
          this.turnoActual = this.local.turnoActual;
          this.sectores = this.local.sectores;
          this.sector = this.local.sector;
        }),
        catchError((e: HttpErrorResponse) => {
          this.toastr.error(this.$api.getErrorResponse(e));
          this.router.navigate(['/local']);
          return of(null);
        }),
      ).subscribe();
    });
  }

  menuAnyadir(): void {
    this.idAsociado = '';
    this.modal.open(this.modalAnyadir);
  }

  anyadirAsociado(): void {
    if (this.id !== this.idAsociado) {
      this.$api.getAsociados(this.idAsociado).pipe(
        tap((data: any) => {
          this.asociados = this.asociados.concat(',', this.idAsociado);
        }),
        catchError((e: HttpErrorResponse) => {
          this.toastr.error(this.$api.getErrorResponse(e));
          return of(null);
        }),
      ).subscribe();
    }
  }

  menuEliminar(): void {
    this.$api.getAsociados(this.idAsociado).pipe(
      tap((data: any) => {
        this.eliminar = data;
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastr.error(this.$api.getErrorResponse(e));
        return of(null);
      }),
    ).subscribe();

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
    this.$api.pasarTurno(this.id).pipe(
      tap((data: any) => {
        this.datos = data;
        this.turnoActual = this.datos.turnoActual;
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastr.error(this.$api.getErrorResponse(e));
        return of(null);
      }),
    ).subscribe();
  }

  cogerTurno(): void {
    this.$api.cogerTurno(this.id).pipe(
      tap((data: any) => {
        this.datos = data;
        this.turnoUltimo = this.datos.turnoUltimo;
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastr.error(this.$api.getErrorResponse(e));
        return of(null);
      }),
    ).subscribe();
  }

  retrocederTurno(): void {
    this.$api.cogerTurno(this.id).pipe(
      tap((data: any) => {
        this.datos = data;
        this.turnoActual = this.datos.turnoActual;
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastr.error(this.$api.getErrorResponse(e));
        return of(null);
      }),
    ).subscribe();
  }

  guardarCambios(): void {
    if (this.local) {
      this.local.nombre = this.nombre;
      this.local.direccion = this.direccion;
      this.local.relacionados = this.asociados;
      this.local.turnoActual = this.turnoActual;
      this.local.turnoUltimo = this.turnoUltimo;
      if (this.sectores[this.sectorSeleccionado - 1] !== undefined) {
        this.local.sector = this.sectores[this.sectorSeleccionado - 1];
        this.sector = this.sectores[this.sectorSeleccionado - 1];
      }
      this.$api.updateLocal(this.id, this.local).pipe(
        tap((data: any) => {
          console.log(data);
        }),
        catchError((e: HttpErrorResponse) => {
          this.toastr.error(this.$api.getErrorResponse(e));
          return of(null);
        }),
      ).subscribe();
    }
  }
}
