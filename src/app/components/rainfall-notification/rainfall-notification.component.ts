import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { RainDataService } from '../../services/rain-data.service';

interface GradientColor {
  percentage: number;
  color: [number, number, number];
}

const MINIMUM_DAYS = 6;
const MAXIMUM_DAYS = 70;

@Component({
  selector: 'app-rainfall-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rainfall-notification.component.html',
  styleUrls: ['./rainfall-notification.component.scss'],
})
export class RainfallNotificationComponent {
  @Input()
  public selectedMonth: number;

  @Input()
  public selectedYear: number;

  public daysWithoutRain = 0;

  @HostBinding('style.background-color')
  public get notificationColor(): string {
    // normalize the number within the range from MINIMUM_DAYS days to MAXIMUM_DAYS days
    let percentage = ((this.daysWithoutRain - MINIMUM_DAYS) / (MAXIMUM_DAYS - MINIMUM_DAYS)) * 100;
    percentage = percentage < 0 ? 0 : percentage; // for less than MINIMUM_DAYS days
    percentage = percentage > 100 ? 100 : percentage; // for more than MAXIMUM_DAYS days

    // define the colors of the gradient and their percentages
    const gradientColors: GradientColor[] = [
      { percentage: 0, color: [227, 255, 168] }, // light green
      { percentage: 10, color: [247, 251, 59] }, // yellow
      { percentage: 20, color: [255, 201, 0] }, // orange
      { percentage: 50, color: [255, 85, 0] }, // red
      { percentage: 100, color: [129, 49, 22] }, // dark red
    ];

    // find the pair of colors between which the percentage falls
    let initColor!: GradientColor, endColor!: GradientColor;
    for (let i = 0; i < gradientColors.length - 1; i++) {
      if (percentage >= gradientColors[i].percentage && percentage <= gradientColors[i + 1].percentage) {
        initColor = gradientColors[i];
        endColor = gradientColors[i + 1];
        break;
      }
    }

    // calculate the relative percentage between the two colors
    const relativePercentage = (percentage - initColor.percentage) / (endColor.percentage - initColor.percentage);

    // interpolate the color components between the two colors
    const interpolatedColor = initColor.color.map((rgb: number, i: number) => Math.round(rgb + (endColor.color[i] - rgb) * relativePercentage));

    return `rgb(${interpolatedColor.join(',')})`;
  }

  public constructor(rainDataService: RainDataService) {
    this.daysWithoutRain = rainDataService.getNumberOfDaysWithoutRain(this.selectedMonth, this.selectedYear);
  }

  /**
   * Show only for current month and year, and if daysWithoutRain is greater than MINIMUM_DAYS days
   */
  public get showNotification(): boolean {
    const today = new Date();
    return this.selectedMonth === today.getMonth() && this.selectedYear === today.getFullYear() && this.daysWithoutRain > MINIMUM_DAYS;
  }
}
