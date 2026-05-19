(() => {
   const PASS_PHRASE_COUNT = 5;
   const PASS_PHRASE_LENGTH = 4;
   const MIN_WORD_LENGTH = 3;
   const NUMERIC_CHOICES = 10000;

   const maxWordLength = (words) =>
      words.reduce(
         (longestWord, word) =>
            word.length > longestWord.length ? word : longestWord,
         words[0]
      ).length;

   const getRandomInt = (max) => {
      if (!Number.isInteger(max) || max <= 0) {
         throw new RangeError('max must be a positive integer');
      }

      const randomValues = new Uint32Array(1);
      const maxUint32 = 0x100000000;
      const limit = Math.floor(maxUint32 / max) * max;

      let randomNumber = 0;

      do {
         crypto.getRandomValues(randomValues);
         randomNumber = randomValues[0];
      } while (randomNumber >= limit);

      return randomNumber % max;
   };

   const filterByLength = (words, maxLength) =>
      words.filter(
         (word) => word.length >= MIN_WORD_LENGTH && word.length <= maxLength
      );

   const copyPassPhrase = async (passphrase) => {
      try {
         await navigator.clipboard.writeText(passphrase);
      } catch {
         // Clipboard access can be denied or unavailable outside secure contexts.
      }
   };

   const createPassPhrase = (
      words,
      maxLength,
      passPhraseLength,
      includeNumeric
   ) => {
      const filteredWords = filterByLength(words, maxLength);

      if (filteredWords.length === 0) {
         return '';
      }

      const numericIndex = includeNumeric ? getRandomInt(passPhraseLength) : -1;
      const passPhrase = [];

      for (let i = 0; i < passPhraseLength; i += 1) {
         if (i === numericIndex) {
            passPhrase.push(String(getRandomInt(NUMERIC_CHOICES)));
            continue;
         }

         const word = filteredWords[getRandomInt(filteredWords.length)];
         passPhrase.push(
            getRandomInt(2) === 1 ? word.toLowerCase() : word.toUpperCase()
         );
      }

      return passPhrase.join('-');
   };

   const init = () => {
      const words = globalThis.words_arr;
      const generatedPassphrases = document.getElementById(
         'generated_passphrases'
      );
      const includeNumbers = document.getElementById('include_numbers');
      const maxWordLengthSelect = document.getElementById(
         'max_word_length_val'
      );
      const generateButton = document.getElementById('generate_passphrases');
      const entropyAlert = document.getElementById('entropy_alert');
      const passphraseStrength = document.getElementById('passphrase_strength');
      const calculatedEntropy = document.getElementById('calculated_entropy');

      if (
         !generatedPassphrases ||
         !includeNumbers ||
         !maxWordLengthSelect ||
         !generateButton ||
         !entropyAlert ||
         !passphraseStrength ||
         !calculatedEntropy
      ) {
         return;
      }

      if (!Array.isArray(words) || words.length === 0) {
         return;
      }

      const populateWordLengthOptions = () => {
         const highestWordLength = maxWordLength(words);
         const fragment = document.createDocumentFragment();
         const placeholderOption = document.createElement('option');

         placeholderOption.selected = true;
         placeholderOption.textContent = 'Max Word Length...';
         fragment.appendChild(placeholderOption);

         for (let i = highestWordLength; i >= MIN_WORD_LENGTH; i -= 1) {
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = String(i);
            fragment.appendChild(option);
         }

         maxWordLengthSelect.replaceChildren(fragment);
      };

      const getMaxWordLength = () => {
         const selectedValue = Number.parseInt(maxWordLengthSelect.value, 10);

         return Number.isNaN(selectedValue)
            ? maxWordLength(words)
            : selectedValue;
      };

      const renderPassPhrases = () => {
         const maxLength = getMaxWordLength();
         const fragment = document.createDocumentFragment();

         for (let i = 0; i < PASS_PHRASE_COUNT; i += 1) {
            const passPhrase = createPassPhrase(
               words,
               maxLength,
               PASS_PHRASE_LENGTH,
               includeNumbers.checked
            );
            const button = document.createElement('button');

            button.type = 'button';
            button.title = 'Press to Copy';
            button.className = 'list-group-item list-group-item-action';
            button.dataset.passphrase = passPhrase;
            button.textContent = passPhrase;
            fragment.appendChild(button);
         }

         generatedPassphrases.replaceChildren(fragment);
      };

      const calculateEntropy = (wordCount) => {
         if (includeNumbers.checked) {
            return (
               Math.log2(wordCount) * (PASS_PHRASE_LENGTH - 1) +
               Math.log2(NUMERIC_CHOICES) +
               Math.log2(PASS_PHRASE_LENGTH)
            );
         }

         return Math.log2(wordCount) * PASS_PHRASE_LENGTH;
      };

      const renderEntropy = () => {
         const filteredWords = filterByLength(words, getMaxWordLength());
         const entropy = calculateEntropy(filteredWords.length);

         /*
          Val	Utan siffror	Med siffror
          maxlängd 3	30 bits	38 bits
          maxlängd 4	38 bits	44 bits
          maxlängd 5	41 bits	46 bits
          maxlängd 6	43 bits	48 bits
          maxlängd 16/default	47 bits	50 bits

          Så med nuvarande gränser i pwd.js (line 175):
          Very Weak <= 28: kan inte uppstå.
          Weak <= 35: kan bara uppstå vid maxlängd 3 utan siffror.
          Reasonable <= 59: nästan allt hamnar här.
          Strong <= 127: kan inte uppstå.
          Very Strong > 127: kan inte uppstå.

         * */
         // if (entropy < 36) Weak;
         // else if (entropy < 45) Reasonable;
         // else Strong;

         if (entropy < 36) {
            entropyAlert.className = 'alert alert-danger';
            passphraseStrength.textContent = 'Weak';
         } else if (entropy < 45) {
            entropyAlert.className = 'alert alert-warning';
            passphraseStrength.textContent = 'Reasonable';
         } else {
            entropyAlert.className = 'alert alert-success';
            passphraseStrength.textContent = 'Strong';
         }

         calculatedEntropy.textContent = entropy.toFixed(0);
      };

      generatedPassphrases.addEventListener('click', (event) => {
         const button = event.target.closest('[data-passphrase]');

         if (!button) {
            return;
         }

         copyPassPhrase(button.dataset.passphrase);
      });

      generateButton.addEventListener('click', renderPassPhrases);
      maxWordLengthSelect.addEventListener('change', () => {
         renderEntropy();
         renderPassPhrases();
      });
      includeNumbers.addEventListener('change', () => {
         renderEntropy();
         renderPassPhrases();
      });

      populateWordLengthOptions();
      renderEntropy();
      renderPassPhrases();
   };

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
   } else {
      init();
   }
})();
