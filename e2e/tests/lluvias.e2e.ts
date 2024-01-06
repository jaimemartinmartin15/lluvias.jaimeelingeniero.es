import {
  SELECTOR,
  aTimeout,
  addNewDataFile,
  cancelDeleteDataFile,
  confirmDeleteDataFile,
  deleteDataFile,
  getBrowserState,
  openDataFileSelector,
  selectDataFile,
  setMonthAndYear,
  setupBrowserHooks,
  takeScreenshot,
  verifyLocalStorage,
  verifyLocalStorageNotContains,
  verifyUrl,
} from './utils';

let screenshotIndex = 1;

describe('Lluvias app', function () {
  setupBrowserHooks();

  it('should be usable and display well', async function () {
    const { page } = getBrowserState();

    await setMonthAndYear(1, 2024);

    await verifyUrl('/');

    // verify local storage is saved
    await verifyLocalStorage('pagesWeather-defaultDataFile', '{"alias":"Jaime","url":"data/pluviometro-1.txt"}');

    // open collapsible and visit 'formato-fichero' page
    await openDataFileSelector();
    await page.locator(SELECTOR('link-file-format')).click();
    await verifyUrl('/formato-fichero');
    await takeScreenshot(`${screenshotIndex++}.file-format-page`);

    // go back to inial page
    await page.locator('[data-test-id="back-button"]').click();
    await verifyUrl('/');
    await takeScreenshot(`${screenshotIndex++}.display-pluviometro-1`);

    // add new data files
    await openDataFileSelector();
    await addNewDataFile('Patio de Mariano', 'data/pluviometro-2.txt');
    await addNewDataFile('Pedro', 'data/pluviometro-3.txt');
    await addNewDataFile('Lluvia en España', 'data/pluviometro-4.txt');
    await takeScreenshot(`${screenshotIndex++}.added-new-data-files`);

    // select data file: pluviometro-2.txt
    await selectDataFile(1, 'Patio de Mariano', 'data/pluviometro-2.txt');
    await takeScreenshot(`${screenshotIndex++}.display-pluviometro-2`);

    // select data file: pluviometro-3.txt
    await openDataFileSelector();
    await selectDataFile(2, 'Pedro', 'data/pluviometro-3.txt');
    await takeScreenshot(`${screenshotIndex++}.display-pluviometro-3`);

    // select data file: pluviometro-4.txt
    await openDataFileSelector();
    await selectDataFile(3, 'Lluvia en España', 'data/pluviometro-4.txt');
    await takeScreenshot(`${screenshotIndex++}.display-pluviometro-4`);

    // open and close day notification
    await page.locator(SELECTOR('day-12-notification')).click();
    await takeScreenshot(`${screenshotIndex++}.day-notification`);
    await page.locator(SELECTOR('close-pop-up-button')).click();

    // open and close month notification
    await page.locator(SELECTOR('month-1-2024-notification')).click();
    await takeScreenshot(`${screenshotIndex++}.month-notification`);
    await page.locator(SELECTOR('close-pop-up-button')).click();

    // open and close year notification
    await page.locator(SELECTOR('year-2024-notification')).click();
    await takeScreenshot(`${screenshotIndex++}.year-notification`);
    await page.locator(SELECTOR('close-pop-up-button')).click();

    // add and select data file: pluviometro-5.txt
    await openDataFileSelector();
    await addNewDataFile('Huerta de Juan', 'data/pluviometro-5.txt');
    await selectDataFile(4, 'Huerta de Juan', 'data/pluviometro-5.txt');
    await takeScreenshot(`${screenshotIndex++}.display-pluviometro-5`);

    // check other year of pluviometro-5.txt
    // for technical reasons is necessary to reload the file
    // buttons does not work properly (scroll does not work properly)
    await openDataFileSelector();
    await setMonthAndYear(3, 2025);
    await selectDataFile(4, 'Huerta de Juan', 'data/pluviometro-5.txt');
    await takeScreenshot(`${screenshotIndex++}.display-pluviometro-5-2025`);

    // delete data file and confirm
    await openDataFileSelector();
    await deleteDataFile(0);
    await takeScreenshot(`${screenshotIndex++}.delete-data-file-pop-up`);
    await confirmDeleteDataFile('Jaime', 'data/pluviometro-1.txt');
    await takeScreenshot(`${screenshotIndex++}.data-file-deleted`);

    // delete data file and cancel
    await deleteDataFile(2);
    await cancelDeleteDataFile('Lluvia en España', 'data/pluviometro-4.txt');
    await takeScreenshot(`${screenshotIndex++}.delete-data-file-canceled`);

    // error loading file
    await addNewDataFile('No existe', 'data/no-existe.txt');
    await page.locator(SELECTOR(`alias-option-4`)).click();
    await aTimeout(400); // wait to load the file
    await takeScreenshot(`${screenshotIndex++}.error-loading-data-file (1)`);
    await verifyLocalStorageNotContains('pagesWeather-defaultDataFile', 'No existe');
    await openDataFileSelector(); // close to take better screenshot
    await aTimeout(100);
    await takeScreenshot(`${screenshotIndex++}.error-loading-data-file (2)`);
  }, 15000);
});
