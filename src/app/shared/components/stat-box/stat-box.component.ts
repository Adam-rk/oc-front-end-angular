import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-box.component.html',
  styleUrl: './stat-box.component.scss'
})
export class StatBoxComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
}
