import { setupBrowserHooks, getBrowserState } from './utils';

describe('Lluvias app', function () {
  setupBrowserHooks();

  it('should TODO', async function () {
    const { page } = getBrowserState();

    await page.screenshot({path: 'screenshot'})
  });
});
