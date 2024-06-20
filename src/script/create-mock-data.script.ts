import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RoleService } from '../role/role.service';
import { WineBottleService } from '../wine-bottle/wine-bottle.service';
import { CreateWineBottleDto } from '../wine-bottle/dto/create-wine-bottle.dto';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { RoleEnum } from '../role/role.enum';
import { EntityManager } from 'typeorm';

const wineBottles = [
  {
    externalId: 'ext-10000',
    name: 'Chateau Pavie',
    type: 'effervescent',
    year: 2010,
    price: {
      value: 26.6,
    },
    grapeVarieties: [
      {
        name: 'Sauvignon Blanc',
      },
      {
        name: 'Chardonnay',
      },
      {
        name: 'Syrah',
      },
    ],
  },
  {
    externalId: 'ext-10001',
    name: 'Chateau Angelus',
    type: 'blanc',
    year: 2002,
    price: {
      value: 11.29,
    },
    grapeVarieties: [
      {
        name: 'Grenache',
      },
      {
        name: 'Chardonnay',
      },
      {
        name: 'Syrah',
      },
      {
        name: 'Cabernet Sauvignon',
      },
      {
        name: 'Merlot',
      },
    ],
  },
  {
    externalId: 'ext-10002',
    name: "Chateau d'Yquem",
    type: 'rouge',
    year: 1990,
    price: {
      value: 21.52,
    },
    grapeVarieties: [
      {
        name: 'Malbec',
      },
      {
        name: 'Cabernet Sauvignon',
      },
    ],
  },
  {
    externalId: 'ext-10003',
    name: 'Chateau Cheval Blanc',
    type: 'effervescent',
    year: 2023,
    price: {
      value: 82.39,
    },
    grapeVarieties: [
      {
        name: 'Syrah',
      },
    ],
  },
  {
    externalId: 'ext-10004',
    name: 'Chateau Pavie',
    type: 'blanc',
    year: 1996,
    price: {
      value: 47.69,
    },
    grapeVarieties: [
      {
        name: 'Sauvignon Blanc',
      },
      {
        name: 'Malbec',
      },
      {
        name: 'Grenache',
      },
    ],
  },
  {
    externalId: 'ext-10005',
    name: 'Domaine de la Romanée-Conti',
    type: 'blanc',
    year: 2017,
    price: {
      value: 92.36,
    },
    grapeVarieties: [
      {
        name: 'Pinot Noir',
      },
      {
        name: 'Merlot',
      },
    ],
  },
  {
    externalId: 'ext-10006',
    name: 'Screaming Eagle',
    type: 'rouge',
    year: 1997,
    price: {
      value: 28.48,
    },
    grapeVarieties: [
      {
        name: 'Grenache',
      },
      {
        name: 'Merlot',
      },
    ],
  },
  {
    externalId: 'ext-10007',
    name: 'Chateau Mouton Rothschild',
    type: 'rouge',
    year: 2017,
    price: {
      value: 12.78,
    },
    grapeVarieties: [
      {
        name: 'Grenache',
      },
    ],
  },
  {
    externalId: 'ext-10008',
    name: 'Chateau Angelus',
    type: 'rouge',
    year: 1990,
    price: {
      value: 53.52,
    },
    grapeVarieties: [
      {
        name: 'Sauvignon Blanc',
      },
      {
        name: 'Malbec',
      },
      {
        name: 'Merlot',
      },
    ],
  },
  {
    externalId: 'ext-10009',
    name: 'Chateau Lafite Rothschild',
    type: 'rosé',
    year: 1992,
    price: {
      value: 72.63,
    },
    grapeVarieties: [
      {
        name: 'Cabernet Sauvignon',
      },
      {
        name: 'Syrah',
      },
      {
        name: 'Sauvignon Blanc',
      },
      {
        name: 'Merlot',
      },
    ],
  },
  {
    externalId: 'ext-10010',
    name: 'Opus One',
    type: 'rosé',
    year: 2000,
    price: {
      value: 17.98,
    },
    grapeVarieties: [
      {
        name: 'Syrah',
      },
      {
        name: 'Malbec',
      },
      {
        name: 'Pinot Noir',
      },
    ],
  },
  {
    externalId: 'ext-10011',
    name: 'Chateau Margaux',
    type: 'effervescent',
    year: 2019,
    price: {
      value: 44.93,
    },
    grapeVarieties: [
      {
        name: 'Sauvignon Blanc',
      },
    ],
  },
  {
    externalId: 'ext-10012',
    name: 'Chateau Palmer',
    type: 'rosé',
    year: 2004,
    price: {
      value: 45.91,
    },
    grapeVarieties: [
      {
        name: 'Cabernet Sauvignon',
      },
    ],
  },
  {
    externalId: 'ext-10013',
    name: 'Sassicaia',
    type: 'rouge',
    year: 2022,
    price: {
      value: 76.01,
    },
    grapeVarieties: [
      {
        name: 'Grenache',
      },
      {
        name: 'Pinot Noir',
      },
    ],
  },
  {
    externalId: 'ext-10014',
    name: 'Chateau Angelus',
    type: 'effervescent',
    year: 2008,
    price: {
      value: 47.51,
    },
    grapeVarieties: [
      {
        name: 'Syrah',
      },
      {
        name: 'Pinot Noir',
      },
      {
        name: 'Grenache',
      },
      {
        name: 'Chardonnay',
      },
    ],
  },
  {
    externalId: 'ext-10015',
    name: 'Penfolds Grange',
    type: 'rouge',
    year: 1998,
    price: {
      value: 17.27,
    },
    grapeVarieties: [
      {
        name: 'Chardonnay',
      },
    ],
  },
  {
    externalId: 'ext-10016',
    name: 'Vega Sicilia',
    type: 'blanc',
    year: 1990,
    price: {
      value: 26.05,
    },
    grapeVarieties: [
      {
        name: 'Malbec',
      },
      {
        name: 'Sauvignon Blanc',
      },
    ],
  },
  {
    externalId: 'ext-10017',
    name: 'Chateau Margaux',
    type: 'rouge',
    year: 2001,
    price: {
      value: 96.1,
    },
    grapeVarieties: [
      {
        name: 'Malbec',
      },
      {
        name: 'Chardonnay',
      },
    ],
  },
  {
    externalId: 'ext-10018',
    name: 'Screaming Eagle',
    type: 'effervescent',
    year: 2013,
    price: {
      value: 62.62,
    },
    grapeVarieties: [
      {
        name: 'Malbec',
      },
    ],
  },
  {
    externalId: 'ext-10019',
    name: 'Masseto',
    type: 'blanc',
    year: 2012,
    price: {
      value: 21.0,
    },
    grapeVarieties: [
      {
        name: 'Sauvignon Blanc',
      },
      {
        name: 'Chardonnay',
      },
      {
        name: 'Grenache',
      },
    ],
  },
];

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  console.log(`> launch create-mock-data at ${new Date().toLocaleString()}`);

  const wineBottleService = appContext.get(WineBottleService);
  const roleService = appContext.get(RoleService);
  const authService = appContext.get(AuthService);
  const userService = appContext.get(UserService);
  const entityManager = appContext.get(EntityManager);

  const tableNames = entityManager.connection.entityMetadatas
    .map((entity) => `"${entity.tableName}"`)
    .join(', ');

  await entityManager.query(`truncate ${tableNames} restart identity cascade;`);

  await roleService.ensureRoleExistInDB();

  await authService.register({ email: 'piere@gmail.com', password: 'azerty' });
  await authService.register({ email: 'expert@gmail.com', password: 'azerty' });
  await authService.register({ email: 'admin@gmail.com', password: 'azerty' });

  const expert = await userService.findByEmail('expert@gmail.com');
  await userService.addRole(expert.id, RoleEnum.Expert);

  const admin = await userService.findByEmail('admin@gmail.com');
  await userService.addRole(admin.id, RoleEnum.Admin);

  for (const bottle of wineBottles) {
    await wineBottleService.create(bottle as CreateWineBottleDto);
  }

  await appContext.close();
}

bootstrap().catch((err) => {
  console.error('Error running script', err);
  process.exit(1);
});
