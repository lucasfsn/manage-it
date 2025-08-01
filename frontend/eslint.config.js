// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const noRelativeImportPaths = require("eslint-plugin-no-relative-import-paths");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },

    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths,
    },
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { allowSameFolder: false, rootDir: "src", prefix: "@" },
      ],
      "arrow-parens": ["error", "always"],
      complexity: ["error", 8],
      // indent: ["error", 2],
      // "no-console": "error",
      "no-else-return": "error",
      "no-nested-ternary": "error",
      // "no-param-reassign": "error",
      "max-depth": ["error", 2],
      "max-nested-callbacks": ["error", 3],
      "newline-before-return": "error",
      "prefer-const": "error",
      semi: ["error", "always"],
      "@angular-eslint/component-class-suffix": [
        "error",
        {
          suffixes: ["Component", "Page"],
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/contextual-decorator": "error",
      "@angular-eslint/contextual-lifecycle": "error",
      "@angular-eslint/directive-class-suffix": [
        "error",
        {
          suffixes: ["Directive"],
        },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/no-attribute-decorator": "off",
      "@angular-eslint/no-conflicting-lifecycle": "error",
      "@angular-eslint/no-empty-lifecycle-method": "error",
      "@angular-eslint/no-input-prefix": "error",
      "@angular-eslint/no-input-rename": "warn",
      "@angular-eslint/no-inputs-metadata-property": "error",
      "@angular-eslint/no-lifecycle-call": "error",
      "@angular-eslint/no-output-native": "error",
      "@angular-eslint/no-output-on-prefix": "error",
      "@angular-eslint/no-outputs-metadata-property": "error",
      "@angular-eslint/no-queries-metadata-property": "error",
      "@angular-eslint/relative-url-prefix": "error",
      "@angular-eslint/use-lifecycle-interface": "warn",
      "@angular-eslint/use-pipe-transform-interface": "error",
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "array",
        },
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/ban-tslint-comment": "error",
      "@typescript-eslint/class-literal-property-style": ["error", "fields"],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/explicit-module-boundary-types": [
        "error",
        {
          allowArgumentsExplicitlyTypedAsAny: true,
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["strictCamelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        {
          selector: [
            "function",
            "classProperty",
            "typeProperty",
            "parameterProperty",
            "classMethod",
            "objectLiteralMethod",
            "typeMethod",
            "accessor",
          ],
          format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
        {
          selector: [
            "class",
            "enum",
            "interface",
            "typeAlias",
            "typeParameter",
          ],
          format: ["StrictPascalCase"],
        },
      ],
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/no-useless-empty-export": "warn",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-includes": "error",
      "@typescript-eslint/prefer-literal-enum-member": "error",
      "@typescript-eslint/prefer-return-this-type": "error",
      "@typescript-eslint/prefer-string-starts-ends-with": "error",
      "@typescript-eslint/promise-function-async": [
        "error",
        {
          checkArrowFunctions: false,
        },
      ],
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/typedef": [
        "error",
        {
          // "arrowParameter": true,
          // "variableDeclaration": true,
          // "memberVariableDeclaration": true,
          arrayDestructuring: false,
          parameter: true,
          propertyDeclaration: true,
          variableDeclarationIgnoreFunction: true,
          // "objectDestructuring": true
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
