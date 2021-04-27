import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlComponent } from './views/control/control.component';
import { ErrorComponent } from './views/error/error.component';
import { MonitorComponent } from './views/monitor/monitor.component';
import { UsuarioComponent } from './views/usuario/usuario.component';

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
