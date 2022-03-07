import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CpDashboardComponent } from './cp-dashboard.component';



@NgModule({
  declarations: [
    CpDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CpDashboardComponent,
      },
    ]),
  ]
})
export class CpDashboardModule { }
