const fs = require('fs');
const path = require('path');

// Read the translation service file
const translationServicePath = path.join(__dirname, 'src/app/services/translation.service.ts');
const translationServiceContent = fs.readFileSync(translationServicePath, 'utf8');

// Extract translations object using regex
const translationsMatch = translationServiceContent.match(/private translations: Translations = \{([\s\S]*?)\};/);
if (!translationsMatch) {
  console.error('Could not find translations object in translation service');
  process.exit(1);
}

const translationsText = translationsMatch[1];

// Parse translations (simplified parser)
const translations = {};
const lines = translationsText.split('\n');
let currentKey = null;
let currentTranslations = {};

for (let line of lines) {
  line = line.trim();
  
  // Skip empty lines and comments
  if (!line || line.startsWith('//')) continue;
  
  // Check for key definition
  const keyMatch = line.match(/^'([^']+)':\s*\{/);
  if (keyMatch) {
    // Save previous key if exists
    if (currentKey && Object.keys(currentTranslations).length > 0) {
      translations[currentKey] = { ...currentTranslations };
    }
    
    currentKey = keyMatch[1];
    currentTranslations = {};
    continue;
  }
  
  // Check for translation values
  const translationMatch = line.match(/^\s*(nl|fr|en):\s*'([^']*(?:\\'[^']*)*)'/);
  if (translationMatch && currentKey) {
    const [, lang, value] = translationMatch;
    currentTranslations[lang] = value.replace(/\\'/g, "'");
  }
  
  // Check for end of object
  if (line === '}') {
    if (currentKey && Object.keys(currentTranslations).length > 0) {
      translations[currentKey] = { ...currentTranslations };
    }
    currentKey = null;
    currentTranslations = {};
  }
}

// Save the last key
if (currentKey && Object.keys(currentTranslations).length > 0) {
  translations[currentKey] = { ...currentTranslations };
}

console.log(`Found ${Object.keys(translations).length} translation keys`);

// Generate XLF files for each language
const languages = ['nl', 'fr', 'en'];

languages.forEach(lang => {
  const xlfContent = generateXLF(translations, lang);
  const outputPath = path.join(__dirname, 'src/locale', `messages.${lang}.xlf`);
  fs.writeFileSync(outputPath, xlfContent);
  console.log(`Generated ${outputPath}`);
});

function generateXLF(translations, language) {
  const xlfHeader = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:tc:xliff:document:1.2 http://docs.oasis-open.org/xliff/v1.2/os/xliff-core-1.2-strict.xsd">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>`;

  const xlfFooter = `    </body>
  </file>
</xliff>`;

  let xlfBody = '';
  
  Object.keys(translations).forEach(key => {
    const translation = translations[key][language] || translations[key]['en'] || key;
    xlfBody += `
      <trans-unit id="${key}" datatype="html">
        <source>${escapeXml(key)}</source>
        <target>${escapeXml(translation)}</target>
      </trans-unit>`;
  });

  return xlfHeader + xlfBody + xlfFooter;
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
