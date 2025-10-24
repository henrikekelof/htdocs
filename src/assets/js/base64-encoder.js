let exportsSelf = {};

exportsSelf.CLIPBOARD_CLASS = function (canvas_id, autoresize, callback) {
   let _self = this;
   let canvas = document.getElementById(canvas_id);
   let ctx = document.getElementById(canvas_id).getContext('2d');

   //handlers
   document.addEventListener(
      'paste',
      function (e) {
         _self.paste_auto(e);
      },
      false
   );

   /* events fired on the drop targets */
   document.addEventListener(
      'dragover',
      function (e) {
         // prevent default to allow drop
         e.preventDefault();
      },
      false
   );
   document.addEventListener('drop', function (e) {
      // prevent default action (open as link for some elements)
      // add event handler to canvas if desired instead of document
      //debugger;
      e.preventDefault();
      let items = e.dataTransfer.items;
      for (let i = 0; i < items.length; i++) {
         if (items[i].type.indexOf('image') !== -1) {
            //document.getElementById("instructions").style.visibility = "hidden";
            //image
            let blob = items[i].getAsFile();
            let URLObj = window.URL || window.webkitURL;
            let source = URLObj.createObjectURL(blob);
            _self.paste_createImage(source);
         }
      }
   });

   //on paste
   this.paste_auto = function (e) {
      if (e.clipboardData) {
         let items = e.clipboardData.items;
         if (!items) return;

         //access data directly
         for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
               //image
               let blob = items[i].getAsFile();
               let URLObj = window.URL || window.webkitURL;
               let source = URLObj.createObjectURL(blob);
               this.paste_createImage(source);
            }
         }
         e.preventDefault();
      }
   };
   //draw pasted image to canvas
   this.paste_createImage = function (source) {
      let pastedImage = new Image();
      pastedImage.onload = function () {
         if (autoresize == true) {
            //resize
            canvas.width = pastedImage.width;
            canvas.height = pastedImage.height;
         } else {
            //clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
         }
         ctx.drawImage(pastedImage, 0, 0);
         const imageAsString = getImgAsString(canvas_id);
         callback(imageAsString);
      };
      pastedImage.src = source;
   };
};

function isCanvasBlank(canvas) {
   let blank = document.createElement('canvas');
   blank.width = canvas.width;
   blank.height = canvas.height;
   return canvas.toDataURL() === blank.toDataURL();
}

function getImgAsString(canvasElementId, mimeType) {
   let canvasEl = document.getElementById(canvasElementId);
   if (isCanvasBlank(canvasEl)) {
      return null;
   } else {
      let imageData = canvasEl.toDataURL(mimeType);
      return imageData;
   }
}

(() => {
   const canvasElementId = 'b64-canvas';
   const pngBtnEl = document.getElementById('b64-canvas-png-btn');
   const jpegBtnEl = document.getElementById('b64-canvas-jpeg-btn');
   const webpBtnEl = document.getElementById('b64-canvas-webp-btn');
   const containerEl = document.getElementById('b64-canvas-container');

   new exportsSelf.CLIPBOARD_CLASS(canvasElementId, true, function () {
      pngBtnEl.disabled = false;
      jpegBtnEl.disabled = false;
      webpBtnEl.disabled = false;
      containerEl.classList.add('b64-canvas-container--hasImage');
   });

   async function setClipboard(text) {
      document.querySelector('.doc-alert').style.setProperty('display', 'none');
      try {
         const type = 'text/plain';
         const clipboardItemData = {
            [type]: text,
         };
         const clipboardItem = new ClipboardItem(clipboardItemData);
         await navigator.clipboard.write([clipboardItem]);
         document.getElementById('output').innerHTML = text;
         document
            .querySelector('.doc-alert--success')
            .style.setProperty('display', 'block');
      } catch (error) {
         document.getElementById('output').innerHTML = '';
         document
            .querySelector('.doc-alert--error')
            .style.setProperty('display', 'block');
         console.error(error);
      }
   }

   pngBtnEl.addEventListener('click', function () {
      const imgString = getImgAsString(canvasElementId, 'image/png');
      setClipboard(imgString);
   });
   jpegBtnEl.addEventListener('click', function () {
      const imgString = getImgAsString(canvasElementId, 'image/jpeg');
      setClipboard(imgString);
   });
   webpBtnEl.addEventListener('click', function () {
      const imgString = getImgAsString(canvasElementId, 'image/webp');
      setClipboard(imgString);
   });
})();
