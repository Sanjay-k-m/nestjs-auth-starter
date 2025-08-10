import { Module } from '@nestjs/common';
import { MailService } from './mailProvider.service'; // adjust path
import { TempUserStoreService } from './temp-user-store.service'; // adjust path

@Module({
  providers: [MailService, TempUserStoreService],
  exports: [MailService, TempUserStoreService], // export to use in other modules
})
export class ServicesModule {}
