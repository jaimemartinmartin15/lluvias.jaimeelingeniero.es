import { ApplicationConfig } from '@angular/core';
import { RainDataService } from './rain-data.service';

export const appConfig: ApplicationConfig = {
  providers: [RainDataService]
};
