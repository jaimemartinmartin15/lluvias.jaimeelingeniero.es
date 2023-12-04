import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { DataFileFormatExplanationComponent } from './pages/data-file-format-explanation/data-file-format-explanation.component';
import { GraphicsComponent } from './pages/graphics/graphics.component';
import { RainDataService } from './services/rain-data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    RainDataService,
    provideRouter([
      { path: '', pathMatch: 'full', component: GraphicsComponent },
      {
        path: 'formato-fichero',
        children: [
          { path: '', component: DataFileFormatExplanationComponent },
          { path: '**', redirectTo: '' },
        ],
      },
      { path: '**', redirectTo: '' },
    ]),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
