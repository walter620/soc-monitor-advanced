/**
 * SOC Monitor v3.0 - Sistema de Logging
 * Proporciona logging estructurado con niveles y formatos
 */

const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL'
};

class Logger {
  constructor(namespace = 'SOC Monitor') {
    this.namespace = namespace;
    this.enabled = true;
    this.minLevel = LogLevel.DEBUG;
    this.colors = {
      [LogLevel.DEBUG]: '\x1b[36m',
      [LogLevel.INFO]: '\x1b[32m',
      [LogLevel.WARN]: '\x1b[33m',
      [LogLevel.ERROR]: '\x1b[31m',
      [LogLevel.FATAL]: '\x1b[35m',
      reset: '\x1b[0m'
    };
  }

  _shouldLog(level) {
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  _format(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[${this.namespace}]`;
    const levelColor = this.colors[level] || '';
    const resetColor = this.colors.reset || '';

    let output = `${levelColor}${prefix} ${level} ${timestamp} ${resetColor}${message}`;

    if (data) {
      output += `\n${JSON.stringify(data, null, 2)}`;
    }

    return output;
  }

  debug(message, data = null) {
    if (this._shouldLog(LogLevel.DEBUG)) {
      console.log(this._format(LogLevel.DEBUG, message, data));
    }
  }

  info(message, data = null) {
    if (this._shouldLog(LogLevel.INFO)) {
      console.log(this._format(LogLevel.INFO, message, data));
    }
  }

  warn(message, data = null) {
    if (this._shouldLog(LogLevel.WARN)) {
      console.warn(this._format(LogLevel.WARN, message, data));
    }
  }

  error(message, data = null) {
    if (this._shouldLog(LogLevel.ERROR)) {
      console.error(this._format(LogLevel.ERROR, message, data));
    }
  }

  fatal(message, data = null) {
    if (this._shouldLog(LogLevel.FATAL)) {
      console.error(this._format(LogLevel.FATAL, message, data));
    }
  }

  disable() {
    this.enabled = false;
    this.minLevel = LogLevel.FATAL;
  }

  enable() {
    this.enabled = true;
    this.minLevel = LogLevel.DEBUG;
  }

  setLevel(level) {
    if (Object.values(LogLevel).includes(level)) {
      this.minLevel = level;
    }
  }

  getLevel() {
    return this.minLevel;
  }
}

// Exportar instancias globales
const logger = new Logger('SOC Monitor v3.0');
const apiLogger = new Logger('API');
const userLogger = new Logger('UserManager');
const reportLogger = new Logger('ReportManager');

// Exportar para uso global
window.Logger = Logger;
window.LogLevel = LogLevel;
window.logger = logger;
window.apiLogger = apiLogger;
window.userLogger = userLogger;
window.reportLogger = reportLogger;
