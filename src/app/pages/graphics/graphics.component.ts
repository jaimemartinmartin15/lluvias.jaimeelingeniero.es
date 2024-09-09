import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataFileSelectorComponent } from '../../components/data-file-selector/data-file-selector.component';
import { DaysGraphicComponent } from '../../components/days-graphic/days-graphic.component';
import { DryAlertComponent } from '../../components/dry-alert/dry-alert.component';
import { MonthsGraphicComponent } from '../../components/months-graphic/months-graphic.component';
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
    DryAlertComponent,
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

  public daysWithoutRain: number = 0;

  public constructor(private readonly activatedRoute: ActivatedRoute, public readonly rainDataService: RainDataService) {
    super();
  }

  public ngOnInit() {
    // calculate initial year and month to load
    this.selectedYear = this.getYearQueryParam() ?? new Date().getFullYear();
    this.selectedMonth = this.getMonthQueryParam() ?? new Date().getMonth();

    this.handleScrollSnapEvents();
    this.handleDaysGraphicScroll();
    this.handleMonthsGraphicScroll();
  }

  private getYearQueryParam(): number | undefined {
    const year = +this.activatedRoute.snapshot.queryParams['año'];
    if(isNaN(year)) return undefined;
    return year;
  }

  private getMonthQueryParam(): number | undefined {
    const month = +this.activatedRoute.snapshot.queryParams['mes'];
    if(isNaN(month)) return undefined;
    // js months go from 0 (January) to 11 (December)
    if(month < 1) return 0;
    if(month > 11) return 11;
    return month - 1;
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

    this.daysWithoutRain = this.rainDataService.getNumberOfDaysWithoutRain();

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
