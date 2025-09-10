const fs = require('fs');
const path = require('path');

// Find all HTML template files recursively
function findHtmlFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

const templateFiles = findHtmlFiles('src/app');

console.log(`Found ${templateFiles.length} template files to migrate`);

templateFiles.forEach(filePath => {
  console.log(`Migrating ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Replace translate() calls in templates
  // Pattern: {{ translate('key') }}
  const translatePattern = /\{\{\s*translate\('([^']+)'\)\s*\}\}/g;
  const translateMatches = content.match(translatePattern);
  
  if (translateMatches) {
    translateMatches.forEach(match => {
      const keyMatch = match.match(/translate\('([^']+)'\)/);
      if (keyMatch) {
        const key = keyMatch[1];
        const replacement = `{{ '${key}' | i18n }}`;
        content = content.replace(match, replacement);
        modified = true;
      }
    });
  }
  
  // Replace translate() calls in attributes
  // Pattern: translate('key')
  const attrTranslatePattern = /translate\('([^']+)'\)/g;
  const attrMatches = content.match(attrTranslatePattern);
  
  if (attrMatches) {
    attrMatches.forEach(match => {
      const keyMatch = match.match(/translate\('([^']+)'\)/);
      if (keyMatch) {
        const key = keyMatch[1];
        const replacement = `'${key}' | i18n`;
        content = content.replace(match, replacement);
        modified = true;
      }
    });
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Updated ${filePath}`);
  } else {
    console.log(`  - No changes needed for ${filePath}`);
  }
});

console.log('Template migration completed!');
