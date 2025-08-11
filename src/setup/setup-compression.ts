/* eslint-disable @typescript-eslint/no-unsafe-call */
import { INestApplication, Logger } from '@nestjs/common';
import compression from 'compression';
import { compressionConfig } from 'src/config/compression.config';
import { featuresConfig } from 'src/config/features.config';

const logger = new Logger('Compression');

export function setupCompression(app: INestApplication) {
  const { compression: enableCompression } = featuresConfig(); // boolean

  if (enableCompression) {
    app.use(compression(compressionConfig()));
    logger.log(
      `Compression enabled (threshold: ${compressionConfig().threshold}, zlib level: ${compressionConfig().zlib.level})`,
    );
  } else {
    logger.warn('Compression is disabled.');
  }
}
