import * as puppeteer from 'puppeteer';
import { onRequestInterceptor } from './pluviometros.mocks';

const baseUrl = process.env['baseUrl'] ?? 'http://localhost:4200/';
let browser: puppeteer.Browser;
let page: puppeteer.Page;

export function setupBrowserHooks(path = ''): void {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new' });
  });

  beforeEach(async () => {
    page = await browser.newPage();

    await page.setViewport({ width: 1100, height: 1200 });

    await page.setRequestInterception(true);
    page.on('request', onRequestInterceptor);

    await page.goto(`${baseUrl}${path}`);
  });

  afterEach(async () => {
    await page.evaluate(() => localStorage.clear());
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });
}

export function getBrowserState(): {
  browser: puppeteer.Browser;
  page: puppeteer.Page;
  baseUrl: string;
} {
  if (!browser) {
    throw new Error('No browser state found! Ensure `setupBrowserHooks()` is called.');
  }
  return {
    browser,
    page,
    baseUrl,
  };
}

/*************************************** CUSTOM FUNCTIONS AND CONSTANTS  ***************************************/

export const SELECTOR = (dataTestId: string) => `[data-test-id="${dataTestId}"]`;

export async function takeScreenshot(fileName: string) {
  await aTimeout(700);
  await page.screenshot({ path: `./e2e/screenshots/e2e-results/${fileName}.png` });
}

export async function verifyUrl(pathname: string) {
  let url = await page.url();
  expect(new URL(url).pathname).toBe(pathname);
}

export function aTimeout(milliseconds: number) {
  return new Promise((r) => setTimeout(r, milliseconds));
}

export async function verifyLocalStorage(localStorageKey: string, expectedValue: string) {
  let value = await page.evaluate((key) => localStorage.getItem(key), localStorageKey);
  expect(value).toEqual(expectedValue);
}

export async function verifyLocalStorageContains(localStorageKey: string, expectedValue: string) {
  let value = await page.evaluate((key) => localStorage.getItem(key), localStorageKey);
  expect(value).toContain(expectedValue);
}

export async function verifyLocalStorageNotContains(localStorageKey: string, expectedValue: string) {
  let value = await page.evaluate((key) => localStorage.getItem(key), localStorageKey);
  expect(value).not.toContain(expectedValue);
}

export async function openDataFileSelector() {
  await page.locator(SELECTOR('select-data-collapsible')).click();
  await aTimeout(300); // wait to expand completely
}

export async function addNewDataFile(alias: string, url: string) {
  await page.type(SELECTOR('new-data-file-input'), `${alias}:${url}`);
  await page.locator(SELECTOR('new-data-file-submit')).click();
  await verifyLocalStorageContains('pagesWeather-dataFiles', `{"alias":"${alias}","url":"${url}"}`);
}

export async function deleteDataFile(index: number) {
  await page.locator(SELECTOR(`delete-data-file-option-${index}`)).click();
  await aTimeout(100);
}

export async function confirmDeleteDataFile(alias: string, url: string) {
  await page.locator('[data-test-id="delete-file-button"]').click();
  await verifyLocalStorageNotContains('pagesWeather-dataFiles', `{"alias":"${alias}","url":"${url}"}`);
}

export async function cancelDeleteDataFile(alias: string, url: string) {
  await page.locator(SELECTOR('keep-file-button')).click();
  await verifyLocalStorageContains('pagesWeather-dataFiles', `{"alias":"${alias}","url":"${url}"}`);
}

export async function selectDataFile(index: number, alias: string, url: string) {
  const element = await page.waitForSelector(SELECTOR(`alias-option-${index}`));
  const value = await element!.evaluate((el) => el.textContent);
  expect(value).toContain(alias);

  await page.locator(SELECTOR(`alias-option-${index}`)).click();
  await aTimeout(500); // wait to load the file
  await verifyLocalStorage('pagesWeather-defaultDataFile', `{"alias":"${alias}","url":"${url}"}`);
}

export async function setMonthAndYear(month: number, year: number) {
  await page.evaluate(
    (month, year) => {
      Date.prototype.getFullYear = function () {
        return year;
      };
      Date.prototype.getMonth = function () {
        return month - 1;
      };
    },
    month,
    year
  );
}

export async function showPrevMonth() {
  await page.locator(SELECTOR('btn-show-prev-month')).click();
  await aTimeout(300); // wait to scroll?
}

export async function showNextMonth() {
  await page.locator(SELECTOR('btn-show-next-month')).click();
  await aTimeout(300); // wait to scroll?
}

export async function showPrevYear() {
  await page.locator(SELECTOR('btn-show-prev-year')).click();
  await aTimeout(300); // wait to scroll?
}

export async function showNextYear() {
  await page.locator(SELECTOR('btn-show-next-year')).click();
  await aTimeout(300); // wait to scroll?
}
