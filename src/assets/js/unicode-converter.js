(function (doc) {
   'use strict';

   if (typeof String.prototype.startsWith !== 'function') {
      String.prototype.startsWith = function (str) {
         return this.slice(0, str.length) === str;
      };
   }

   if (typeof String.prototype.endsWith !== 'function') {
      String.prototype.endsWith = function (str) {
         return this.slice(-str.length) === str;
      };
   }

   var cssHex = doc.getElementById('css-hex'),
      jsHex = doc.getElementById('js-hex'),
      character = doc.getElementById('character'),
      entity = doc.getElementById('entity'),
      calculator = doc.getElementById('calculator'),
      commonChars = doc.getElementById('common-chars');

   function htmlDecode(input) {
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
   }

   function clearVals(isChar) {
      cssHex.value = '';
      jsHex.value = '';
      if (isChar) {
         entity.value = '';
      } else {
         character.value = '';
      }
   }

   function setCssHexVal(hexVal) {
      cssHex.value = '\\' + hexVal;
   }

   function setJsHexVal(hexVal) {
      jsHex.value = '\\u' + hexVal;
   }

   function setEntityVal(numVal) {
      entity.value = '&#' + numVal + ';';
   }

   function setCharVal(val) {
      character.value = val;
   }

   function setValsFromEntity(numVal) {
      var hexVal = getHexVal(numVal);
      setEntityVal(numVal);
      setCssHexVal(hexVal);
      setJsHexVal(hexVal);
      setCharVal(htmlDecode('&#' + numVal + ';'));
   }

   function setValsFromChar(charVal) {
      var numVal = charVal.charCodeAt().toString(10),
         hexVal = getHexVal(numVal);
      setEntityVal(numVal);
      setCssHexVal(hexVal);
      setJsHexVal(hexVal);
   }

   function setAllVals(html) {
      var charVal = htmlDecode(html);
      character.value = charVal;
      setValsFromChar(charVal);
   }

   function getHexVal(numVal) {
      var hexVal = parseInt(numVal, 10).toString(16).toUpperCase(),
         zeroPad = function (hexVal) {
            if (hexVal.length >= 4) {
               return hexVal.slice(0, 4);
            }
            return zeroPad('0' + hexVal);
         };
      return zeroPad(hexVal);
   }

   function handleEntityEvent(val, isBlur) {
      var numVal = parseInt(val, 10);
      if (val.startsWith('&#')) {
         numVal = parseInt(val.slice(2, val.length), 10);
      }
      clearVals(false);
      if (val.endsWith(';') || isBlur) {
         setValsFromEntity(numVal);
      }
   }

   function handleCharEvent() {
      var charVal = this.value;
      if (charVal.length === 1) {
         setValsFromChar(charVal);
      } else {
         clearVals(true);
      }
   }

   calculator.addEventListener('click', function (e) {
      if (e.target && e.target.nodeName === 'INPUT') {
         e.target.select();
      }
   });

   calculator.addEventListener('keydown', function (e) {
      var c = e.keyCode,
         ctrlDown = e.ctrlKey || e.metaKey;

      if (
         e.target &&
         e.target.nodeName === 'INPUT' &&
         e.target.className === 'calc-only' &&
         !(ctrlDown && c === 67)
      ) {
         e.preventDefault();
      }
   });

   commonChars.addEventListener('click', function (e) {
      if (e.target && e.target.nodeName === 'LI') {
         setAllVals(e.target.innerHTML);
      }
   });

   entity.addEventListener('keyup', function () {
      handleEntityEvent(this.value, false);
   });
   entity.addEventListener('blur', function () {
      handleEntityEvent(this.value, true);
   });

   character.addEventListener('keyup', handleCharEvent);

   if (!character.value) {
      setAllVals('&#38;');
   }
})(document);
