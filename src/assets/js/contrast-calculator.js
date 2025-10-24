// Calculate Color Contrast

import { hslToHex } from './contrast-calculator-utils.js';
import Color from 'colorjs.io';

((doc, docEl) => {
   const canvas = doc.createElement('canvas');
   const ctx = canvas.getContext('2d');
   const inputContainer = doc.querySelector('.inputs');
   const favIconEl = doc.querySelector('link[rel="icon"]');

   const updateFavicon = (bg, text) => {
      ctx.clearRect(0, 0, 16, 16);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 8, 16);
      ctx.fillStyle = text;
      ctx.fillRect(8, 0, 8, 16);
      favIconEl.setAttribute('href', canvas.toDataURL());
   };

   const validate = (badge, contrastValue) => {
      const level = parseFloat(badge.getAttribute('data-pass'));
      if (contrastValue >= level) {
         badge.classList.remove('fail');
      } else {
         badge.classList.add('fail');
      }
   };

   const checkContrast = () => {
      const values = {};
      const hash = [];

      ['bg', 'text', 'link', 'ui'].forEach((colorName) => {
         const val = inputContainer.querySelector(
            `[type="text"][data-color="${colorName}"]`
         ).value;
         values[colorName] = val;
         hash.push(encodeURIComponent(val));
      });

      location.hash = `#${hash.join('|')}`;

      updateFavicon(values.bg, values.text);

      // Calculate contrast and validate

      ['text-bg', 'link-bg', 'link-text', 'ui-bg'].forEach((badgeName) => {
         const colorNames = badgeName.split('-');
         const color1 = new Color(values[colorNames[0]]);
         const color2 = new Color(values[colorNames[1]]);
         const contrastValue = color1.contrast(color2, 'WCAG21');
         doc.querySelector(`[data-ratio="${badgeName}"] b`).textContent =
            Math.floor(contrastValue * 100) / 100;
         doc.querySelectorAll(`[data-validate="${badgeName}"]`).forEach(
            (badge) => {
               validate(badge, color1.contrast(color2, 'WCAG21'));
            }
         );
      });

      doc.querySelectorAll('.result').forEach((resultEl) => {
         if (resultEl.querySelector('.passFail.fail')) {
            resultEl.classList.add('fail');
         } else {
            resultEl.classList.remove('fail');
         }
      });
   };

   const handleColorPicker = (e) => {
      const val = e.target.value;
      const el = e.target;
      const what = el.dataset.color;

      let color;
      try {
         color = new Color(val).to('hsl');
      } catch (e) {}

      if (color) {
         docEl.style.setProperty(`--sample-${what}`, color.toString());
         doc.querySelector(
            `.inputs [type="text"][data-color="${what}"]`
         ).value = hslToHex(color.hsl);
         checkContrast();
      }
   };
   const handleTextColorInput = (e) => {
      let val = e.target.value;
      const el = e.target;
      const what = el.dataset.color;

      // Add hash to front of 3, 4, 6, and 8 digit hex codes.
      const accepted_matches = [3, 4, 6, 8];
      const match_result = val.match(/^[0-9a-f]{3,8}$/i);
      if (match_result && accepted_matches.includes(match_result[0].length)) {
         val = `#${val}`;
      }
      let color;
      try {
         color = new Color(val);
         if (color.alpha < 1) {
            color.alpha = 1;
            color = color.to('hsl');
            e.target.value = hslToHex(color.hsl);
         } else {
            color = color.to('hsl');
         }
      } catch (e) {}

      if (color) {
         docEl.style.setProperty(`--sample-${what}`, color.toString());
         doc.querySelector(
            `.inputs [type="color"][data-color="${what}"]`
         ).value = hslToHex(color.hsl);
         checkContrast();
      }
   };

   const init = () => {
      canvas.width = canvas.height = 16;
      document.body.appendChild(canvas);
      favIconEl.setAttribute('href', canvas.toDataURL());

      doc.querySelectorAll('.inputs [type="text"]').forEach((el) => {
         el.addEventListener('input', handleTextColorInput);
      });

      doc.querySelectorAll('.inputs [type="color"]').forEach((el) => {
         el.addEventListener('input', handleColorPicker);
      });

      const initialValues = `${location.hash}`.replace('#', '').split('|');

      if (location.hash && initialValues.length === 4) {
         ['bg', 'text', 'link', 'ui'].forEach((colorName, i) => {
            inputContainer.querySelector(
               `[type="text"][data-color="${colorName}"]`
            ).value = decodeURIComponent(initialValues[i]);
            inputContainer.querySelector(
               `[type="color"][data-color="${colorName}"]`
            ).value = decodeURIComponent(initialValues[i]);
         });
      }
      checkContrast();
   };

   init();
})(document, document.documentElement);
