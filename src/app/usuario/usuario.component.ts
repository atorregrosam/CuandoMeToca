import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  @ViewChild('myModal', { static: false }) myModal!: TemplateRef<any>;
  @ViewChild('modalInfo', { static: false }) modalInfo!: TemplateRef<any>;

  url = 'http://192.168.1.10:9000/usuarios';

  idLocales: any = [];
  locales: any = [];
  id: any;
  datos: any;
  data: any;
  localesTurno: any = [];
  idTurno: any = [];
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  turnos = new Map();
  turnoAsignado: any;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('turno') !== '' && localStorage.getItem('turno') !== null) {
      this.idTurno = localStorage.getItem('turno')?.split(',');
      this.localesTurno = localStorage.getItem('turnoLocal')?.split(',');
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.idTurno.length; i++) {
      this.turnos.set(this.idTurno[i], this.localesTurno[i]);
    }
    if (localStorage.getItem('usuario') !== '' && localStorage.getItem('usuario') !== null) {
      this.datos = localStorage.getItem('usuario');
      this.idLocales.push(localStorage.getItem('usuario')?.split(','));
    }
    if (this.datos !== null && this.datos !== undefined) {
      this.mostrarLocales();
    }
  }

  mostrarLocales(): void {
    // tslint:disable-next-line: deprecation
    this.http.get(this.url + '/list?ids=' + this.datos).subscribe(data => {
      this.locales = Object.values(data);
    });
    setInterval(() => {
      if (this.datos !== null && this.datos !== undefined) {
        // tslint:disable-next-line: deprecation
        this.http.get(this.url + '/list?ids=' + this.datos).subscribe(data => {
          this.locales = Object.values(data);
        });
      }
    }, 30000);
  }

  registrarLocal(): void {
    let id: any;
    id = this.id.toString();
    if (!this.idLocales.includes(id)) {
      // tslint:disable-next-line: deprecation
      this.http.get(this.url + '/list?ids=' + id).subscribe(data => {
        this.idLocales.push(id);
        localStorage.setItem('usuario', this.idLocales);
        this.datos = localStorage.getItem('usuario');
        this.mostrarLocales();
      });

    }
  }

  pedirNumero(local: any): void {
    // tslint:disable-next-line: deprecation
    this.http.post(this.url + '/local/' + local + '/cogeTurno', local, { headers: this.headers }).subscribe(data => {
      this.data = data;
      this.idTurno.push(local.toString());
      localStorage.setItem('turno', this.idTurno);
      this.localesTurno.push(this.data.turnoUltimo);
      localStorage.setItem('turnoLocal', this.localesTurno);
      this.turnos.set(local, this.data.turnoUltimo);
    }, (err: HttpErrorResponse) => {
      console.log(err.error);
    });
  }


  cancelarTurno(local: any): void {
    // tslint:disable-next-line: deprecation
    this.http.post(this.url + '/local/' + local + '/dejaTurno', local).subscribe(data => {
      this.data = data;
      this.idTurno.splice(this.idTurno.findIndex((e: any) => e === local.toString()), 1);
      localStorage.setItem('turno', this.idTurno);
      console.log(this.data.turnoUltimo);
      console.log(this.localesTurno);
      this.localesTurno.splice(this.localesTurno.findIndex((e: any) => e.toString() === this.data.turnoUltimo.toString()), 1);
      localStorage.setItem('turnoLocal', this.localesTurno);
      this.turnos.delete(local);
      console.log(this.localesTurno);
    });
  }

  eliminarRegistro(local: any): void {
    this.locales.splice(this.locales.findIndex((e: any) => e.id === local), 1);
    this.idLocales.splice(this.idLocales.findIndex((e: any) => e === local.toString()), 1);
    this.turnos.delete(local);
    localStorage.setItem('usuario', this.idLocales);
  }

}
