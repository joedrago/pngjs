#!/usr/bin/env node

var fs = require('fs');
var PNG = require("../lib/png").PNG;
var w = 32;
var h = 64;

/// RGBA input (color type 6)
var buffer = new Buffer(2 * w * h * 4);
var bitmap = new Uint16Array(buffer.buffer);
for (var i = 0; i < h; i++) {
  for (var j = 0; j < w; j++) {
    bitmap[i * 4 * w + 4*j] = i * 65535 / h;
    bitmap[i * 4 * w + 4*j + 1] = j * 65535 / w;
    bitmap[i * 4 * w + 4*j + 2] = (h-i) * 65535 / h;
    bitmap[i * 4 * w + 4*j + 3] = 65535;
  }
}

var png = new PNG({
  width: w,
  height:h,
  bitDepth: 16,
  colorType: 6,
  inputColorType: 6,
  inputHasAlpha: true,
  iccp: {
    name: "sRGB2014",
    profile: fs.readFileSync(__dirname + "/sRGB2014.icc")
  }
});

png.data = buffer;

// Sync API
fs.writeFileSync('iccp_sync.png', PNG.sync.write(png));

// Async API
png.pack().pipe(fs.createWriteStream('iccp_async.png'));
