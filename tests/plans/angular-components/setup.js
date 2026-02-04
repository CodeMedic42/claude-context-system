const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const { createWriteStream, createReadStream } = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Extract } = require('unzipper');
const os = require('os');

/**
 * Setup angular-components test fixture
 *
 * Downloads Angular Components v21.1.2 from GitHub and extracts it to the fixture directory
 * Uses a cache to avoid repeated downloads
 */

const ANGULAR_VERSION = '21.1.2';
const ANGULAR_TAG = `v${ANGULAR_VERSION}`;
const ANGULAR_REPO_URL = `https://github.com/angular/components/archive/refs/tags/${ANGULAR_TAG}.zip`;
const HOME_DIR = os.homedir();
const CACHE_DIR = path.join(HOME_DIR, 'claude-context-test-runs', 'repo-cache', 'github.com', 'angular', 'components');
const CACHE_FILE = path.join(CACHE_DIR, `${ANGULAR_VERSION}.zip`);

/**
 * Download file from URL to destination
 */
async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`      Downloading from ${url}...`);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        return;
      }

      const fileStream = createWriteStream(destPath);
      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;
      let lastPercent = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const percent = Math.floor((downloadedSize / totalSize) * 100);
        if (percent > lastPercent && percent % 10 === 0) {
          console.log(`      Download progress: ${percent}%`);
          lastPercent = percent;
        }
      });

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`      ✓ Download complete: ${destPath}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlinkSync(destPath);
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * Extract ZIP file and rename extracted directory to target fixture path
 */
async function extractAndRename(zipPath, fixturePath) {
  console.log(`      Extracting ${zipPath}...`);

  // GitHub archives extract to a subdirectory like "components-21.1.2"
  const extractedDirName = `components-${ANGULAR_VERSION}`;
  const parentDir = path.dirname(fixturePath);
  const extractedPath = path.join(parentDir, extractedDirName);

  // Ensure parent directory exists
  await fs.ensureDir(parentDir);

  // Extract to parent directory
  await new Promise((resolve, reject) => {
    createReadStream(zipPath)
      .pipe(Extract({ path: parentDir }))
      .on('close', () => {
        console.log('      ✓ Extraction complete');
        resolve();
      })
      .on('error', reject);
  });

  // Rename extracted directory to fixture path
  console.log(`      Renaming ${extractedDirName} to fixture directory...`);
  await fs.move(extractedPath, fixturePath, { overwrite: true });
  console.log('      ✓ Directory ready');
}

async function beforeFixtureSetup(fixturePath) {
  console.log(`    Setting up angular-components test fixture (${ANGULAR_VERSION})...`);

  try {
    // Ensure cache directory exists
    await fs.ensureDir(CACHE_DIR);

    // Download if not cached
    if (!await fs.pathExists(CACHE_FILE)) {
      console.log('      Cache miss - downloading Angular Components repository...');
      await downloadFile(ANGULAR_REPO_URL, CACHE_FILE);
    } else {
      console.log(`      ✓ Using cached file: ${CACHE_FILE}`);
    }

    // Extract from cache and rename to fixture directory
    await extractAndRename(CACHE_FILE, fixturePath);

    console.log('      ✓ Angular Components repository ready');
  } catch (error) {
    console.error('      ✗ Failed to setup fixture:', error.message);
    throw error;
  }
}

module.exports = {
  testCommand: 'prepare',
  maxProjects: 5, // Angular Components has ~15 packages - should complete in 1-2 executions
  beforeFixtureSetup,
};
