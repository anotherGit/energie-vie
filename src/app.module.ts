import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { WineBottleModule } from './wine-bottle/wine-bottle.module';
import { UserModule } from './user/user.module';
import { PriceModule } from './price/price.module';
import { GrapeVarietyModule } from './grape-variety/grape-variety.module';
import { RatingModule } from './rating/rating.module';
import { SavedSearchModule } from './saved-search/saved-search.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { ExternalWineServiceModule } from './external-wine-service/external-wine-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    WineBottleModule,
    RoleModule,
    SavedSearchModule,
    RatingModule,
    GrapeVarietyModule,
    PriceModule,
    ExternalWineServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
