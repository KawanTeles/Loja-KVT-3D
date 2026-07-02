import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, '..', 'logs');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'sync.log');

/**
 * Appends log messages to log file and prints to stdout.
 * @param {string} message - Content to log.
 * @param {string} level - Log level (INFO, WARN, ERROR).
 */
export function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  if (level === 'ERROR') {
    console.error(`[${level}] ${message}`);
  } else {
    console.log(`[${level}] ${message}`);
  }
  
  try {
    fs.appendFileSync(logFile, formattedMessage, 'utf8');
  } catch (err) {
    console.error('Failed to write to sync.log file:', err);
  }
}

export function info(message) {
  log(message, 'INFO');
}

export function warn(message) {
  log(message, 'WARN');
}

export function error(message, err = null) {
  const errMsg = err ? `${message} | Error: ${err.message || err}` : message;
  log(errMsg, 'ERROR');
}

export default {
  log,
  info,
  warn,
  error
};
