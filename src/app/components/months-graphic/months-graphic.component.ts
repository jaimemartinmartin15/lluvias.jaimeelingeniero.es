import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { RainData } from '../../models/rain-data';
import { RainDataService } from '../../rain-data.service';
import { CommonModule } from '@angular/common';
import { MONTHS } from '../../date-utils';

@Component({
  selector: 'app-months-graphic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './months-graphic.component.html',
  styleUrls: ['./months-graphic.component.scss'],
})
export class MonthsGraphicComponent implements OnChanges {
  public readonly MONTHS = MONTHS;
  public average: { svg: number; liters: number } = { svg: 0, liters: 0 };

  @Input()
  public selectedMonth: number;

  @Input()
  public year: number;

  @Input()
  public loading: boolean;

  @Input()
  public error: boolean;

  @Output()
  public showPopUp: EventEmitter<string> = new EventEmitter();

  @Output()
  public showPreviousYear: EventEmitter<void> = new EventEmitter();

  @Output()
  public showNextYear: EventEmitter<void> = new EventEmitter();

  @Output()
  public showMonth: EventEmitter<number> = new EventEmitter();

  public rainPerMonths: RainData[] = [];

  public constructor(private readonly rainDataService: RainDataService) {}

  public ngOnChanges() {
    this.rainPerMonths = this.rainDataService.getRainDataPerMonths(this.year);
    if (this.rainPerMonths.length > 0) {
      const litersOfMonthsWithRain = this.rainPerMonths.filter((m) => m.hasLiters).map((m) => m.liters);
      const averageOfRain = litersOfMonthsWithRain.reduce((a, b) => a + b, 0) / litersOfMonthsWithRain.length;
      const maxAmountOfRainInMonth = Math.max(...litersOfMonthsWithRain);
      this.average = {
        // maxAmountOfRainInMonth -> 0   0 -> 260 (as in svg y axis)
        svg: 260 - (260 / maxAmountOfRainInMonth) * averageOfRain,
        liters: Math.round(averageOfRain),
      };
    }
  }

  public existsMessageForYear(): boolean {
    const years = this.rainDataService.getRainDataPerYear();
    const foundYear = years.find((y) => y.year === this.year);
    return foundYear != null && foundYear.hasMessage;
  }

  public getBadgeColorForYear(): string {
    const years = this.rainDataService.getRainDataPerYear();
    const foundYear = years.find((y) => y.year === this.year);
    if (foundYear != null && foundYear.hasMessage) {
      return foundYear.bulletColor;
    }

    return 'transparent';
  }

  public showYearPopUp() {
    const years = this.rainDataService.getRainDataPerYear();
    const foundYear = years.find((y) => y.year === this.year);
    if (foundYear != null && foundYear.hasMessage) {
      this.showPopUp.emit(foundYear.popUpContent);
    }
  }

  public isTotalAmountOfLitersAvailableForYear(): boolean {
    const years = this.rainDataService.getRainDataPerYear();
    const foundYear = years.find((y) => y.year === this.year);
    return !this.error && !this.loading && foundYear !== undefined && foundYear.hasLiters;
  }

  public totalAmountOfLitersInYear(): number {
    const years = this.rainDataService.getRainDataPerYear();
    const foundYear = years.find((y) => y.year === this.year);
    return foundYear!.liters;
  }
}
