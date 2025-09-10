# Angular i18n Migration Guide

This document describes the migration from the custom TranslationService to Angular's built-in i18n system.

## Current Status

✅ **Completed:**
- Generated XLF translation files for all languages (nl, fr, en)
- Created i18n pipe for backward compatibility
- Migrated HTML templates to use i18n pipe
- Updated component imports
- Configured Angular build system for i18n

## File Structure

```
src/
├── locale/
│   ├── messages.nl.xlf    # Dutch translations
│   ├── messages.fr.xlf    # French translations
│   └── messages.en.xlf    # English translations
├── app/
│   ├── pipes/
│   │   └── i18n.pipe.ts   # Backward compatibility pipe
│   └── services/
│       ├── translation.service.ts  # Legacy service (still in use)
│       └── i18n.service.ts         # New i18n service (for future use)
```

## How It Works

### Current Implementation (Transition Period)

1. **Templates**: Use `{{ 'key' | i18n }}` instead of `{{ translate('key') }}`
2. **Pipe**: The `I18nPipe` delegates to the existing `TranslationService`
3. **Service**: The `TranslationService` continues to work as before

### Future Implementation (Full i18n)

1. **Templates**: Use Angular's `$localize` function or i18n attributes
2. **Build**: Use Angular's i18n build configurations
3. **Deployment**: Deploy separate builds for each language

## Build Commands

### Development
```bash
ng serve
```

### Production Builds
```bash
# English (default)
ng build --configuration=production

# Dutch
ng build --configuration=nl

# French  
ng build --configuration=fr

# English (explicit)
ng build --configuration=en
```

### Serve with i18n
```bash
# Serve Dutch version
ng serve --configuration=nl

# Serve French version
ng serve --configuration=fr
```

## Migration Steps

### Phase 1: Current (Completed)
- [x] Generate XLF files from existing translations
- [x] Create i18n pipe for backward compatibility
- [x] Migrate templates to use i18n pipe
- [x] Update component imports

### Phase 2: Full i18n Migration (Future)
- [ ] Replace i18n pipe with Angular's `$localize`
- [ ] Use i18n attributes in templates
- [ ] Remove custom TranslationService
- [ ] Update build and deployment process

## Template Examples

### Before (Custom Service)
```html
{{ translate('signIn') }}
```

### Current (i18n Pipe)
```html
{{ 'signIn' | i18n }}
```

### Future (Angular i18n)
```html
<!-- Option 1: $localize -->
{{ $localize`:@@signIn:Sign In` }}

<!-- Option 2: i18n attribute -->
<button i18n="@@signIn">Sign In</button>
```

## Benefits of Full i18n Migration

1. **Performance**: No runtime translation overhead
2. **SEO**: Separate URLs for each language
3. **Caching**: Language-specific bundles
4. **Standards**: Uses Angular's built-in i18n system
5. **Tooling**: Better IDE support and tooling

## Notes

- The current implementation maintains full backward compatibility
- All existing translations are preserved
- The migration can be done gradually
- No breaking changes to existing functionality
