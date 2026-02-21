const { ClaudeData } = require('../../lib/context-data');
const {
  testClaudeFile,
  testClientFile,
  testLibraryFile,
} = require('../../lib/common-tests');

describe('angular-components:context', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  const cdkData = contextData.getProjectContextData('./src/cdk/LIBRARY.CLAUDE.md');
  const ariaData = contextData.getProjectContextData('./src/aria/LIBRARY.CLAUDE.md');
  const materialData = contextData.getProjectContextData('./src/material/LIBRARY.CLAUDE.md');
  const materialExperimentalData = contextData.getProjectContextData('./src/material-experimental/LIBRARY.CLAUDE.md');
  const cdkExperimentalData = contextData.getProjectContextData('./src/cdk-experimental/LIBRARY.CLAUDE.md');
  const googleMapsData = contextData.getProjectContextData('./src/google-maps/LIBRARY.CLAUDE.md');
  const materialDateFnsAdapterData = contextData.getProjectContextData('./src/material-date-fns-adapter/LIBRARY.CLAUDE.md');
  const materialLuxonAdapterData = contextData.getProjectContextData('./src/material-luxon-adapter/LIBRARY.CLAUDE.md');
  const materialMomentAdapterData = contextData.getProjectContextData('./src/material-moment-adapter/LIBRARY.CLAUDE.md');
  const componentsExamplesData = contextData.getProjectContextData('./src/components-examples/LIBRARY.CLAUDE.md');

  const e2eAppData = contextData.getProjectContextData('./src/e2e-app/CLIENT.CLAUDE.md');
  const devAppData = contextData.getProjectContextData('./src/dev-app/CLIENT.CLAUDE.md');
  const docsData = contextData.getProjectContextData('./docs/CLIENT.CLAUDE.md');
  const integrationData = contextData.getProjectContextData('./integration/LIBRARY.CLAUDE.md');

  // Test CLAUDE.md
  testClaudeFile(contextData, {
    techContextFileCount: 25,
    projectContextFileCount: 25,
  });

  testLibraryFile(cdkData, '@angular/cdk');
  testLibraryFile(ariaData, '@angular/aria');
  testLibraryFile(materialData, '@angular/material');
  testLibraryFile(materialExperimentalData, '@angular/material-experimental');
  testLibraryFile(cdkExperimentalData, '@angular/cdk-experimental');
  testLibraryFile(googleMapsData, '@angular/google-maps');
  testLibraryFile(materialDateFnsAdapterData, '@angular/material-date-fns-adapter');
  testLibraryFile(materialLuxonAdapterData, '@angular/material-luxon-adapter');
  testLibraryFile(materialMomentAdapterData, '@angular/material-moment-adapter');
  testLibraryFile(componentsExamplesData, '@angular/components-examples');
  testLibraryFile(integrationData, 'Integration Tests');

  testClientFile(e2eAppData, 'End-to-End Test Application');
  testClientFile(devAppData, 'Development Demo Application');
  testClientFile(docsData, 'Material Angular Documentation Website');
});
