import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  id: any;
  url = 'http://192.168.1.10:9000/monitores';
  local: any = {
    // tslint:disable-next-line: object-literal-key-quotes
    'sector': {
      // tslint:disable-next-line: object-literal-key-quotes
      'backColor': ''
    }
  };
  idRelacionados: any;
  relacionados: any;
  interval: any;
  interval2: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.idLocal();
    this.actualizarLocales();
    this.intervalo1();
  }

  idLocal(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  actualizarLocales(): void {
    // tslint:disable-next-line: deprecation
    this.http.get(this.url + '/local/' + this.id + '/status').subscribe(data => {
      this.local = data;
      this.relacionados = this.local.relacionados;
      if (this.relacionados.length < 4) {
        document.getElementById('pagina')?.setAttribute('style', 'overflow: hidden;');
      } else {
        document.getElementById('pagina')?.removeAttribute('style');
      }
    }, (err: HttpErrorResponse) => {
      this.router.navigate(['/public']);
    });
    setInterval(() => {
      // tslint:disable-next-line: deprecation
      this.http.get(this.url + '/local/' + this.id + '/status').subscribe(data => {
        this.local = data;
        console.log(this.local);
        this.relacionados = this.local.relacionados;
        if (this.relacionados.length < 4) {
          document.getElementById('pagina')?.setAttribute('style', 'overflow: hidden;');
        } else {
          document.getElementById('pagina')?.removeAttribute('style');
        }
      }, (err: HttpErrorResponse) => {
        this.router.navigate(['/public']);
      });
    }, 30000);
  }

  intervalo1(): void {
    let i = 0;
    this.interval = setInterval(() => {
      window.scrollBy(0, 1);
      if (window.scrollY === i) {
        clearInterval(this.interval);
        this.intervalo2();
      }
      i = window.scrollY;
    }, 50);
  }

  intervalo2(): void {
    let i = 0;
    this.interval2 = setInterval(() => {
      window.scrollBy(0, -1);
      if (window.scrollY === 0) {
        clearInterval(this.interval2);
        this.intervalo1();
      }
      i = window.scrollY;
    }, 50);
  }

}
