/**
 * 判断字符串是否是有效的颜色字符串
 * @param {String} color 颜色字符串
 * @return {Boolean}
 */
export function isValidColor(color) {
	try {
		return Boolean(getColorFormat(color))
	} catch (e) {
		return false
	}
}

/**
 * 判断字符串是 HSL、RGB 还是 HEX 颜色格式
 * @param {String} color 颜色字符串
 * @return {String} - 返回 "hex", "rgb", "hsl" 或 "invalid"
 */
export function getColorFormat(color) {
	// 正则表达式模式
	const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
	const rgbPattern =
		/^rgb\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*(?:[,\/]\s*([01](?:\.\d+)?|0?\.\d+|\d+%?)\s*)?\)$/;
	const rgbaPattern =
		/^rgba\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[,\/]\s*([01](?:\.\d+)?|0?\.\d+|\d+%?)\s*\)$/;
	const hslPattern =
		/^hsl\(\s*(-?\d*\.?\d+(?:deg|rad|turn)?)\s*[, ]\s*(\d+%?)\s*[, ]\s*(\d+%?)\s*(?:[,\/]\s*([01](?:\.\d+)?|0?\.\d+|\d+%)\s*)?\)$/i;
	const hslaPattern =
		/^hsla\(\s*(-?\d*\.?\d+(?:deg|rad|turn)?)\s*[, ]\s*(\d+%?)\s*[, ]\s*(\d+%?)\s*[,\/]\s*([01](?:\.\d+)?|0?\.\d+|\d+%)\s*\)$/i;

	// 去除可能存在的空格
	color = color.trim();

	// 判断颜色字符串格式
	if (hexPattern.test(color)) {
		return "hex";
	} else if (rgbPattern.test(color) || rgbaPattern.test(color)) {
		return "rgb";
	} else if (hslPattern.test(color) || hslaPattern.test(color)) {
		return "hsl";
	} else {
		throw new Error('无效的颜色格式');
	}
}


/**
 * 根据背景颜色获得差异色
 * @param {String | Array} bgColor 背景颜色（可以是字符串格式：hex, rgb, rgba，或 RGB 数组）
 * @return {String} HEX颜色字符串
 */
export function getContrastColor(bgColor) {
	let r, g, b;

	if (typeof bgColor === 'string') {
		if (bgColor.startsWith('#')) {
			// 处理hex格式
			let hexColor = bgColor.replace("#", "");
			if (hexColor.length === 3) {
				hexColor = hexColor.split('').map(hex => hex + hex).join('');
			}
			if (hexColor.length === 8) {
				// 如果是8位hex，提取透明度部分
				const alpha = parseInt(hexColor.substring(6, 8), 16) / 255;
				hexColor = hexColor.substring(0, 6);
			}
			r = parseInt(hexColor.substring(0, 2), 16);
			g = parseInt(hexColor.substring(2, 4), 16);
			b = parseInt(hexColor.substring(4, 6), 16);
		} else if (bgColor.startsWith('rgb')) {
			// 处理rgb或rgba格式
			const rgbValues = bgColor.match(/(\d+\.?\d*)/g).map(Number);
			[r, g, b] = rgbValues;
		} else {
			throw new Error('不支持的颜色格式');
		}
	} else if (Array.isArray(bgColor)) {
		[r, g, b] = bgColor;
	} else {
		throw new Error('无效的颜色格式');
	}

	// 计算相对亮度
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	// 根据相对亮度返回相应的前景颜色
	return brightness > 128 ? "#000000" : "#ffffff";
}


/**
 * 将 HEX 颜色代码转换为 RGB 
 * @param {String} hex - HEX 颜色代码
 * @return {Array} - 包含 [r, g, b, a] 的颜色数组
 */
export function hexToRgb(hex) {
	// 去除可能存在的 # 号
	hex = hex.replace(/^#/, '');

	// 如果 hex 是缩写形式，扩展成完整形式
	if (hex.length === 3) {
		hex = hex.split('').map(char => char + char).join('');
	} else if (hex.length === 4) {
		hex = hex.split('').map(char => char + char).join('');
	}

	let r, g, b, a;

	if (hex.length === 6) {
		r = parseInt(hex.substring(0, 2), 16);
		g = parseInt(hex.substring(2, 4), 16);
		b = parseInt(hex.substring(4, 6), 16);
		return [r, g, b, 1]; // 6 位 HEX 代码默认透明度为 1
	} else if (hex.length === 8) {
		r = parseInt(hex.substring(0, 2), 16);
		g = parseInt(hex.substring(2, 4), 16);
		b = parseInt(hex.substring(4, 6), 16);
		a = (parseInt(hex.substring(6, 8), 16) / 255).toFixed(1);
		return [r, g, b, parseFloat(a)];
	} else {
		throw new Error('无效的HEX颜色格式');
	}
}

/**
 * 将 HEX 颜色代码转换为 HSL 
 * @param {String} hex - HEX 颜色代码
 * @return {Array} - 包含 [h, s, l, a] 的颜色数组
 */
export function hexToHsl(hex) {
	const rgb = hexToRgb(hex)
	return rgbToHsl(rgb)
}

/**
 * 将RGB或RGBA数组转换为HEX颜色代码
 * @param {Array} rgb rgb数组，例：[255,0,0] 或 [255,0,0,0.5]
 * @return {String}  HEX颜色代码，例：#ff0000 或 #ff000080
 */
export function rgbToHex(rgb) {
	const [r, g, b, a] = rgb;
	const hexR = r.toString(16).padStart(2, '0');
	const hexG = g.toString(16).padStart(2, '0');
	const hexB = b.toString(16).padStart(2, '0');
	const hexA = a !== undefined ? Math.round(a * 255).toString(16).padStart(2, '0') : '';
	const hexColor = `#${hexR}${hexG}${hexB}${a === 1?'':hexA}`;

	return hexColor.toUpperCase(); // 将颜色代码转换为大写形式并返回
}


/**
 * hsl转换为hex
 * @param {Array} hsl hsl或hsla数组，例:[0,100,50]或[0,100,50,0.5]
 * @return {Array} 返回值为hex字符串
 */
export function hslToHex(hsl) {
	const rgb = hslToRgb(hsl)
	return rgbToHex(rgb)
}

/**
 * hsl转换为rgb
 * @param {Array} hsl hsl数组，例:[0,100,50]
 * @return {Array} 返回值为rgb数组，例:[255,0,0]
 */
export function hslToRgb(hsl) {
	const h = (hsl[0] % 360) / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	const a = hsl.length === 4 ? hsl[3] : 1;

	let r, g, b;

	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	r = Math.round(r * 255);
	g = Math.round(g * 255);
	b = Math.round(b * 255);

	return [r, g, b, a];
}

/**
 * rgb转换为hsl
 * @param {Array} rgb rgb或rgba数组，例:[255,0,0]或[255,0,0,0.5]
 * @return {Array} 返回值为hsl数组，例:[0,100,50,0.5]
 */
export function rgbToHsl(rgb) {
	let [r, g, b, a = 1] = rgb.map((v, i) => (i < 3 ? v / 255 : v)); // 只对 r, g, b 进行归一化
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100), a];
}


/**
 * 提取rgb或rgba数值
 * @param {Object} colorString rgb或rgba的字符串
 * @return {Array} rgba的数组
 */
export function extractRgbValues(colorString) {
	// 正则表达式匹配 rgb(R G B) 或 rgba(R G B A) 或 rgb(R,G,B) 或 rgba(R,G,B,A) 格式，并捕获 R, G, B 和 A 部分
	const regex = /rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})(?:\s*[, ]\s*(\d*(?:\.\d+)?))?\s*\)/;
	const match = colorString.match(regex);

	if (match) {
		// 提取匹配到的 R, G, B 值，A 值如果存在也提取
		const r = parseInt(match[1]);
		const g = parseInt(match[2]);
		const b = parseInt(match[3]);
		const a = match[4] !== undefined ? parseFloat(match[4]) : 1; // 默认透明度为 1

		// 返回 RGB 和 A 值
		return [r, g, b, a];
	} else {
		throw new Error('RGB 或 RGBA 颜色格式无效');
	}
}

/**
 * 提取HSL或HSLA颜色字符串中的数值
 * @param {String} color HSL或HSLA颜色字符串
 * @return {Object} 返回值对象，例：[0, 80, 50, 0.25]
 */
export function extractHslValues(color) {
	// 正则表达式匹配HSL或HSLA颜色字符串
	const hslPattern =
		/hsla?\(\s*(\d+\.?\d*|\d*\.?\d+(?:deg|turn)?)\s*[, ]?\s*(\d+)%\s*[, ]?\s*(\d+)%\s*(?:[,\/ ]?\s*(\d*\.?\d+%?))?\s*\)/i;
	const match = color.match(hslPattern);

	if (!match) {
		throw new Error('HSL 或 HSLA 颜色格式无效');
	}

	// 提取匹配的值
	let h = match[1];
	if (h.includes('turn')) {
		h = parseFloat(h) * 360; // 将turn转换为度
	} else if (h.includes('deg')) {
		h = parseFloat(h); // 去掉deg
	} else {
		h = parseFloat(h); // 直接是数值
	}

	const s = parseInt(match[2], 10);
	const l = parseInt(match[3], 10);
	let a = 1; // 默认alpha值为1

	if (match[4] !== undefined) {
		if (match[4].includes('%')) {
			a = parseFloat(match[4]) / 100;
		} else {
			a = parseFloat(match[4]);
		}
	}

	return [h, s, l, a];
}

/**
 * 提取字符串颜色值混合对象
 * @param {String} color 颜色字符串，支持rgb,rgba,hsl,hsla,hex格式
 * @@return {Object} {r,g,b,h,s,l,a,hex}
 */
export function extractColor(color) {
	const type = getColorFormat(color)
	let r, g, b, h, s, l, a, hex
	if (type == 'rgb') {
		[r, g, b, a] = extractRgbValues(color);
		[h, s, l] = rgbToHsl([r, g, b])
		hex = rgbToHex([r, g, b, a])
	} else if (type == 'hsl') {
		[h, s, l, a] = extractHslValues(color);
		[r, g, b] = hslToRgb([r, g, b]);
		hex = rgbToHex([r, g, b])
	} else if (type == 'hex') {
		hex = color;
		[r, g, b, a] = hexToRgb(hex);
		[h, s, l] = rgbToHsl([r, g, b])
	}
	return { r, g, b, h, s, l, a, hex }
}

export function hslToString(hsl) {
	const [h, s, l, a] = hsl
	if (a < 1) return `hsl(${h},${s}%,${l}%,${a})`;
	return `hsl(${h},${s}%,${l}%)`
}

export function rgbToString(rgb) {
	const [r, g, b, a] = rgb
	if (a < 1) return `rgba(${r},${g},${b},${a})`;
	return `rgb(${r},${g},${b})`
}