import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { URL } from 'url';
import 'dotenv/config';

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    const routingId = dbUrl.searchParams.get('options');

    return {
      type: 'cockroachdb',
      url: dbUrl.toString(),
      ssl: true,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      extra: { options: routingId },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'DATABASE_URL',
]);

export { configService };
