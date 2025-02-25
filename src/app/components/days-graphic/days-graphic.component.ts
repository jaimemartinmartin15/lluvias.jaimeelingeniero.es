import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { PopUp } from '../../models/pop-up';
import { RainData } from '../../models/rain-data';
import { RainDataService } from '../../services/rain-data.service';
import { MONTHS } from '../../utils/date';

@Component({
  selector: 'app-days-graphic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './days-graphic.component.html',
  styleUrls: ['./days-graphic.component.scss'],
})
export class DaysGraphicComponent implements OnChanges {
  public readonly MONTHS = MONTHS;

  @Input()
  public month: number;

  @Input()
  public year: number;

  @Input()
  public loading: boolean;

  @Input()
  public error: boolean;

  @Output()
  public showPopUp: EventEmitter<PopUp> = new EventEmitter();

  @Output()
  public showPreviousMonth: EventEmitter<void> = new EventEmitter();

  @Output()
  public showNextMonth: EventEmitter<void> = new EventEmitter();

  public rainPerDays: RainData[] = [];

  public constructor(private readonly rainDataService: RainDataService) {}

  public ngOnChanges(): void {
    this.rainPerDays = this.rainDataService.getRainDataPerDays(this.month, this.year);
  }

  public existsMessageForMonth(): boolean {
    const months = this.rainDataService.getRainDataPerMonths(this.year);
    const foundMonth = months.find((m) => m.month === this.month);
    return foundMonth != null && foundMonth.hasMessage;
  }

  public getBadgeColorForMonth(): string {
    const months = this.rainDataService.getRainDataPerMonths(this.year);
    const foundMonth = months.find((m) => m.month === this.month);
    if (foundMonth != null && foundMonth.hasMessage) {
      return foundMonth.bulletColor;
    }

    return 'transparent';
  }

  public showMonthPopUp() {
    const months = this.rainDataService.getRainDataPerMonths(this.year);
    const foundMonth = months.find((m) => m.month === this.month);
    if (foundMonth != null && foundMonth.hasMessage) {
      this.showPopUp.emit({
        show: true,
        content: foundMonth.popUpContent,
        date: new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(`${foundMonth.year}-${foundMonth.month+1}-${1}`)),
      });
    }
  }

  public isTotalAmountOfLitersAvailableForMonth() {
    const months = this.rainDataService.getRainDataPerMonths(this.year);
    const foundMonth = months.find((m) => m.month === this.month);
    return !this.error && !this.loading && foundMonth !== undefined && foundMonth.hasLiters;
  }

  public totalAmountOfLitersInMonth(): number {
    const months = this.rainDataService.getRainDataPerMonths(this.year);
    const foundMonth = months.find((m) => m.month === this.month);
    return foundMonth!.liters;
  }

  public getWeatherIcon(): string {
    if (this.month < 3) return '❄️';
    if (this.month < 6) return '🌹';
    if (this.month < 9) return '☀️';
    return '🍁';
  }

  public showDayPopUp(day: RainData) {
    if (day.hasMessage) {
      this.showPopUp.emit({
        show: true,
        content: day.popUpContent,
        date: new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(`${day.year}-${day.month+1}-${day.day}`)),
      });
    }
  }

  public getFirstDayOfMonthWeekDayIndex(): number {
    // getDay(): 0 -> Sunday, 1 -> Monday, ... , 6 -> Saturday
    return new Date(this.year, this.month, 1).getDay() || 7;
  }
}
