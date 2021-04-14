import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  url = 'http://192.168.1.10:9000/locales';

  idLocales: number[] = [];
  locales: string[] = [];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  obtenerLocales(): void {
    // tslint:disable-next-line: deprecation
    /*this.http.get(this.url).subscribe(data => {
      console.log(data);
    });*/
    console.log(localStorage.getItem('usuario'));
    this.locales.push();
    localStorage.setItem('usuario', JSON.stringify(this.locales));
    console.log(localStorage.getItem('usuario'));
    localStorage.setItem('usuario', 'local 2');
  }

  registrarLocal(): void {
    this.locales.push();
  }

}
