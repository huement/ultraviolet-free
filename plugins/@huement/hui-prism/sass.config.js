import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  // Input and output configuration
  loadPaths: [join(__dirname, "src"), join(__dirname, "node_modules")],

  // Source maps configuration
  sourceMap: true,
  sourceMapIncludeSources: true,

  // Output style configuration
  style: "expanded", // Can be 'expanded', 'compressed', 'compact', or 'nested'

  // Character set
  charset: true,

  // Precision for numbers
  precision: 10,

  // Quiet mode (suppress warnings)
  quietDeps: true,

  // Verbose output
  verbose: false,

  // Importers for custom import resolution
  importers: [
    {
      // Custom importer for resolving @use and @import statements
      findFileUrl(url, options) {
        // Handle relative imports
        if (url.startsWith("./") || url.startsWith("../")) {
          return new URL(url, options.from);
        }

        // Handle node_modules imports
        if (!url.startsWith("~")) {
          return null;
        }

        const modulePath = url.slice(1);
        const nodeModulesPath = join(__dirname, "node_modules", modulePath);

        try {
          return new URL(`file://${nodeModulesPath}`);
        } catch {
          return null;
        }
      },
    },
  ],

  // Functions for custom Sass functions
  functions: {
    // Example custom function
    "get-color($name)": (name) => {
      const colors = {
        primary: "#007bff",
        secondary: "#6c757d",
        success: "#28a745",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#17a2b8",
      };

      const colorValue = colors[name.getValue()];
      if (colorValue) {
        return new sass.SassColor(colorValue);
      }

      throw new Error(`Color "${name.getValue()}" not found`);
    },
  },

  // Global styles to be included in every compilation
  additionalData: `
    // Global variables and mixins
    $global-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    $global-border-radius: 0.375rem;
    $global-transition: all 0.15s ease-in-out;
  `,

  // File extensions to watch
  watchExtensions: [".scss", ".sass", ".css"],

  // Build targets configuration
  targets: {
    development: {
      style: "expanded",
      sourceMap: true,
      sourceMapIncludeSources: true,
      verbose: true,
    },
    production: {
      style: "compressed",
      sourceMap: false,
      quietDeps: true,
      verbose: false,
    },
  },
};
