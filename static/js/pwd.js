(() => {
   const PASS_PHRASE_COUNT = 5;
   const PASS_PHRASE_LENGTH = 4;
   const MIN_WORD_LENGTH = 3;

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
      words.filter((word) => word.length <= maxLength);

   const fallbackCopyText = (text) => {
      const tmpInput = document.createElement('input');

      tmpInput.value = text;
      document.body.appendChild(tmpInput);
      tmpInput.select();
      document.execCommand('copy');
      document.body.removeChild(tmpInput);
   };

   const copyPassPhrase = async (passphrase) => {
      try {
         await navigator.clipboard.writeText(passphrase);
      } catch {
         fallbackCopyText(passphrase);
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
            passPhrase.push(String(getRandomInt(10000)));
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
      const entropyMessage = document.getElementById('entropy_message');
      const calculatedEntropy = document.getElementById('calculated_entropy');

      if (
         !generatedPassphrases ||
         !includeNumbers ||
         !maxWordLengthSelect ||
         !generateButton ||
         !entropyAlert ||
         !passphraseStrength ||
         !entropyMessage ||
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

      const renderEntropy = () => {
         const filteredWords = filterByLength(words, getMaxWordLength());
         const entropy = Math.log2(filteredWords.length) * PASS_PHRASE_LENGTH;

         if (entropy <= 28) {
            entropyAlert.className = 'alert alert-danger';
            passphraseStrength.textContent = 'Very Weak';
            entropyMessage.textContent =
               "These passphrases aren't strong enough to protect a teenager's diary.";
         } else if (entropy <= 35) {
            entropyAlert.className = 'alert alert-warning';
            passphraseStrength.textContent = 'Weak';
            entropyMessage.textContent =
               'These passphrases should keep out most people and should be barely adequate for protecting a personal computer login.';
         } else if (entropy <= 59) {
            entropyAlert.className = 'alert alert-success';
            passphraseStrength.textContent = 'Reasonable';
            entropyMessage.textContent =
               'These passphrases should be strong enough to protect network and corporate accounts.';
         } else if (entropy <= 127) {
            entropyAlert.className = 'alert alert-success';
            passphraseStrength.textContent = 'Strong';
            entropyMessage.textContent =
               'These passphrases should be good for protecting financial information.';
         } else {
            entropyAlert.className = 'alert alert-success';
            passphraseStrength.textContent = 'Very Strong';
            entropyMessage.textContent = '';
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
      includeNumbers.addEventListener('change', renderPassPhrases);

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
