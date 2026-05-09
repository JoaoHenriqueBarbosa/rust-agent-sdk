// var: require_conversions
var require_conversions = __commonJS((exports, module) => {
  var cssKeywords = require_color_name(), reverseKeywords = {};
  for (let key of Object.keys(cssKeywords))
    reverseKeywords[cssKeywords[key]] = key;
  var convert = {
    rgb: { channels: 3, labels: "rgb" },
    hsl: { channels: 3, labels: "hsl" },
    hsv: { channels: 3, labels: "hsv" },
    hwb: { channels: 3, labels: "hwb" },
    cmyk: { channels: 4, labels: "cmyk" },
    xyz: { channels: 3, labels: "xyz" },
    lab: { channels: 3, labels: "lab" },
    lch: { channels: 3, labels: "lch" },
    hex: { channels: 1, labels: ["hex"] },
    keyword: { channels: 1, labels: ["keyword"] },
    ansi16: { channels: 1, labels: ["ansi16"] },
    ansi256: { channels: 1, labels: ["ansi256"] },
    hcg: { channels: 3, labels: ["h", "c", "g"] },
    apple: { channels: 3, labels: ["r16", "g16", "b16"] },
    gray: { channels: 1, labels: ["gray"] }
  };
  module.exports = convert;
  for (let model of Object.keys(convert)) {
    if (!("channels" in convert[model]))
      throw Error("missing channels property: " + model);
    if (!("labels" in convert[model]))
      throw Error("missing channel labels property: " + model);
    if (convert[model].labels.length !== convert[model].channels)
      throw Error("channel and label counts mismatch: " + model);
    let { channels, labels } = convert[model];
    delete convert[model].channels, delete convert[model].labels, Object.defineProperty(convert[model], "channels", { value: channels }), Object.defineProperty(convert[model], "labels", { value: labels });
  }
  convert.rgb.hsl = function(rgb2) {
    let r4 = rgb2[0] / 255, g = rgb2[1] / 255, b = rgb2[2] / 255, min = Math.min(r4, g, b), max = Math.max(r4, g, b), delta = max - min, h4, s2;
    if (max === min)
      h4 = 0;
    else if (r4 === max)
      h4 = (g - b) / delta;
    else if (g === max)
      h4 = 2 + (b - r4) / delta;
    else if (b === max)
      h4 = 4 + (r4 - g) / delta;
    if (h4 = Math.min(h4 * 60, 360), h4 < 0)
      h4 += 360;
    let l3 = (min + max) / 2;
    if (max === min)
      s2 = 0;
    else if (l3 <= 0.5)
      s2 = delta / (max + min);
    else
      s2 = delta / (2 - max - min);
    return [h4, s2 * 100, l3 * 100];
  };
  convert.rgb.hsv = function(rgb2) {
    let rdif, gdif, bdif, h4, s2, r4 = rgb2[0] / 255, g = rgb2[1] / 255, b = rgb2[2] / 255, v2 = Math.max(r4, g, b), diff2 = v2 - Math.min(r4, g, b), diffc = function(c3) {
      return (v2 - c3) / 6 / diff2 + 0.5;
    };
    if (diff2 === 0)
      h4 = 0, s2 = 0;
    else {
      if (s2 = diff2 / v2, rdif = diffc(r4), gdif = diffc(g), bdif = diffc(b), r4 === v2)
        h4 = bdif - gdif;
      else if (g === v2)
        h4 = 0.3333333333333333 + rdif - bdif;
      else if (b === v2)
        h4 = 0.6666666666666666 + gdif - rdif;
      if (h4 < 0)
        h4 += 1;
      else if (h4 > 1)
        h4 -= 1;
    }
    return [
      h4 * 360,
      s2 * 100,
      v2 * 100
    ];
  };
  convert.rgb.hwb = function(rgb2) {
    let r4 = rgb2[0], g = rgb2[1], b = rgb2[2], h4 = convert.rgb.hsl(rgb2)[0], w2 = 0.00392156862745098 * Math.min(r4, Math.min(g, b));
    return b = 1 - 0.00392156862745098 * Math.max(r4, Math.max(g, b)), [h4, w2 * 100, b * 100];
  };
  convert.rgb.cmyk = function(rgb2) {
    let r4 = rgb2[0] / 255, g = rgb2[1] / 255, b = rgb2[2] / 255, k3 = Math.min(1 - r4, 1 - g, 1 - b), c3 = (1 - r4 - k3) / (1 - k3) || 0, m4 = (1 - g - k3) / (1 - k3) || 0, y2 = (1 - b - k3) / (1 - k3) || 0;
    return [c3 * 100, m4 * 100, y2 * 100, k3 * 100];
  };
  function comparativeDistance(x3, y2) {
    return (x3[0] - y2[0]) ** 2 + (x3[1] - y2[1]) ** 2 + (x3[2] - y2[2]) ** 2;
  }
  convert.rgb.keyword = function(rgb2) {
    let reversed = reverseKeywords[rgb2];
    if (reversed)
      return reversed;
    let currentClosestDistance = 1 / 0, currentClosestKeyword;
    for (let keyword of Object.keys(cssKeywords)) {
      let value = cssKeywords[keyword], distance = comparativeDistance(rgb2, value);
      if (distance < currentClosestDistance)
        currentClosestDistance = distance, currentClosestKeyword = keyword;
    }
    return currentClosestKeyword;
  };
  convert.keyword.rgb = function(keyword) {
    return cssKeywords[keyword];
  };
  convert.rgb.xyz = function(rgb2) {
    let r4 = rgb2[0] / 255, g = rgb2[1] / 255, b = rgb2[2] / 255;
    r4 = r4 > 0.04045 ? ((r4 + 0.055) / 1.055) ** 2.4 : r4 / 12.92, g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92, b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
    let x3 = r4 * 0.4124 + g * 0.3576 + b * 0.1805, y2 = r4 * 0.2126 + g * 0.7152 + b * 0.0722, z2 = r4 * 0.0193 + g * 0.1192 + b * 0.9505;
    return [x3 * 100, y2 * 100, z2 * 100];
  };
  convert.rgb.lab = function(rgb2) {
    let xyz = convert.rgb.xyz(rgb2), x3 = xyz[0], y2 = xyz[1], z2 = xyz[2];
    x3 /= 95.047, y2 /= 100, z2 /= 108.883, x3 = x3 > 0.008856 ? x3 ** 0.3333333333333333 : 7.787 * x3 + 0.13793103448275862, y2 = y2 > 0.008856 ? y2 ** 0.3333333333333333 : 7.787 * y2 + 0.13793103448275862, z2 = z2 > 0.008856 ? z2 ** 0.3333333333333333 : 7.787 * z2 + 0.13793103448275862;
    let l3 = 116 * y2 - 16, a2 = 500 * (x3 - y2), b = 200 * (y2 - z2);
    return [l3, a2, b];
  };
  convert.hsl.rgb = function(hsl) {
    let h4 = hsl[0] / 360, s2 = hsl[1] / 100, l3 = hsl[2] / 100, t2, t3, val;
    if (s2 === 0)
      return val = l3 * 255, [val, val, val];
    if (l3 < 0.5)
      t2 = l3 * (1 + s2);
    else
      t2 = l3 + s2 - l3 * s2;
    let t1 = 2 * l3 - t2, rgb2 = [0, 0, 0];
    for (let i4 = 0;i4 < 3; i4++) {
      if (t3 = h4 + 0.3333333333333333 * -(i4 - 1), t3 < 0)
        t3++;
      if (t3 > 1)
        t3--;
      if (6 * t3 < 1)
        val = t1 + (t2 - t1) * 6 * t3;
      else if (2 * t3 < 1)
        val = t2;
      else if (3 * t3 < 2)
        val = t1 + (t2 - t1) * (0.6666666666666666 - t3) * 6;
      else
        val = t1;
      rgb2[i4] = val * 255;
    }
    return rgb2;
  };
  convert.hsl.hsv = function(hsl) {
    let h4 = hsl[0], s2 = hsl[1] / 100, l3 = hsl[2] / 100, smin = s2, lmin = Math.max(l3, 0.01);
    l3 *= 2, s2 *= l3 <= 1 ? l3 : 2 - l3, smin *= lmin <= 1 ? lmin : 2 - lmin;
    let v2 = (l3 + s2) / 2, sv = l3 === 0 ? 2 * smin / (lmin + smin) : 2 * s2 / (l3 + s2);
    return [h4, sv * 100, v2 * 100];
  };
  convert.hsv.rgb = function(hsv) {
    let h4 = hsv[0] / 60, s2 = hsv[1] / 100, v2 = hsv[2] / 100, hi = Math.floor(h4) % 6, f = h4 - Math.floor(h4), p4 = 255 * v2 * (1 - s2), q4 = 255 * v2 * (1 - s2 * f), t2 = 255 * v2 * (1 - s2 * (1 - f));
    switch (v2 *= 255, hi) {
      case 0:
        return [v2, t2, p4];
      case 1:
        return [q4, v2, p4];
      case 2:
        return [p4, v2, t2];
      case 3:
        return [p4, q4, v2];
      case 4:
        return [t2, p4, v2];
      case 5:
        return [v2, p4, q4];
    }
  };
  convert.hsv.hsl = function(hsv) {
    let h4 = hsv[0], s2 = hsv[1] / 100, v2 = hsv[2] / 100, vmin = Math.max(v2, 0.01), sl, l3;
    l3 = (2 - s2) * v2;
    let lmin = (2 - s2) * vmin;
    return sl = s2 * vmin, sl /= lmin <= 1 ? lmin : 2 - lmin, sl = sl || 0, l3 /= 2, [h4, sl * 100, l3 * 100];
  };
  convert.hwb.rgb = function(hwb) {
    let h4 = hwb[0] / 360, wh = hwb[1] / 100, bl = hwb[2] / 100, ratio = wh + bl, f;
    if (ratio > 1)
      wh /= ratio, bl /= ratio;
    let i4 = Math.floor(6 * h4), v2 = 1 - bl;
    if (f = 6 * h4 - i4, (i4 & 1) !== 0)
      f = 1 - f;
    let n5 = wh + f * (v2 - wh), r4, g, b;
    switch (i4) {
      default:
      case 6:
      case 0:
        r4 = v2, g = n5, b = wh;
        break;
      case 1:
        r4 = n5, g = v2, b = wh;
        break;
      case 2:
        r4 = wh, g = v2, b = n5;
        break;
      case 3:
        r4 = wh, g = n5, b = v2;
        break;
      case 4:
        r4 = n5, g = wh, b = v2;
        break;
      case 5:
        r4 = v2, g = wh, b = n5;
        break;
    }
    return [r4 * 255, g * 255, b * 255];
  };
  convert.cmyk.rgb = function(cmyk) {
    let c3 = cmyk[0] / 100, m4 = cmyk[1] / 100, y2 = cmyk[2] / 100, k3 = cmyk[3] / 100, r4 = 1 - Math.min(1, c3 * (1 - k3) + k3), g = 1 - Math.min(1, m4 * (1 - k3) + k3), b = 1 - Math.min(1, y2 * (1 - k3) + k3);
    return [r4 * 255, g * 255, b * 255];
  };
  convert.xyz.rgb = function(xyz) {
    let x3 = xyz[0] / 100, y2 = xyz[1] / 100, z2 = xyz[2] / 100, r4, g, b;
    return r4 = x3 * 3.2406 + y2 * -1.5372 + z2 * -0.4986, g = x3 * -0.9689 + y2 * 1.8758 + z2 * 0.0415, b = x3 * 0.0557 + y2 * -0.204 + z2 * 1.057, r4 = r4 > 0.0031308 ? 1.055 * r4 ** 0.4166666666666667 - 0.055 : r4 * 12.92, g = g > 0.0031308 ? 1.055 * g ** 0.4166666666666667 - 0.055 : g * 12.92, b = b > 0.0031308 ? 1.055 * b ** 0.4166666666666667 - 0.055 : b * 12.92, r4 = Math.min(Math.max(0, r4), 1), g = Math.min(Math.max(0, g), 1), b = Math.min(Math.max(0, b), 1), [r4 * 255, g * 255, b * 255];
  };
  convert.xyz.lab = function(xyz) {
    let x3 = xyz[0], y2 = xyz[1], z2 = xyz[2];
    x3 /= 95.047, y2 /= 100, z2 /= 108.883, x3 = x3 > 0.008856 ? x3 ** 0.3333333333333333 : 7.787 * x3 + 0.13793103448275862, y2 = y2 > 0.008856 ? y2 ** 0.3333333333333333 : 7.787 * y2 + 0.13793103448275862, z2 = z2 > 0.008856 ? z2 ** 0.3333333333333333 : 7.787 * z2 + 0.13793103448275862;
    let l3 = 116 * y2 - 16, a2 = 500 * (x3 - y2), b = 200 * (y2 - z2);
    return [l3, a2, b];
  };
  convert.lab.xyz = function(lab) {
    let l3 = lab[0], a2 = lab[1], b = lab[2], x3, y2, z2;
    y2 = (l3 + 16) / 116, x3 = a2 / 500 + y2, z2 = y2 - b / 200;
    let y22 = y2 ** 3, x22 = x3 ** 3, z22 = z2 ** 3;
    return y2 = y22 > 0.008856 ? y22 : (y2 - 0.13793103448275862) / 7.787, x3 = x22 > 0.008856 ? x22 : (x3 - 0.13793103448275862) / 7.787, z2 = z22 > 0.008856 ? z22 : (z2 - 0.13793103448275862) / 7.787, x3 *= 95.047, y2 *= 100, z2 *= 108.883, [x3, y2, z2];
  };
  convert.lab.lch = function(lab) {
    let l3 = lab[0], a2 = lab[1], b = lab[2], h4;
    if (h4 = Math.atan2(b, a2) * 360 / 2 / Math.PI, h4 < 0)
      h4 += 360;
    let c3 = Math.sqrt(a2 * a2 + b * b);
    return [l3, c3, h4];
  };
  convert.lch.lab = function(lch) {
    let l3 = lch[0], c3 = lch[1], hr = lch[2] / 360 * 2 * Math.PI, a2 = c3 * Math.cos(hr), b = c3 * Math.sin(hr);
    return [l3, a2, b];
  };
  convert.rgb.ansi16 = function(args, saturation = null) {
    let [r4, g, b] = args, value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
    if (value = Math.round(value / 50), value === 0)
      return 30;
    let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r4 / 255));
    if (value === 2)
      ansi += 60;
    return ansi;
  };
  convert.hsv.ansi16 = function(args) {
    return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
  };
  convert.rgb.ansi256 = function(args) {
    let r4 = args[0], g = args[1], b = args[2];
    if (r4 === g && g === b) {
      if (r4 < 8)
        return 16;
      if (r4 > 248)
        return 231;
      return Math.round((r4 - 8) / 247 * 24) + 232;
    }
    return 16 + 36 * Math.round(r4 / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
  };
  convert.ansi16.rgb = function(args) {
    let color2 = args % 10;
    if (color2 === 0 || color2 === 7) {
      if (args > 50)
        color2 += 3.5;
      return color2 = color2 / 10.5 * 255, [color2, color2, color2];
    }
    let mult = (~~(args > 50) + 1) * 0.5, r4 = (color2 & 1) * mult * 255, g = (color2 >> 1 & 1) * mult * 255, b = (color2 >> 2 & 1) * mult * 255;
    return [r4, g, b];
  };
  convert.ansi256.rgb = function(args) {
    if (args >= 232) {
      let c3 = (args - 232) * 10 + 8;
      return [c3, c3, c3];
    }
    args -= 16;
    let rem, r4 = Math.floor(args / 36) / 5 * 255, g = Math.floor((rem = args % 36) / 6) / 5 * 255, b = rem % 6 / 5 * 255;
    return [r4, g, b];
  };
  convert.rgb.hex = function(args) {
    let string4 = (((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255)).toString(16).toUpperCase();
    return "000000".substring(string4.length) + string4;
  };
  convert.hex.rgb = function(args) {
    let match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!match)
      return [0, 0, 0];
    let colorString = match[0];
    if (match[0].length === 3)
      colorString = colorString.split("").map((char) => {
        return char + char;
      }).join("");
    let integer2 = parseInt(colorString, 16), r4 = integer2 >> 16 & 255, g = integer2 >> 8 & 255, b = integer2 & 255;
    return [r4, g, b];
  };
  convert.rgb.hcg = function(rgb2) {
    let r4 = rgb2[0] / 255, g = rgb2[1] / 255, b = rgb2[2] / 255, max = Math.max(Math.max(r4, g), b), min = Math.min(Math.min(r4, g), b), chroma = max - min, grayscale, hue;
    if (chroma < 1)
      grayscale = min / (1 - chroma);
    else
      grayscale = 0;
    if (chroma <= 0)
      hue = 0;
    else if (max === r4)
      hue = (g - b) / chroma % 6;
    else if (max === g)
      hue = 2 + (b - r4) / chroma;
    else
      hue = 4 + (r4 - g) / chroma;
    return hue /= 6, hue %= 1, [hue * 360, chroma * 100, grayscale * 100];
  };
  convert.hsl.hcg = function(hsl) {
    let s2 = hsl[1] / 100, l3 = hsl[2] / 100, c3 = l3 < 0.5 ? 2 * s2 * l3 : 2 * s2 * (1 - l3), f = 0;
    if (c3 < 1)
      f = (l3 - 0.5 * c3) / (1 - c3);
    return [hsl[0], c3 * 100, f * 100];
  };
  convert.hsv.hcg = function(hsv) {
    let s2 = hsv[1] / 100, v2 = hsv[2] / 100, c3 = s2 * v2, f = 0;
    if (c3 < 1)
      f = (v2 - c3) / (1 - c3);
    return [hsv[0], c3 * 100, f * 100];
  };
  convert.hcg.rgb = function(hcg) {
    let h4 = hcg[0] / 360, c3 = hcg[1] / 100, g = hcg[2] / 100;
    if (c3 === 0)
      return [g * 255, g * 255, g * 255];
    let pure = [0, 0, 0], hi = h4 % 1 * 6, v2 = hi % 1, w2 = 1 - v2, mg = 0;
    switch (Math.floor(hi)) {
      case 0:
        pure[0] = 1, pure[1] = v2, pure[2] = 0;
        break;
      case 1:
        pure[0] = w2, pure[1] = 1, pure[2] = 0;
        break;
      case 2:
        pure[0] = 0, pure[1] = 1, pure[2] = v2;
        break;
      case 3:
        pure[0] = 0, pure[1] = w2, pure[2] = 1;
        break;
      case 4:
        pure[0] = v2, pure[1] = 0, pure[2] = 1;
        break;
      default:
        pure[0] = 1, pure[1] = 0, pure[2] = w2;
    }
    return mg = (1 - c3) * g, [
      (c3 * pure[0] + mg) * 255,
      (c3 * pure[1] + mg) * 255,
      (c3 * pure[2] + mg) * 255
    ];
  };
  convert.hcg.hsv = function(hcg) {
    let c3 = hcg[1] / 100, g = hcg[2] / 100, v2 = c3 + g * (1 - c3), f = 0;
    if (v2 > 0)
      f = c3 / v2;
    return [hcg[0], f * 100, v2 * 100];
  };
  convert.hcg.hsl = function(hcg) {
    let c3 = hcg[1] / 100, l3 = hcg[2] / 100 * (1 - c3) + 0.5 * c3, s2 = 0;
    if (l3 > 0 && l3 < 0.5)
      s2 = c3 / (2 * l3);
    else if (l3 >= 0.5 && l3 < 1)
      s2 = c3 / (2 * (1 - l3));
    return [hcg[0], s2 * 100, l3 * 100];
  };
  convert.hcg.hwb = function(hcg) {
    let c3 = hcg[1] / 100, g = hcg[2] / 100, v2 = c3 + g * (1 - c3);
    return [hcg[0], (v2 - c3) * 100, (1 - v2) * 100];
  };
  convert.hwb.hcg = function(hwb) {
    let w2 = hwb[1] / 100, v2 = 1 - hwb[2] / 100, c3 = v2 - w2, g = 0;
    if (c3 < 1)
      g = (v2 - c3) / (1 - c3);
    return [hwb[0], c3 * 100, g * 100];
  };
  convert.apple.rgb = function(apple) {
    return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
  };
  convert.rgb.apple = function(rgb2) {
    return [rgb2[0] / 255 * 65535, rgb2[1] / 255 * 65535, rgb2[2] / 255 * 65535];
  };
  convert.gray.rgb = function(args) {
    return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
  };
  convert.gray.hsl = function(args) {
    return [0, 0, args[0]];
  };
  convert.gray.hsv = convert.gray.hsl;
  convert.gray.hwb = function(gray2) {
    return [0, 100, gray2[0]];
  };
  convert.gray.cmyk = function(gray2) {
    return [0, 0, 0, gray2[0]];
  };
  convert.gray.lab = function(gray2) {
    return [gray2[0], 0, 0];
  };
  convert.gray.hex = function(gray2) {
    let val = Math.round(gray2[0] / 100 * 255) & 255, string4 = ((val << 16) + (val << 8) + val).toString(16).toUpperCase();
    return "000000".substring(string4.length) + string4;
  };
  convert.rgb.gray = function(rgb2) {
    return [(rgb2[0] + rgb2[1] + rgb2[2]) / 3 / 255 * 100];
  };
});
