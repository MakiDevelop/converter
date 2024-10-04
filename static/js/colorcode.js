function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    s = s * 100;
    l = l * 100;
    return `hsl(${(h * 360).toFixed(0)}, ${(s).toFixed(1)}%, ${(l).toFixed(1)}%)`;
}

function hslToRgb(h, s, l) {
    let r, g, b;
    h /= 360;
    s /= 100;
    l /= 100;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 3) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

function updateResults() {
    const hex = document.getElementById('hex').value;
    const rgb = document.getElementById('rgb').value;
    const hsl = document.getElementById('hsl').value;
    const colorBox = document.getElementById('color-box');

    if (hex) {
        document.getElementById('result-hex').textContent = `HEX: ${hex}`;
        document.getElementById('result-rgb').textContent = `RGB: ${hexToRgb(hex)}`;
        document.getElementById('result-hsl').textContent = `HSL: ${rgbToHsl(...hexToRgb(hex).match(/\d+/g).map(Number))}`;
        colorBox.style.backgroundColor = hex;
    }

    if (rgb) {
        const [r, g, b] = rgb.match(/\d+/g).map(Number);
        document.getElementById('result-hex').textContent = `HEX: ${rgbToHex(r, g, b)}`;
        document.getElementById('result-rgb').textContent = `RGB: ${rgb}`;
        document.getElementById('result-hsl').textContent = `HSL: ${rgbToHsl(r, g, b)}`;
        colorBox.style.backgroundColor = rgb;
    }

    if (hsl) {
        const [h, s, l] = hsl.match(/\d+/g).map(Number);
        document.getElementById('result-hex').textContent = `HEX: ${rgbToHex(...hslToRgb(h, s, l).match(/\d+/g).map(Number))}`;
        document.getElementById('result-rgb').textContent = `RGB: ${hslToRgb(h, s, l)}`;
        document.getElementById('result-hsl').textContent = `HSL: ${hsl}`;
        colorBox.style.backgroundColor = hslToRgb(h, s, l);
    }
}

document.getElementById('hex').addEventListener('input', updateResults);
document.getElementById('rgb').addEventListener('input', updateResults);
document.getElementById('hsl').addEventListener('input', updateResults);
document.getElementById('color-picker').addEventListener('input', function () {
    const color = document.getElementById('color-picker').value;
    document.getElementById('hex').value = color;
    updateResults();
});