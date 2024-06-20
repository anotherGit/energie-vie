import { Module } from '@nestjs/common';
import { ExternalWineServiceService } from './external-wine-service.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ExternalWineServiceService],
})
export class ExternalWineServiceModule {}
