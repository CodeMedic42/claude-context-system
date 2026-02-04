const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const { createWriteStream, createReadStream } = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Extract } = require('unzipper');
const os = require('os');

/**
 * Setup actix-web test fixture
 *
 * Downloads actix-web v4.12.1 from GitHub and extracts it to the fixture directory
 * Uses a cache to avoid repeated downloads
 */

const ACTIX_VERSION = 'web-v4.12.1';
const ACTIX_REPO_URL = `https://github.com/actix/actix-web/archive/refs/tags/${ACTIX_VERSION}.zip`;
const HOME_DIR = os.homedir();
const CACHE_DIR = path.join(HOME_DIR, 'claude-context-test-runs', 'repo-cache', 'github.com', 'actix', 'actix-web');
const CACHE_FILE = path.join(CACHE_DIR, `${ACTIX_VERSION}.zip`);

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

  // GitHub archives extract to a subdirectory like "actix-web-web-v4.12.1"
  const extractedDirName = `actix-web-${ACTIX_VERSION}`;
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
  console.log(`    Setting up actix-web test fixture (${ACTIX_VERSION})...`);

  try {
    // Ensure cache directory exists
    await fs.ensureDir(CACHE_DIR);

    // Download if not cached
    if (!await fs.pathExists(CACHE_FILE)) {
      console.log('      Cache miss - downloading actix-web repository...');
      await downloadFile(ACTIX_REPO_URL, CACHE_FILE);
    } else {
      console.log(`      ✓ Using cached file: ${CACHE_FILE}`);
    }

    // Extract from cache and rename to fixture directory
    await extractAndRename(CACHE_FILE, fixturePath);

    console.log('      ✓ actix-web repository ready');
  } catch (error) {
    console.error('      ✗ Failed to setup fixture:', error.message);
    throw error;
  }
}

module.exports = {
  testCommand: 'prepare',
  maxProjects: 5, // actix-web has 11 packages - should complete in one execution
  beforeFixtureSetup,
};
