const fs = require('fs');
const path = require('path');

// Find all TypeScript component files
function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findTsFiles(fullPath));
    } else if (item.endsWith('.component.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

const componentFiles = findTsFiles('src/app');

console.log(`Found ${componentFiles.length} component files to update`);

componentFiles.forEach(filePath => {
  console.log(`Updating ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file uses translate() method
  if (content.includes('translate(') || content.includes('TranslationService')) {
    // Add I18nPipe import if not already present
    if (!content.includes('I18nPipe')) {
      // Find the imports section and add I18nPipe import
      const importMatch = content.match(/(import.*from.*translation\.service.*;)/);
      if (importMatch) {
        const newImport = importMatch[1] + '\nimport { I18nPipe } from \'../pipes/i18n.pipe\';';
        content = content.replace(importMatch[1], newImport);
        modified = true;
      }
    }
    
    // Add I18nPipe to imports array if not already present
    if (!content.includes('I18nPipe') && content.includes('imports: [')) {
      const importsMatch = content.match(/(imports:\s*\[[^\]]*)(\])/);
      if (importsMatch) {
        const importsContent = importsMatch[1];
        const closingBracket = importsMatch[2];
        
        // Add I18nPipe to the imports array
        const newImports = importsContent + 'I18nPipe' + closingBracket;
        content = content.replace(importsMatch[0], newImports);
        modified = true;
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Updated ${filePath}`);
  } else {
    console.log(`  - No changes needed for ${filePath}`);
  }
});

console.log('Component update completed!');
