import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RainDataService } from './rain-data.service';

export const appConfig: ApplicationConfig = {
  providers: [RainDataService, provideRouter([])],
};
