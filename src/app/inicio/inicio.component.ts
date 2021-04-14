import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  @ViewChild('myModal', { static: false })
  myModal!: TemplateRef<any>;

  datosUsuario: any;

  constructor(
    private modal: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  usuarioNuevo(): void {
    localStorage.removeItem('usuario');
    localStorage.setItem('usuario', '');
    this.router.navigate(['/usuario']);
  }

  usuarioIniciado(): void {
    this.datosUsuario = localStorage.getItem('usuario');
    if (this.datosUsuario === null) {
      this.modal.open(this.myModal);
    } else {
      this.router.navigate(['/usuario']);
    }
  }

}
