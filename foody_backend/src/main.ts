import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DatabaseSeederService } from './common/database-seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); 

  
  const configService = app.get(ConfigService);
  await app.listen(configService.get('APP_PORT'));

  const databaseSeederService = app.get(DatabaseSeederService);
   await databaseSeederService.seed();

}
bootstrap();
