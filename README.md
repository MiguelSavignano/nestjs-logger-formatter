# nestjs-logger-formatter

## Usage

```
npm install nestjs-logger-formatter
```

```ts
import { Logger } from 'nestjs-logger-formatter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  await app.listen(3000);
}
```
