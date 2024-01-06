import * as puppeteer from 'puppeteer';

/**
 * purpose: show empty data file
 */
const pluviometro1txt = ``;

/**
 * pupose: the rain starts in middle of the year
 */
const pluviometro2txt = `
19/06/2022;0
18/06/2022;5
17/06/2022;9
`;

/**
 * purpose: there is data, but there is no rain. Also some days, months or years are missing
 */
const pluviometro3txt = `
09/08/2024;0
xx/05/2024;0
05/02/2024;0

xx/xx/2023;0
xx/xx/2021;0
`;

/**
 * purpose: show notifications
 */
const pluviometro4txt = `
12/01/2024;;red;Notificación 1 de enero de 2024
xx/01/2024;;green;Notificación mes de enero de 2024
xx/xx/2024;;blue;Notificación del año 2024
`;

/**
 * purpose: show rain. Rain is calculated based on days or months
 */
const pluviometro5txt = `
# AÑO 2025 (no calculated based on days or months)
xx/xx/2025;397
xx/01/2025;32
01/01/2025;8

# MESES 2024
xx/08/2024;2
xx/07/2024;8
xx/06/2024;0
xx/05/2024;43
xx/04/2024;87
xx/03/2024;103
xx/02/2024;39

# ENERO 2024
09/01/2024;15
08/01/2024;10
07/01/2024;0
06/01/2024;0
05/01/2024;0
04/01/2024;80
03/01/2024;34
02/01/2024;20
01/01/2024;3

# OTROS AÑOS
xx/xx/2023;597
xx/xx/2022;375
xx/xx/2021;485
xx/xx/2020;379
xx/xx/2019;486
xx/xx/2018;513

# AÑO 2017
xx/12/2017;35
xx/11/2017;24
xx/10/2017;7

# OTROS AÑOS
xx/xx/2016;348
xx/xx/2015;642
xx/xx/2014;491
`;

const pluviometers = {
  'pluviometro-1.txt': pluviometro1txt,
  'pluviometro-2.txt': pluviometro2txt,
  'pluviometro-3.txt': pluviometro3txt,
  'pluviometro-4.txt': pluviometro4txt,
  'pluviometro-5.txt': pluviometro5txt,
} as const;

export const onRequestInterceptor: puppeteer.Handler<puppeteer.HTTPRequest> = (request) => {
  const segments = request.url().split('/');
  const fileName = segments[segments.length - 1] as keyof typeof pluviometers;

  if (fileName.startsWith('pluviometro')) {
    request.respond({ contentType: 'text/plain', body: pluviometers[fileName] });
    return;
  }

  request.continue();
};
