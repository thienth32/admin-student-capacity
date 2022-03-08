import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MajorComponent } from './major.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MajorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MajorComponent,
      },
    ]),
  ]
})
export class MajorModule { }
