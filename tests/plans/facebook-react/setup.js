const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const { createWriteStream, createReadStream } = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Extract } = require('unzipper');
const os = require('os');

/**
 * Setup facebook-react test fixture
 *
 * Downloads React v19.0.0 from GitHub and extracts it to the fixture directory
 * Uses a cache to avoid repeated downloads
 */

const REACT_VERSION = 'v19.0.0';
const REACT_REPO_URL = `https://github.com/facebook/react/archive/refs/tags/${REACT_VERSION}.zip`;
const HOME_DIR = os.homedir();
const CACHE_DIR = path.join(HOME_DIR, 'claude-context-test-runs', 'repo-cache', 'github.com', 'facebook', 'react');
const CACHE_FILE = path.join(CACHE_DIR, `${REACT_VERSION}.zip`);

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

  // GitHub archives extract to a subdirectory like "react-19.0.0"
  const extractedDirName = `react-${REACT_VERSION.replace('v', '')}`;
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
  console.log(`    Setting up facebook-react test fixture (${REACT_VERSION})...`);

  try {
    // Ensure cache directory exists
    await fs.ensureDir(CACHE_DIR);

    // Download if not cached
    if (!await fs.pathExists(CACHE_FILE)) {
      console.log('      Cache miss - downloading React repository...');
      await downloadFile(REACT_REPO_URL, CACHE_FILE);
    } else {
      console.log(`      ✓ Using cached file: ${CACHE_FILE}`);
    }

    // Extract from cache and rename to fixture directory
    await extractAndRename(CACHE_FILE, fixturePath);

    console.log('      ✓ React repository ready');
  } catch (error) {
    console.error('      ✗ Failed to setup fixture:', error.message);
    throw error;
  }
}

module.exports = {
  testCommand: 'prepare',
  maxProjects: 5, // React is a large repo with 50+ projects - process 10 at a time
  beforeFixtureSetup,
};
