// src/config/versioning.config.ts
import { VersioningType } from '@nestjs/common';

export const versioningConfig = () => ({
  type: VersioningType.URI as const, // ✅ Not CUSTOM
  defaultVersion: '1',
});
