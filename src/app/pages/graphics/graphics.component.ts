import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataFileSelectorComponent } from '../../components/data-file-selector/data-file-selector.component';
import { DaysGraphicComponent } from '../../components/days-graphic/days-graphic.component';
import { MonthsGraphicComponent } from '../../components/months-graphic/months-graphic.component';
import { RainfallNotificationComponent } from '../../components/rainfall-notification/rainfall-notification.component';
import { YearsGraphicComponent } from '../../components/years-graphic/years-graphic.component';
import { FileLine } from '../../models/file-line';
import { RainDataService } from '../../services/rain-data.service';
import { SnapScrollHelper } from './snap-scroll-helper';

@Component({
  selector: 'app-graphics-component',
  standalone: true,
  imports: [
    CommonModule,
    DataFileSelectorComponent,
    RainfallNotificationComponent,
    DaysGraphicComponent,
    MonthsGraphicComponent,
    YearsGraphicComponent,
  ],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.scss',
})
export class GraphicsComponent extends SnapScrollHelper implements OnInit, AfterViewInit {
  public readonly popUp = { show: false, content: '' };

  public isDataFileLoading: boolean = false;
  public isErrorLoadingDataFile: boolean = false;

  public selectedYear = new Date().getFullYear();
  public selectedMonth = new Date().getMonth();

  public constructor(public readonly rainDataService: RainDataService) {
    super();
  }

  public ngOnInit() {
    this.handleScrollSnapEvents();
    this.handleDaysGraphicScroll();
    this.handleMonthsGraphicScroll();
  }

  public ngAfterViewInit() {
    this.centerScrollingInstantly();
  }

  public onLoadDataFileError(error: boolean) {
    this.isErrorLoadingDataFile = error;
    this.updateHeightsOfGraphicWrappers();
  }

  public onLoadDataFile(fileLines: FileLine[]) {
    this.rainDataService.setData(fileLines);

    // select current month and year
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = new Date().getMonth();

    this.updateHeightsOfGraphicWrappers();
  }

  public showPreviousMonth() {
    this.selectedMonth--;
    if (this.selectedMonth < 0) {
      this.selectedMonth = 11; // set December last year
      this.selectedYear--;
    }

    this.updateHeightsOfGraphicWrappers();
  }

  public showNextMonth() {
    this.selectedMonth++;
    if (this.selectedMonth > 11) {
      this.selectedMonth = 0; // set January next year
      this.selectedYear++;
    }

    this.updateHeightsOfGraphicWrappers();
  }

  public showPreviousYear() {
    this.selectedYear--;
    this.updateHeightsOfGraphicWrappers();
  }

  public showNextYear() {
    this.selectedYear++;
    this.updateHeightsOfGraphicWrappers();
  }

  public selectMonthOfSelectedYear(month: number) {
    this.selectedMonth = month;
    this.updateHeightsOfGraphicWrappers();
  }

  public selectYear(year: number) {
    this.selectedYear = year;
    this.updateHeightsOfGraphicWrappers();
  }
}
