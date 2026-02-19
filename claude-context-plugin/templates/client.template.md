# Client Context: ~:Project Name:~

## Client Overview [overview] [summary]
~:Provide a clear description of what this client does, its primary purpose, and who uses it:~

## Client Type [metadata] [platform]
~:Specify the type of client:~
- **Type**: ~:e.g., Web SPA, Mobile App, Desktop App, CLI Tool:~
- **Platform**: ~:e.g., Web (React), iOS/Android, Electron, Node.js CLI:~
- **Target Users**: ~:Who uses this client - end users, developers, administrators:~

## Technologies [technologies] [stack]
~:List the key technologies, frameworks, and libraries used in this client:~
- **Language**: ~:e.g., TypeScript, Swift, Kotlin, Python:~
- **Framework**: ~:e.g., React, Vue, Angular, SwiftUI, Flutter, Electron:~
- **Key Dependencies**: ~:List major libraries and their purposes:~

## User Interface Patterns [ui] [patterns] [components]

### UI Framework and Components [ui] [components] [framework]
~:Describe the UI framework and component architecture:~
- **Component library**: ~:e.g., "Material-UI", "Ant Design", "Custom components", "Native SwiftUI":~
- **Component organization**: ~:How components are structured and organized:~
- **Styling approach**: ~:e.g., "CSS Modules", "Styled Components", "Tailwind", "Native styling":~

### Navigation and Routing [navigation] [routing]
~:Describe how navigation works in the client:~
- **Routing library**: ~:e.g., "React Router", "Navigation Stack", "CLI commands":~
- **Navigation pattern**: ~:How users move between screens/views/commands:~
- **Deep linking**: ~:If applicable, how deep links or direct navigation works:~

## State Management [state] [data-management]
~:Describe how application state is managed:~
- **State management approach**: ~:e.g., "Redux", "Context API", "MobX", "Vuex", "Local state only":~
- **State organization**: ~:How state is structured and where it lives:~
- **State persistence**: ~:How/where state is persisted - localStorage, AsyncStorage, files, etc.:~

## Data Flow [data-flow] [api-integration]

### API Integration [api] [integration] [requests]
~:Describe how the client communicates with backend services:~
- **API client library**: ~:e.g., "Axios", "Fetch", "Apollo Client", "URLSession":~
- **API base URLs**: ~:Environment-specific URLs or configuration:~
- **Request/Response handling**: ~:Patterns for making requests and handling responses:~
- **Error handling**: ~:How API errors are handled and displayed to users:~

### Data Caching [caching] [performance]
~:If applicable, describe caching strategy:~
- **Caching approach**: ~:e.g., "React Query", "Apollo Cache", "Manual localStorage":~
- **Cache invalidation**: ~:When and how cached data is refreshed:~

## Authentication and Authorization [security] [auth] [access-control]

### Authentication Flow [auth] [flow] [security]
~:Describe how users authenticate:~
- **Authentication method**: ~:e.g., "OAuth", "JWT", "Session cookies", "API keys":~
- **Login process**: ~:Steps users take to authenticate:~
- **Token storage**: ~:Where auth tokens are stored - localStorage, secure storage, keychain:~
- **Session handling**: ~:How sessions are maintained and refreshed:~

### Protected Routes/Screens [auth] [access-control] [routes]
~:Describe how access control works:~
- **Authorization approach**: ~:How protected areas are secured:~
- **Permission checking**: ~:Where and how permissions are checked:~
- **Unauthorized handling**: ~:What happens when users lack permissions:~

## User Input and Validation [input] [validation] [forms]

### Form Handling [forms] [input] [validation]
~:Describe how user input is managed:~
- **Form library**: ~:e.g., "React Hook Form", "Formik", "Native forms":~
- **Validation approach**: ~:e.g., "Yup schemas", "Zod", "Built-in validation":~
- **Validation timing**: ~:When validation occurs - on blur, on submit, real-time:~

### Input Patterns [input] [patterns] [ux]
~:Common input patterns users should follow:~
- **Required fields**: ~:How required fields are indicated and validated:~
- **Error display**: ~:How validation errors are shown to users:~
- **User feedback**: ~:Loading states, success messages, error notifications:~

## Build and Development [build] [development] [setup]

### Development Setup [development] [setup] [installation]
~:Steps to set up the client for development:~
- **Install dependencies**: ~:Command to install dependencies:~
- **Environment configuration**: ~:Required environment variables or config files:~
- **Development server**: ~:Command to start dev server/environment:~

### Build Process [build] [compilation] [bundling]
~:How to build the client for production:~
- **Build command**: ~:Command to create production build:~
- **Build output**: ~:Where build artifacts are created:~
- **Build optimization**: ~:Any build-time optimizations - code splitting, minification, etc.:~

### Environment Configuration [configuration] [environment]
~:How different environments are managed:~
- **Environment files**: ~:e.g., ".env.development", ".env.production":~
- **Environment variables**: ~:Key environment variables and their purposes:~
- **Configuration approach**: ~:How config is injected at build time or runtime:~

## Testing Patterns [testing] [quality] [test-automation]

### Testing Approach [testing] [strategy]
~:Describe the testing strategy:~
- **Testing frameworks**: ~:e.g., "Jest", "React Testing Library", "XCTest", "Espresso":~
- **Test types**: ~:Unit tests, integration tests, E2E tests:~
- **Test organization**: ~:Where tests live and how they're organized:~

### Testing Commands [testing] [commands]
~:Commands to run tests:~
- **Run all tests**: ~:Command:~
- **Run specific tests**: ~:Command pattern:~
- **Coverage reports**: ~:How to generate coverage:~

### E2E Testing [testing] [e2e] [integration]
~:If applicable, describe end-to-end testing:~
- **E2E framework**: ~:e.g., "Cypress", "Playwright", "Detox":~
- **Test scenarios**: ~:What scenarios are covered by E2E tests:~
- **Running E2E tests**: ~:Commands and requirements:~

## Error Handling and Logging [errors] [logging] [debugging]

### Error Boundaries [errors] [error-handling] [recovery]
~:Describe how errors are caught and handled:~
- **Error catching**: ~:e.g., "React Error Boundaries", "try-catch", "global handlers":~
- **Error display**: ~:How errors are shown to users:~
- **Error recovery**: ~:How the app recovers from errors:~

### Logging [logging] [observability]
~:Describe logging approach:~
- **Logging library**: ~:e.g., "console", "Winston", "Sentry", "LogRocket":~
- **What gets logged**: ~:Types of events/errors that are logged:~
- **Log levels**: ~:How different log levels are used:~

### Analytics and Monitoring [analytics] [monitoring] [telemetry]
~:If applicable, describe analytics:~
- **Analytics tools**: ~:e.g., "Google Analytics", "Mixpanel", "Amplitude":~
- **Tracked events**: ~:What user actions/events are tracked:~
- **Performance monitoring**: ~:Tools for monitoring client performance:~

## Asset Management [assets] [resources] [static-files]

### Static Assets [assets] [images] [fonts]
~:Describe how assets are managed:~
- **Asset location**: ~:Where images, fonts, icons, etc. are stored:~
- **Asset loading**: ~:How assets are imported and used:~
- **Asset optimization**: ~:Image compression, lazy loading, etc.:~

### Internationalization (i18n) [i18n] [localization] [translation]
~:If applicable, describe i18n approach:~
- **i18n library**: ~:e.g., "react-i18next", "vue-i18n", "NSLocalizedString":~
- **Language files**: ~:Where translations are stored:~
- **Language switching**: ~:How users change languages:~

## Performance Optimization [performance] [optimization] [efficiency]

### Performance Patterns [performance] [patterns] [optimization]
~:Describe performance optimization strategies:~
- **Code splitting**: ~:How code is split for optimal loading:~
- **Lazy loading**: ~:What is lazy-loaded - routes, components, images:~
- **Memoization**: ~:Use of React.memo, useMemo, etc.:~
- **Bundle optimization**: ~:Tree shaking, minification, compression:~

### Performance Monitoring [performance] [monitoring] [metrics]
~:How performance is measured:~
- **Performance metrics**: ~:What metrics are tracked - LCP, FID, CLS, etc.:~
- **Performance tools**: ~:e.g., "Lighthouse", "Web Vitals", "Xcode Instruments":~

## Accessibility [accessibility] [a11y] [inclusive-design]

### Accessibility Standards [accessibility] [standards] [compliance]
~:Describe accessibility approach:~
- **Standards followed**: ~:e.g., "WCAG 2.1 AA", "Section 508":~
- **Accessibility features**: ~:Screen reader support, keyboard navigation, ARIA labels:~
- **Testing approach**: ~:How accessibility is tested:~

## Build for Production [build] [production]

~:Commands to build for production:~
- **Production build command**: ~:Command to create production build:~
- **Build output**: ~:Where build artifacts are created:~
- **Build verification**: ~:How to verify the build is correct:~

## Documentation [documentation] [reference]
~:Links to additional documentation specific to this client:~
- ~:Doc name:~: ~:Link or path:~

## Restricted Actions [security] [restrictions] [policies]
~:Define actions that AI agents should NOT perform in this client:~

~:Leave blank initially - user should review and populate:~

# Agent File Maintenance [metadata] [maintenance]
~:Keep this section but do not modify the contents:~
No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]
{
	This section contains the following information

	- Revision Date: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: 2.1.0
}
