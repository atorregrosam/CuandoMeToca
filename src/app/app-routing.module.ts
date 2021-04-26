import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlComponent } from './control/control.component';
import { ErrorComponent } from './error/error.component';
import { MonitorComponent } from './monitor/monitor.component';
import { UsuarioComponent } from './usuario/usuario.component';

const routes: Routes = [
  { path: 'usuario', component: UsuarioComponent},
  { path: 'public/:id', component: MonitorComponent },
  { path: 'local/:id', component: ControlComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
