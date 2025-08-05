import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Ensure all hooks are called at the top level
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle("Financial Control API")
    .setDescription("API para controle financeiro pessoal")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  await app.listen(3001)
  console.log("🚀 Backend rodando em http://localhost:3001")
  console.log("📚 Documentação em http://localhost:3001/api")
}
bootstrap()
