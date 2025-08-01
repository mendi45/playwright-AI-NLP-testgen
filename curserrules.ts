/**
 * General coding rules for Curser when generating Playwright tests
 */

// ✅ Always use Playwright official documentation as the main reference.
// Docs: https://playwright.dev/docs
 
export const curserRules = {
  // Test Design
  testStructure: {
    usePOM: true, // Use Page Object Model for all tests.
    basePageUsage: true, // Use BasePage class for shared logic.
    useHelperFunctions: true, // Break down complex logic into helper functions.
    keepTestFileClean: true, // Do not write locators or logic in test file. Use POM only.
    useDescribeBlocks: true,
    preferDescriptiveTestNames: true,
  },

  // Locator Strategy
  locatorStrategy: {
    preferStableLocators: true, // Prefer 'getByTestId', 'getByRole', or data-testid.
    avoidCssSelectors: true, // Do not use unstable selectors like .class or :nth-child.
    useLocatorFilter: true, // Use .filter() or .nth() when needed to stabilize.
    genericComponents: ['tableComponent', 'formComponent', 'modalComponent', 'navbarComponent'], // Use reusable components when possible
    targetAttributes: ['data-testid', 'placeholder', 'aria-label', 'name', 'id']
  },

  generation: {
  numberOfTestsPerPage: 2,
  maxDomElementsToMap: 20
},

  fileStructure: {
  pageObjectsDir: "pages",
  testsDir: "tests",
  useKebabCaseForFiles: true,
},

  // Code Style
  codeStyle: {
    useCamelCase: true, // Use camelCase for all variable and function names.
    avoidLongFunctions: true, // Split large functions into smaller ones.
    avoidComplexLogic: true, // Keep code easy to understand.
    writeLikeSenior: true, // Write code like a Playwright automation engineer with 5 years of experience.
    useSimpleEnglish: true, // Use simple and clear language in code and comments.
  },

  fileNaming: {
  pageObjectSuffix: 'Page',
  testFileSuffix: '.spec.ts',
  outputFolderPO: 'pom',
  outputFolderTests: 'tests',
},

  // Secrets & Environment
  secretsAndEnv: {
    useSecretsFile: true, // Use a separate file for secrets and config.
    secretsFileExample: {
      url: 'https://example.com',
      users: {
        admin: {
          email: 'admin@example.com',
          password: 'securePassword123',
        },
        user: {
          email: 'user@example.com',
          password: 'userPassword456',
        },
      },
    },
  },

  // Output Formatting
  formatting: {
    useSimpleComments: true, // Comments should be simple and helpful.
    noAdvancedVocabulary: true, // Avoid complicated English words.
  },
};
