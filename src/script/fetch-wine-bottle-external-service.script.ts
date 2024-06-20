import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WineBottleService } from '../wine-bottle/wine-bottle.service';
import {
  ExternalWineBottle,
  ExternalWineServiceService,
} from '../external-wine-service/external-wine-service.service';
import { CreateWineBottleDto } from '../wine-bottle/dto/create-wine-bottle.dto';
import { validate } from 'class-validator';
import { UpdateWineBottleDto } from '../wine-bottle/dto/update-wine-bottle.dto';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const wineBottleService = appContext.get(WineBottleService);
  const externalWineService = appContext.get(ExternalWineServiceService);

  console.log(
    `> launch fetch-wine-bottle-external-service at ${new Date().toLocaleString()}`,
  );

  const lastCreatedWineBottle = await wineBottleService.findLastCreated();
  if (!lastCreatedWineBottle) {
    console.log('> No previously created wine bottle found');
    return;
  }

  const fromDate = lastCreatedWineBottle.createdAt;

  console.log(`\n> lastCreatedWineBottle created at ${fromDate}`);

  console.log('\n> fetch recently added bottles...');
  let recentlyAddedWineBottles: ExternalWineBottle[];
  try {
    recentlyAddedWineBottles =
      await externalWineService.getRecentlyAddedWineBottles(fromDate);
  } catch (error) {
    console.error('Error fetching recently added wine bottles:', error);
    return;
  }

  console.log(
    `> found ${recentlyAddedWineBottles.length} recently added bottles\n`,
  );

  let cpt = 0;
  for (const externalWineBottle of recentlyAddedWineBottles) {
    console.log(
      `> ${++cpt} / ${recentlyAddedWineBottles.length} (${externalWineBottle.id})`,
    );

    const existingBottle = await wineBottleService.findByExternalId(
      externalWineBottle.id,
    );
    if (existingBottle) continue;

    const dto = {
      externalId: externalWineBottle.id,
      name: externalWineBottle.name,
      type: externalWineBottle.type,
      year: externalWineBottle.year,
      price: { value: externalWineBottle.price },
      grapeVarieties: externalWineBottle.grapeVarieties.map((gv) => ({
        name: gv,
      })),
    } as CreateWineBottleDto;

    const errors = await validate(dto);
    if (errors.length === 0) {
      await wineBottleService.create(dto);
      console.log('\tadded');
    } else {
      //error
      console.log(
        `\terror : cannot validate dto : ${JSON.stringify(dto)} | ${JSON.stringify(errors)}`,
      );
    }
  }

  console.log('\n> fetch recently updated bottles...');
  let recentlyUpdatedWineBottles: ExternalWineBottle[];
  try {
    recentlyUpdatedWineBottles =
      await externalWineService.getRecentlyUpdatedWineBottles(fromDate);
  } catch (error) {
    console.error('Error fetching recently updated wine bottles:', error);
    return;
  }

  console.log(
    `> found ${recentlyUpdatedWineBottles.length} recently updated bottles\n`,
  );

  cpt = 0;
  for (const externalWineBottle of recentlyUpdatedWineBottles) {
    console.log(
      `> ${++cpt} / ${recentlyUpdatedWineBottles.length} (${externalWineBottle.id})`,
    );

    const existingBottle = await wineBottleService.findByExternalId(
      externalWineBottle.id,
    );
    if (!existingBottle) continue;

    const dto = {
      name: externalWineBottle.name,
      type: externalWineBottle.type,
      year: externalWineBottle.year,
      price: { value: externalWineBottle.price },
      grapeVarieties: externalWineBottle.grapeVarieties.map((gv) => ({
        name: gv,
      })),
    } as UpdateWineBottleDto;

    const errors = await validate(dto);
    if (errors.length === 0) {
      await wineBottleService.update(existingBottle.id, dto);
      console.log('\tupdated');
    } else {
      //error
      console.log(
        `\terror : cannot validate dto : ${JSON.stringify(dto)} | ${JSON.stringify(errors)}`,
      );
    }
  }

  await appContext.close();
}

bootstrap().catch((err) => {
  console.error('Error running script', err);
  process.exit(1);
});
