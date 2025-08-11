import { CompressionOptions } from 'compression';
import { Request, Response } from 'express';

export interface CompressionConfig extends CompressionOptions {
  threshold?: number;
  filter?: (req: Request, res: Response) => boolean;
  zlib: {
    level: number;
  };
}

export const compressionConfig = (): CompressionConfig => ({
  threshold: Number(process.env.COMPRESSION_THRESHOLD) || 1024,
  filter: (req: Request) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return true;
  },
  zlib: {
    level: Number(process.env.COMPRESSION_LEVEL) || 6,
  },
});
