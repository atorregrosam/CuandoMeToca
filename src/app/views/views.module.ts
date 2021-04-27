import {
  NgModule,
} from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';

import { UsuarioComponent } from './usuario/usuario.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ControlComponent } from './control/control.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    UsuarioComponent,
    MonitorComponent,
    ControlComponent,
    ErrorComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
  ],
})
class ViewsModule { }


export {
  ViewsModule,
};
