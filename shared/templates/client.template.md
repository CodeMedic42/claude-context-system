# Client Context: {Client Name}

## Client Overview
{Provide a clear description of what this client does, its primary purpose, and who uses it}

## Client Type
{Specify the type of client}
- **Type**: {e.g., Web SPA, Mobile App, Desktop App, CLI Tool}
- **Platform**: {e.g., Web (React), iOS/Android, Electron, Node.js CLI}
- **Target Users**: {Who uses this client - end users, developers, administrators}

## Technologies
{List the key technologies, frameworks, and libraries used in this client}
- **Language**: {e.g., TypeScript, Swift, Kotlin, Python}
- **Framework**: {e.g., React, Vue, Angular, SwiftUI, Flutter, Electron}
- **Key Dependencies**: {List major libraries and their purposes}

## User Interface Patterns

### UI Framework and Components
{Describe the UI framework and component architecture}
- **Component library**: {e.g., "Material-UI", "Ant Design", "Custom components", "Native SwiftUI"}
- **Component organization**: {How components are structured and organized}
- **Styling approach**: {e.g., "CSS Modules", "Styled Components", "Tailwind", "Native styling"}

### Navigation and Routing
{Describe how navigation works in the client}
- **Routing library**: {e.g., "React Router", "Navigation Stack", "CLI commands"}
- **Navigation pattern**: {How users move between screens/views/commands}
- **Deep linking**: {If applicable, how deep links or direct navigation works}

## State Management
{Describe how application state is managed}
- **State management approach**: {e.g., "Redux", "Context API", "MobX", "Vuex", "Local state only"}
- **State organization**: {How state is structured and where it lives}
- **State persistence**: {How/where state is persisted - localStorage, AsyncStorage, files, etc.}

## Data Flow

### API Integration
{Describe how the client communicates with backend services}
- **API client library**: {e.g., "Axios", "Fetch", "Apollo Client", "URLSession"}
- **API base URLs**: {Environment-specific URLs or configuration}
- **Request/Response handling**: {Patterns for making requests and handling responses}
- **Error handling**: {How API errors are handled and displayed to users}

### Data Caching
{If applicable, describe caching strategy}
- **Caching approach**: {e.g., "React Query", "Apollo Cache", "Manual localStorage"}
- **Cache invalidation**: {When and how cached data is refreshed}

## Authentication and Authorization

### Authentication Flow
{Describe how users authenticate}
- **Authentication method**: {e.g., "OAuth", "JWT", "Session cookies", "API keys"}
- **Login process**: {Steps users take to authenticate}
- **Token storage**: {Where auth tokens are stored - localStorage, secure storage, keychain}
- **Session handling**: {How sessions are maintained and refreshed}

### Protected Routes/Screens
{Describe how access control works}
- **Authorization approach**: {How protected areas are secured}
- **Permission checking**: {Where and how permissions are checked}
- **Unauthorized handling**: {What happens when users lack permissions}

## User Input and Validation

### Form Handling
{Describe how user input is managed}
- **Form library**: {e.g., "React Hook Form", "Formik", "Native forms"}
- **Validation approach**: {e.g., "Yup schemas", "Zod", "Built-in validation"}
- **Validation timing**: {When validation occurs - on blur, on submit, real-time}

### Input Patterns
{Common input patterns users should follow}
- **Required fields**: {How required fields are indicated and validated}
- **Error display**: {How validation errors are shown to users}
- **User feedback**: {Loading states, success messages, error notifications}

## Build and Development

### Development Setup
{Steps to set up the client for development}
- **Install dependencies**: {Command to install dependencies}
- **Environment configuration**: {Required environment variables or config files}
- **Development server**: {Command to start dev server/environment}

### Build Process
{How to build the client for production}
- **Build command**: {Command to create production build}
- **Build output**: {Where build artifacts are created}
- **Build optimization**: {Any build-time optimizations - code splitting, minification, etc.}

### Environment Configuration
{How different environments are managed}
- **Environment files**: {e.g., ".env.development", ".env.production"}
- **Environment variables**: {Key environment variables and their purposes}
- **Configuration approach**: {How config is injected at build time or runtime}

## Testing Patterns

### Testing Approach
{Describe the testing strategy}
- **Testing frameworks**: {e.g., "Jest", "React Testing Library", "XCTest", "Espresso"}
- **Test types**: {Unit tests, integration tests, E2E tests}
- **Test organization**: {Where tests live and how they're organized}

### Testing Commands
{Commands to run tests}
- **Run all tests**: {Command}
- **Run specific tests**: {Command pattern}
- **Coverage reports**: {How to generate coverage}

### E2E Testing
{If applicable, describe end-to-end testing}
- **E2E framework**: {e.g., "Cypress", "Playwright", "Detox"}
- **Test scenarios**: {What scenarios are covered by E2E tests}
- **Running E2E tests**: {Commands and requirements}

## Error Handling and Logging

### Error Boundaries
{Describe how errors are caught and handled}
- **Error catching**: {e.g., "React Error Boundaries", "try-catch", "global handlers"}
- **Error display**: {How errors are shown to users}
- **Error recovery**: {How the app recovers from errors}

### Logging
{Describe logging approach}
- **Logging library**: {e.g., "console", "Winston", "Sentry", "LogRocket"}
- **What gets logged**: {Types of events/errors that are logged}
- **Log levels**: {How different log levels are used}

### Analytics and Monitoring
{If applicable, describe analytics}
- **Analytics tools**: {e.g., "Google Analytics", "Mixpanel", "Amplitude"}
- **Tracked events**: {What user actions/events are tracked}
- **Performance monitoring**: {Tools for monitoring client performance}

## Asset Management

### Static Assets
{Describe how assets are managed}
- **Asset location**: {Where images, fonts, icons, etc. are stored}
- **Asset loading**: {How assets are imported and used}
- **Asset optimization**: {Image compression, lazy loading, etc.}

### Internationalization (i18n)
{If applicable, describe i18n approach}
- **i18n library**: {e.g., "react-i18next", "vue-i18n", "NSLocalizedString"}
- **Language files**: {Where translations are stored}
- **Language switching**: {How users change languages}

## Performance Optimization

### Performance Patterns
{Describe performance optimization strategies}
- **Code splitting**: {How code is split for optimal loading}
- **Lazy loading**: {What is lazy-loaded - routes, components, images}
- **Memoization**: {Use of React.memo, useMemo, etc.}
- **Bundle optimization**: {Tree shaking, minification, compression}

### Performance Monitoring
{How performance is measured}
- **Performance metrics**: {What metrics are tracked - LCP, FID, CLS, etc.}
- **Performance tools**: {e.g., "Lighthouse", "Web Vitals", "Xcode Instruments"}

## Accessibility

### Accessibility Standards
{Describe accessibility approach}
- **Standards followed**: {e.g., "WCAG 2.1 AA", "Section 508"}
- **Accessibility features**: {Screen reader support, keyboard navigation, ARIA labels}
- **Testing approach**: {How accessibility is tested}

## Deployment

### Build for Production
{Steps to build for production}
- **Production build**: {Command to create production build}
- **Build verification**: {How to verify the build is correct}

### Deployment Process
{Describe deployment approach}
- **Deployment target**: {Where the client is deployed - CDN, app stores, etc.}
- **Deployment command**: {If applicable, command or process for deployment}
- **CI/CD**: {If applicable, describe CI/CD pipeline}

### Release Process
{For mobile/desktop apps, describe release process}
- **Version management**: {How versions are managed}
- **Release channels**: {e.g., "App Store", "Google Play", "TestFlight", "beta channels"}
- **Update mechanism**: {How users receive updates}

## Documentation
{Links to additional documentation specific to this client}
- {Doc name}: {Link or path}

## Restricted Actions
{Define actions that AI agents should NOT perform in this client}

{Leave blank initially - user should review and populate}

# Client File Metadata
{
	This section contains the following information

	- Date Created: timestamp
	- Date Modified: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: {version from plugin.json}
}
