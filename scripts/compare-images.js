const fs = require("fs");
const PNG = require("pngjs").PNG;

const ORIGINAL_IMAGES_PATH = (fileName) => `e2e/screenshots/originals/${fileName}`;
const E2E_RESULTS_IMAGES_PATH = (fileName) => `e2e/screenshots/e2e-results/${fileName}`;

const PIXEL_THRESHOLD = 25; // difference of color in pixels to consider them different
const THRESHOLD_IMAGE = 0.05; // percentage of different pixels to consider the image different

fs.readdirSync(E2E_RESULTS_IMAGES_PATH(""))
  .filter((f) => f.endsWith(".png"))
  .forEach((file) => {
    // read image files
    const img1 = PNG.sync.read(fs.readFileSync(ORIGINAL_IMAGES_PATH(file)));
    const img2 = PNG.sync.read(fs.readFileSync(E2E_RESULTS_IMAGES_PATH(file)));
    const { width, height } = img1; // 1.320.000 pixels (viewport 1100 x 1200)

    // calculate the number of different pixels
    let difference = 0;
    let similar = true;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;

        const average1 = (img1.data[idx] + img1.data[idx + 1] + img1.data[idx + 2]) / 3;
        const average2 = (img2.data[idx] + img2.data[idx + 1] + img2.data[idx + 2]) / 3;

        if (Math.abs(average1 - average2) > PIXEL_THRESHOLD) {
          difference++;

          if (difference > img1.data.length * THRESHOLD_IMAGE) {
            similar = false;
            break;
          }
        }
      }
    }

    console.log(`Resultado similar: ${similar}. Diferencia pixels: ${difference}. Fichero: ${file}`);
  });
