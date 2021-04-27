import {
  CommonModule,
} from '@angular/common';

import {
  NgModule,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import {
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';

import { AppPasswordDirective } from './directives/password.directive';

import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppPasswordDirective,
  ],
  exports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AppPasswordDirective,
    ToastrModule
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
})
class SharedModule { }


export {
  SharedModule,
};
