import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { interval, of } from 'rxjs';
import { catchError, startWith, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api.service';
import { ILocal } from 'src/app/models/ILocal';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  @ViewChild('modalConfirmacion', { static: false }) modalConfirmacion!: TemplateRef<any>;
  @ViewChild('modalTurno', { static: false }) modalTurno!: TemplateRef<any>;


  url = 'http://192.168.1.10:9000/usuarios';

  idLocales: any = [];
  locales: any = [];
  id: any;
  datos: any;
  data: any;
  localesTurno: any = [];
  idTurno: any = [];
  turnos = new Map();
  turnoAsignado: any;
  local: any;
  turno: any;
  idRegistro = new Map();
  registro: any = [];
  registroArray: any;

  constructor(
    private $api: ApiService,
    private toastr: ToastrService,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('turno') !== '' && localStorage.getItem('turno') !== null) {
      this.idTurno = localStorage.getItem('turno')?.split(',');
      this.localesTurno = localStorage.getItem('turnoLocal')?.split(',');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.idTurno.length; i++) {
        this.turnos.set(this.idTurno[i], this.localesTurno[i]);
      }
      if (localStorage.getItem('idRegistro') !== undefined && localStorage.getItem('idRegistro') !== null) {
        this.registroArray = localStorage.getItem('idRegistro')?.split(',');
        // tslint:disable-next-line: prefer-for-of tslint:disable-next-line: no-non-null-assertion
        for (let i = 0; i < this.registroArray.length; i++) {
          this.idRegistro.set(this.idTurno[i], this.registroArray[i]);
        }
      }
    }

    if (localStorage.getItem('usuario') !== '' && localStorage.getItem('usuario') !== null) {
      this.datos = localStorage.getItem('usuario');
      this.idLocales = localStorage.getItem('usuario')?.split(',');
    }
    if (this.datos !== null && this.datos !== undefined) {
      this.mostrarLocales();
    }
    console.log(this.idRegistro);
  }

  mostrarLocales(): void {
    interval(30000).pipe(startWith(0)).subscribe(() => {
      if (this.datos !== undefined && this.datos !== null) {
        this.$api.getLocalesUsuario(this.datos).pipe(
          tap((data: any) => {
            this.locales = Object.values(data);
            for (let i = 0; i < this.locales.length; i++) {
              if (this.locales[i].turnoActual === this.idRegistro.get(this.locales[i].id.toString())) {
                console.log('si');
              }
            }
          }),
          catchError((e: HttpErrorResponse) => {
            this.toastr.error(this.$api.getErrorResponse(e));
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  registrarLocal(): void {
    let id: any;
    id = this.id.toString();
    if (!this.idLocales.includes(id)) {
      this.$api.getLocalesUsuario(id).pipe(
        tap((data: any) => {
          this.idLocales.push(id);
          localStorage.setItem('usuario', this.idLocales);
          this.datos = localStorage.getItem('usuario');
          this.mostrarLocales();
        }),
        catchError((e: HttpErrorResponse) => {
          this.toastr.error(this.$api.getErrorResponse(e));
          return of(null);
        })
      ).subscribe();
    }
  }

  pedirNumero(local: any): void {
    this.$api.cogerTurnoUsuario(local).pipe(
      tap((data: any) => {
        this.data = data;
        this.idTurno.push(local.toString());
        localStorage.setItem('turno', this.idTurno);
        this.localesTurno.push(this.data.turnoUltimo);
        localStorage.setItem('turnoLocal', this.localesTurno);
        this.turnos.set(local.toString(), this.data.turnoUltimo);
        this.idRegistro.set(local.toString(), this.data.turno.idRegistro.toString());
        this.registro.push(this.data.turno.idRegistro.toString());
        console.log(this.registro);
        localStorage.setItem('idRegistro', this.registro);
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastr.error(this.$api.getErrorResponse(e));
        return of(null);
      })
    ).subscribe();
  }


  cancelarTurno(local: any): void {
    // tslint:disable-next-line: radix
    this.$api.dejarTurnoUsuario(local, this.idRegistro.get(local.toString()).toString()).pipe(
      tap((data: any) => {
        this.data = data;
        this.idTurno.splice(this.idTurno.findIndex((e: any) => e === local.toString()), 1);
        localStorage.setItem('turno', this.idTurno);
        this.localesTurno.splice(this.localesTurno.findIndex((e: any) => e.toString() === this.data.turnoUltimo.toString()), 1);
        localStorage.setItem('turnoLocal', this.localesTurno);
        this.turnos.delete(local);
        this.registro.splice(this.registro.findIndex((e: any) => e === this.idRegistro.get(local.toString())));
        this.idRegistro.delete(local);
        localStorage.setItem('idRegistro', this.registro);
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastr.error(this.$api.getErrorResponse(e));
        console.log(e)
        return of(null);
      })
    ).subscribe();
  }

  menuConfirmacion(local: any): void {
    this.local = local;
    this.modal.open(this.modalConfirmacion);
  }

  verTurno(local: any): void {
    this.local = local;
    console.log(this.turnos)
    this.turno = this.turnos.get(this.local.id.toString());
    this.modal.open(this.modalTurno);
  }

  eliminarRegistro(): void {
    console.log(this.local.id);
    console.log(this.idTurno);
    if (this.idTurno.includes(this.local.id.toString())) {
      this.cancelarTurno(this.local.id);
      console.log('si');
    } else {
      this.idTurno.splice(this.idTurno.findIndex((e: any) => e === this.local.id.toString()), 1);
      localStorage.setItem('turno', this.idTurno);
      this.turnos.delete(this.local.id);
    }
    this.locales.splice(this.locales.findIndex((e: any) => e.id === this.local.id), 1);
    this.idLocales.splice(this.idLocales.findIndex((e: any) => e === this.local.id.toString()), 1);
    this.idRegistro.delete(this.local.id);
    console.log(this.idRegistro);
    localStorage.setItem('usuario', this.idLocales);
    this.datos = localStorage.getItem('usuario');
  }

}
