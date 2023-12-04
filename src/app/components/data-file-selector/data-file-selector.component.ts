import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, map, tap } from 'rxjs';
import { COMMENT, DEFAULT_DATA_FILE, LINE_SEPARATOR } from '../../constants/data-file';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { FileLine } from '../../models/file-line';
import { TrashCanSvgComponent } from '../../svg/generated/trash-can.component';
import { DataFile } from './data-file';

@Component({
  selector: 'app-data-file-selector',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TrashCanSvgComponent, RouterLink],
  templateUrl: './data-file-selector.component.html',
  styleUrls: ['./data-file-selector.component.scss'],
})
export class DataFileSelectorComponent implements OnInit, AfterViewInit {
  @ViewChild('collapsibleContainer')
  public collapsibleContainer: ElementRef;
  public isCollapsibleOpen = false;
  private get collapsibleEl(): HTMLDivElement {
    return this.collapsibleContainer.nativeElement;
  }

  public popUp: { show: boolean; dataFile: DataFile } = {
    show: false,
    dataFile: { alias: '', url: '' },
  };

  public dataFiles: DataFile[] = [];
  public selectedDataFile: DataFile;

  @Output()
  public isLoading: EventEmitter<boolean> = new EventEmitter();

  @Output()
  public error: EventEmitter<boolean> = new EventEmitter();

  @Output()
  public loadNewDataFile: EventEmitter<FileLine[]> = new EventEmitter();

  public constructor(private readonly http: HttpClient) {}

  public ngOnInit() {
    this.dataFiles = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.DATA_FILES) ?? JSON.stringify([DEFAULT_DATA_FILE]));
    this.selectedDataFile = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.DEFAULT_DATA_FILE) ?? JSON.stringify(this.dataFiles[0]));

    this.selectDataFile(this.selectedDataFile);
  }

  public ngAfterViewInit(): void {
    this.closeCollapsible();

    const mutationObs = new MutationObserver(() => {
      if (this.isCollapsibleOpen) {
        // the browser will calculate the height and adapt it. Restore to absolute to animate again when closing
        this.collapsibleEl.style.height = 'auto';
        setTimeout(() => this.openCollapsible(), 0); //will also adapt the height to the new content
      }
    });
    mutationObs.observe(this.collapsibleEl, { childList: true });
  }

  public addNewDataFile(event: Event) {
    event.preventDefault();

    const inputRef = (event.target as HTMLButtonElement).parentElement?.querySelector('input') as HTMLInputElement;
    const value = inputRef.value;
    if (!value.includes(':')) {
      inputRef.classList.add('error');
      return;
    }

    inputRef.classList.remove('error');
    inputRef.value = '';
    const newFile = {
      alias: value.split(':')[0].trim(),
      url: value.split(/:(.*)/s)[1].trim(),
    };
    this.dataFiles.push(newFile);
    localStorage.setItem(LOCAL_STORE_KEYS.DATA_FILES, JSON.stringify(this.dataFiles));
  }

  public deleteDataFile(dataFile: DataFile) {
    this.dataFiles = this.dataFiles.filter((f) => f !== dataFile);
    if (this.dataFiles.length === 0) {
      localStorage.removeItem(LOCAL_STORE_KEYS.DATA_FILES);
      localStorage.removeItem(LOCAL_STORE_KEYS.DEFAULT_DATA_FILE);
    } else {
      localStorage.setItem(LOCAL_STORE_KEYS.DATA_FILES, JSON.stringify(this.dataFiles));
    }
    this.popUp.show = false;
  }

  public selectDataFile(dataFile: DataFile): void {
    this.selectedDataFile = dataFile;
    this.isLoading.emit(true);
    this.http
      .get(dataFile.url, { responseType: 'text' })
      .pipe(
        map((response: string) =>
          response
            .split(/\r?\n/) // divide the lines
            .filter((l) => !l.trim().startsWith(COMMENT) && l.trim() !== '') // Ignore commented and empty lines
            .map((l) => l.substring(0, l.indexOf(COMMENT) !== -1 ? l.indexOf(COMMENT) : l.length).trim()) // Remove comments and spaces in lines that contain data
            .map((l) => {
              const [date, liters, bulletColor, popUpContent] = l.split(LINE_SEPARATOR);
              return {
                date: date.trim(),
                liters: liters.trim(),
                bulletColor: bulletColor?.trim() ?? '',
                popUpContent: popUpContent?.trim() ?? '',
              };
            })
        ),
        tap((fileLines) => this.loadNewDataFile.emit(fileLines)),
        tap(() => localStorage.setItem(LOCAL_STORE_KEYS.DEFAULT_DATA_FILE, JSON.stringify(this.selectedDataFile))),
        tap(() => this.closeCollapsible()),
        finalize(() => this.isLoading.emit(false))
      )
      .subscribe({
        next: () => this.error.emit(false),
        error: () => this.error.emit(true),
      });
  }

  public toggleCollapsible() {
    this.isCollapsibleOpen ? this.closeCollapsible() : this.openCollapsible();
  }

  private openCollapsible() {
    this.isCollapsibleOpen = true;
    this.collapsibleEl.style.height = `${this.collapsibleEl.scrollHeight}px`;
    this.collapsibleEl.style.overflow = 'none';
  }

  private closeCollapsible() {
    this.isCollapsibleOpen = false;
    this.collapsibleEl.style.height = '0px';
    this.collapsibleEl.style.overflow = 'hidden';
  }
}
