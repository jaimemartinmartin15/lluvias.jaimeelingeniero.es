import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-file-format',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './file-format.component.html',
  styleUrls: ['./file-format.component.scss'],
})
export class FileFormatComponent {}
