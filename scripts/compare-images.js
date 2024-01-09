const fs = require("fs");
const PNG = require("pngjs").PNG;
//const pixelmatch = require("pixelmatch");

const ORIGINAL_IMAGES_PATH = (fileName) => `e2e/screenshots/originals/${fileName}`;
const E2E_RESULTS_IMAGES_PATH = (fileName) => `e2e/screenshots/e2e-results/${fileName}`;

fs.readdirSync(E2E_RESULTS_IMAGES_PATH(''))
  .filter((f) => f.endsWith(".png"))
  .forEach((file) => {
    // read image files
    const img1 = PNG.sync.read(fs.readFileSync(ORIGINAL_IMAGES_PATH(file)));
    const img2 = PNG.sync.read(fs.readFileSync(E2E_RESULTS_IMAGES_PATH(file)));
    const { width, height } = img1;
    
    // check if images are identical
    const len = width * height;
    const a32 = new Uint32Array(img1.buffer, img1.byteOffset, len);
    const b32 = new Uint32Array(img2.buffer, img2.byteOffset, len);
    let identical = true;

    for (let i = 0; i < len; i++) {
        if (a32[i] !== b32[i]) { identical = false; break; }
    }
    if (identical) {
        console.log('identicas', file);
        return 0;
    }

    console.log('they are different ', file);

    // const diff = new PNG({ width, height });
    // const pixelsDifference = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 1 });

    // console.log(pixelsDifference);

    // fs.writeFileSync(file, PNG.sync.write(diff));
  });
