import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-data-file-format-explanation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-file-format-explanation.component.html',
  styleUrls: ['./data-file-format-explanation.component.scss'],
})
export class DataFileFormatExplanationComponent {
  @Output()
  public closeDialog = new EventEmitter<void>();
}
