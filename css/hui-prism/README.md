# Hui Prism Theme

<div align="center">
  <img src="docs/preview.png" alt="Hui Prism Theme Preview" width="800" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
</div>

A modern, feature-rich Prism.js theme built with Sass, featuring multiple color schemes, advanced customization options, and comprehensive build tools.

## ✨ Features

- 🎨 **Multiple Color Schemes**: Default, Dark, Light, Monokai, Solarized variants
- 🛠️ **Modern Sass**: Built with Dart Sass and modern Sass features
- 📱 **Responsive Design**: Optimized for all screen sizes
- ♿ **Accessibility**: WCAG compliant with high contrast support
- 🎭 **Animations**: Smooth transitions and hover effects
- 📦 **Modular Architecture**: Easy to customize and extend
- 🚀 **Build Tools**: Development and production builds with source maps
- 📊 **Source Maps**: Full debugging support in development

## 🚀 Quick Start

### Live Demo

🎨 **[View Live Documentation & Examples](https://huement.github.io/hui-prism/)** - Interactive showcase with all language examples

### Installation

```bash
npm install @huement/hui-prism
```

### Basic Usage

```html
<!-- Include Prism.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>

<!-- Include the theme -->
<link rel="stylesheet" href="node_modules/@huement/hui-prism/dist/theme.css">
```

### CDN Usage

```html
<link rel="stylesheet" href="https://unpkg.com/@huement/hui-prism@latest/dist/theme.css">
```

## 🎨 Color Schemes

### Default Theme
```html
<link rel="stylesheet" href="dist/theme.css">
```

### Dark Theme
```html
<link rel="stylesheet" href="dist/theme-dark.css">
```

### Light Theme
```html
<link rel="stylesheet" href="dist/theme-light.css">
```

### Monokai Theme
```html
<link rel="stylesheet" href="dist/theme-monokai.css">
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/huement/hui-prism.git
cd hui-prism

# Install dependencies
npm install
```

### Build Commands

```bash
# Development build with source maps
npm run build:dev

# Production build (minified)
npm run build:prod

# Build all variants
npm run build:all

# Watch mode for development
npm run watch

# Clean build directory
npm run clean
```

### Build Output

```
dist/
├── theme.css          # Development build with source maps
├── theme.min.css      # Production build (minified)
├── theme-dark.css     # Dark theme variant
├── theme-light.css    # Light theme variant
├── theme-monokai.css  # Monokai theme variant
└── theme.css.map      # Source map for debugging
```

## 🎯 Customization

### Using Sass

```scss
// Import the theme
@use '@huement/hui-prism' as theme;

// Use with default settings
@include theme.hui-prism-theme();

// Customize with options
@include theme.hui-prism-theme((
  'color-scheme': 'dark',
  'font-size': 1.1rem,
  'line-height': 1.6,
  'padding': 1.5em,
  'border-radius': 0.5em,
  'enable-animations': true,
  'enable-transitions': true
));
```

### Custom Color Scheme

```scss
@use '@huement/hui-prism' as theme;

@include theme.hui-prism-theme-with-colors((
  'base00': #1a1a1a,  // Background
  'base05': #ffffff,  // Text
  'base08': #ff6b6b,  // Keywords
  'base0b': #51cf66,  // Strings
  'base0d': #339af0   // Functions
));
```

### Theme Variants

```scss
@use '@huement/hui-prism/src/themes/variants' as variants;

// Use pre-configured variants
@include variants.dark-theme();
@include variants.light-theme();
@include variants.monokai-theme();
@include variants.high-contrast-theme();
```

## 📚 API Reference

### Main Mixin

```scss
@mixin hui-prism-theme($config: ())
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color-scheme` | String | `'default'` | Color scheme name |
| `font-family` | List | `('Consolas', 'Monaco', ...)` | Font family stack |
| `font-size` | Number | `1rem` | Base font size |
| `line-height` | Number | `1.5` | Line height |
| `tab-size` | Number | `4` | Tab size |
| `padding` | String | `1.2em` | Code block padding |
| `margin` | String | `0.75em 0` | Code block margin |
| `inline-padding` | String | `0.1em` | Inline code padding |
| `border-radius` | Number | `0.3em` | Border radius |
| `enable-animations` | Boolean | `true` | Enable animations |
| `enable-transitions` | Boolean | `true` | Enable transitions |
| `custom-colors` | Map | `()` | Custom color overrides |
| `custom-tokens` | Map | `()` | Custom token colors |

### Utility Mixins

```scss
// Theme with specific color scheme
@mixin hui-prism-theme-with-scheme($scheme, $config: ())

// Theme with custom colors
@mixin hui-prism-theme-with-colors($colors, $config: ())
```

### Color Schemes

Available color schemes:
- `default` - Standard base16 colors
- `dark` - Dark theme optimized
- `light` - Light theme optimized  
- `monokai` - Monokai-inspired
- `solarized-dark` - Solarized dark
- `solarized-light` - Solarized light

## 🎨 Color Customization

### Base16 Color System

The theme uses the base16 color system with the following color roles:

| Color | Role | Description |
|-------|------|-------------|
| `base00` | Background | Default background color |
| `base01` | Background | Lighter background |
| `base02` | Background | Selection background |
| `base03` | Foreground | Comments, line highlighting |
| `base04` | Foreground | Dark foreground |
| `base05` | Foreground | Default foreground |
| `base06` | Foreground | Light foreground |
| `base07` | Foreground | Lightest foreground |
| `base08` | Accent | Variables, XML tags |
| `base09` | Accent | Integers, constants |
| `base0a` | Accent | Classes, markup bold |
| `base0b` | Accent | Strings, markup code |
| `base0c` | Accent | Support, regex |
| `base0d` | Accent | Functions, methods |
| `base0e` | Accent | Keywords, storage |
| `base0f` | Accent | Deprecated, embedded tags |

### Token Colors

Syntax highlighting tokens are mapped to base16 colors:

- **Comments**: `base02`
- **Keywords**: `base0f`
- **Strings**: `base0d`
- **Numbers**: `base09`
- **Functions**: `base0e`
- **Classes**: `base0a`
- **Operators**: `base0c`

## 🔧 Advanced Features

### Source Maps

Development builds include source maps for easy debugging:

```bash
npm run build:dev
```

### Watch Mode

Automatic rebuilding during development:

```bash
npm run watch
```

### Multiple Builds

Build all theme variants:

```bash
npm run build:all
```

### Custom Functions

The theme includes utility functions for:

- Color manipulation
- Math calculations
- String utilities
- Responsive design
- Accessibility helpers

## 📱 Responsive Design

The theme includes responsive adjustments:

- **Mobile** (< 768px): Smaller fonts, reduced padding
- **Tablet** (768px - 1024px): Medium sizing
- **Desktop** (> 1024px): Full sizing with optimizations

## ♿ Accessibility

### Features

- WCAG AA compliant contrast ratios
- Focus visible indicators
- Reduced motion support
- High contrast mode
- Screen reader friendly

### Usage

```scss
// Enable high contrast mode
@include variants.high-contrast-theme();

// Or customize for accessibility
@include theme.hui-prism-theme((
  'enable-animations': false,
  'custom-colors': (
    'base00': #000000,
    'base07': #ffffff
  )
));
```

## 🎭 Animations

### Available Animations

- Fade in effects
- Slide transitions
- Pulse animations
- Hover effects
- Focus indicators

### Disable Animations

```scss
@include theme.hui-prism-theme((
  'enable-animations': false,
  'enable-transitions': false
));
```

## 📦 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run watch

# Run tests
npm test

# Build for production
npm run build:prod
```

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Prism.js](https://prismjs.com/) for syntax highlighting
- [Base16](https://github.com/chriskempson/base16) for color schemes
- [Sass](https://sass-lang.com/) for CSS preprocessing

## 📞 Support

- 📖 [Documentation](https://github.com/huement/hui-prism#readme)
- 🐛 [Issues](https://github.com/huement/hui-prism/issues)
- 💬 [Discussions](https://github.com/huement/hui-prism/discussions)

---

Made with ❤️ by [Derek Scott](https://github.com/huement)
