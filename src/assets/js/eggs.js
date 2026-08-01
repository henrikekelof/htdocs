(function (doc) {
   'use strict';

   var ORIGINAL_WILLIAMS_CONSTANT = 26.85,
      // Practical correction for real eggs: not perfectly spherical and not homogeneous.
      REAL_EGG_ADJUSTMENT_FACTOR = 1.38,
      PRACTICAL_EGG_CONSTANT =
         ORIGINAL_WILLIAMS_CONSTANT * REAL_EGG_ADJUSTMENT_FACTOR,
      BOILING_WATER_TEMPERATURE = 100,
      YOLK_WHITE_RATIO = 0.76,
      SECONDS_PER_DAY = 86400,
      // Boiling target temperatures for different egg consistencies (in Celsius)
      RUNNY_TARGET_TEMPERATURE = 65,
      VERY_SOFT_TARGET_TEMPERATURE = 67,
      SOFT_TARGET_TEMPERATURE = 69,
      CREAMY_TARGET_TEMPERATURE = 71,
      FIRM_TARGET_TEMPERATURE = 74,
      HARD_TARGET_TEMPERATURE = 77;

   var weightInput = doc.getElementById('egg-weight'),
      weightDecrease = doc.getElementById('egg-weight-decrease'),
      weightIncrease = doc.getElementById('egg-weight-increase'),
      temperatureInput = doc.getElementById('egg-temperature'),
      temperatureDecrease = doc.getElementById('egg-temperature-decrease'),
      temperatureIncrease = doc.getElementById('egg-temperature-increase'),
      temperaturePresets = doc.querySelectorAll(
         '[data-egg-temperature-preset]'
      ),
      results = [
         {
            element: doc.getElementById('egg-runny'),
            targetTemperature: RUNNY_TARGET_TEMPERATURE,
         },
         {
            element: doc.getElementById('egg-very-soft'),
            targetTemperature: VERY_SOFT_TARGET_TEMPERATURE,
         },
         {
            element: doc.getElementById('egg-soft'),
            targetTemperature: SOFT_TARGET_TEMPERATURE,
         },
         {
            element: doc.getElementById('egg-creamy'),
            targetTemperature: CREAMY_TARGET_TEMPERATURE,
         },
         {
            element: doc.getElementById('egg-firm'),
            targetTemperature: FIRM_TARGET_TEMPERATURE,
         },
         {
            element: doc.getElementById('egg-hard'),
            targetTemperature: HARD_TARGET_TEMPERATURE,
         },
      ];

   function adjustInput(input, direction) {
      var value = parseFloat(input.value),
         step = parseFloat(input.step) || 1,
         min = parseFloat(input.min),
         max = parseFloat(input.max),
         nextValue =
            (Number.isFinite(value) ? value : min || step) + step * direction;

      if (Number.isFinite(min)) {
         nextValue = Math.max(min, nextValue);
      }

      if (Number.isFinite(max)) {
         nextValue = Math.min(max, nextValue);
      }

      input.value = nextValue;
      updateResults();
   }

   function getStartTemperature() {
      return parseFloat(temperatureInput.value);
   }

   function updateTemperaturePresetState() {
      var startTemperature = getStartTemperature();

      temperaturePresets.forEach(function (button) {
         var isSelected =
            startTemperature ===
            parseFloat(button.dataset.eggTemperaturePreset);

         button.classList.toggle('active', isSelected);
         button.setAttribute('aria-pressed', String(isSelected));
      });
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

      results.forEach(function (result) {
         var seconds = calculateSeconds(
            weight,
            startTemperature,
            result.targetTemperature
         );

         result.element.textContent =
            Number.isFinite(seconds) && seconds > 0 ? formatTime(seconds) : '-';
      });

      updateTemperaturePresetState();
   }

   weightInput.addEventListener('input', updateResults);
   weightDecrease.addEventListener('click', function () {
      adjustInput(weightInput, -1);
   });
   weightIncrease.addEventListener('click', function () {
      adjustInput(weightInput, 1);
   });
   temperatureInput.addEventListener('input', updateResults);
   temperatureDecrease.addEventListener('click', function () {
      adjustInput(temperatureInput, -1);
   });
   temperatureIncrease.addEventListener('click', function () {
      adjustInput(temperatureInput, 1);
   });
   temperaturePresets.forEach(function (button) {
      button.addEventListener('click', function () {
         temperatureInput.value = button.dataset.eggTemperaturePreset;
         updateResults();
      });
   });

   updateResults();
})(document);
