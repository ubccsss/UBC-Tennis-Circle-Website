// Winston
import winston from "winston";

// Path
import path from "path";


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
        // puts error logs in logs file 
        filename: path.resolve("src/logs/error.log"),
        level: 'error' }),
    new winston.transports.File({
        // puts combined logs in logs file
        filename: path.resolve("src/logs/combined.log") }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}


export default logger