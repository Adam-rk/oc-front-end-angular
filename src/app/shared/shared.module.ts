import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatBoxComponent } from './components/stat-box/stat-box.component';

@NgModule({
  imports: [
    CommonModule,
    StatBoxComponent
  ],
  exports: [
    StatBoxComponent
  ]
})
export class SharedModule { }
