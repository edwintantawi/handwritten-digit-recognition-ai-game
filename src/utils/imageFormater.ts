const formatImageAlphaColor = (data: Uint8ClampedArray) => {
  const pixels = [];

  const ALPHA_COLOR_INDEX = 3;
  for (var i = 0; i < data.length; i += 4) {
    pixels.push(data[i + ALPHA_COLOR_INDEX]);
  }

  return pixels;
};

export { formatImageAlphaColor };
