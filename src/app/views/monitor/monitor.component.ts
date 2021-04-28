import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/core/api.service';
import { interval, of, Subscription } from 'rxjs';
import { catchError, startWith, tap } from 'rxjs/operators';
import { ILocal } from 'src/app/models/ILocal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  id: any;
  local: any = {
    // tslint:disable-next-line: object-literal-key-quotes
    'sector': {
      // tslint:disable-next-line: object-literal-key-quotes
      'backColor': ''
    }
  };
  idRelacionados: any;
  relacionados: any;
  interval0: any;
  interval: any;
  interval2: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private $api: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.idLocal();
    this.actualizarLocales();
    this.intervalo1();
  }

  ngOnDestroy(): void {
    this.interval0?.unsubscribe();
  }

  idLocal(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  actualizarLocales(): void {
    this.interval0 = interval(30000).pipe(startWith(0)).subscribe(() => {
      this.$api.getLocalMonitor(this.id).pipe(
        tap((data: ILocal) => {
          this.local = data;
          this.relacionados = this.local.relacionados;
          if (this.relacionados.length < 3) {
            document.getElementById('pagina')?.setAttribute('style', 'overflow: hidden;');
          } else {
            document.getElementById('pagina')?.removeAttribute('style');
          }
        }),
        catchError((e: HttpErrorResponse) => {
          this.toastr.error(this.$api.getErrorResponse(e));
          this.router.navigate(['/local']);
          return of(null);
        }),
      ).subscribe();
    });
  }

  intervalo1(): void {
    let i = 0;
    this.interval = interval(50).pipe().subscribe(() => {
      window.scrollBy(0, 1);
      if (window.scrollY === i) {
        this.interval?.unsubscribe();
        this.intervalo2();
      }
      i = window.scrollY;
    });
  }

  intervalo2(): void {
    let i = 0;
    this.interval2 = interval(50).pipe().subscribe(() => {
      window.scrollBy(0, -1);
      if (window.scrollY === 0) {
        this.interval2?.unsubscribe();
        this.intervalo1();
      }
      i = window.scrollY;
    });
  }

}
