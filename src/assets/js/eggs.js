(function (doc) {
   'use strict';

   var ORIGINAL_WILLIAMS_CONSTANT = 26.85,
      // Practical correction for real eggs: not perfectly spherical and not homogeneous.
      REAL_EGG_ADJUSTMENT_FACTOR = 1.38,
      PRACTICAL_EGG_CONSTANT =
         ORIGINAL_WILLIAMS_CONSTANT * REAL_EGG_ADJUSTMENT_FACTOR,
      BOILING_WATER_TEMPERATURE = 100,
      YOLK_WHITE_RATIO = 0.76,
      SECONDS_PER_DAY = 86400;

   var weightInput = doc.getElementById('egg-weight'),
      temperatureSelect = doc.getElementById('egg-temperature'),
      results = {
         soft: {
            element: doc.getElementById('egg-soft'),
            targetTemperature: 65,
         },
         medium: {
            element: doc.getElementById('egg-medium'),
            targetTemperature: 70,
         },
         hard: {
            element: doc.getElementById('egg-hard'),
            targetTemperature: 77,
         },
      };

   function getStartTemperature() {
      return parseFloat(temperatureSelect.value);
   }

   function calculateSeconds(weight, startTemperature, targetTemperature) {
      var days =
         (PRACTICAL_EGG_CONSTANT *
            Math.pow(weight, 2 / 3) *
            Math.log(
               (YOLK_WHITE_RATIO *
                  (BOILING_WATER_TEMPERATURE - startTemperature)) /
                  (BOILING_WATER_TEMPERATURE - targetTemperature)
            )) /
         SECONDS_PER_DAY;

      return days * SECONDS_PER_DAY;
   }

   function formatTime(totalSeconds) {
      var roundedSeconds = Math.round(totalSeconds),
         minutes = Math.floor(roundedSeconds / 60),
         seconds = roundedSeconds % 60;

      return minutes + ':' + String(seconds).padStart(2, '0');
   }

   function updateResults() {
      var weight = parseFloat(weightInput.value),
         startTemperature = getStartTemperature();

      Object.keys(results).forEach(function (key) {
         var result = results[key],
            seconds = calculateSeconds(
               weight,
               startTemperature,
               result.targetTemperature
            );

         result.element.textContent =
            Number.isFinite(seconds) && seconds > 0 ? formatTime(seconds) : '-';
      });
   }

   weightInput.addEventListener('input', updateResults);
   temperatureSelect.addEventListener('change', updateResults);

   updateResults();
})(document);
