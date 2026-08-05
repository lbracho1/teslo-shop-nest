import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductImage, ProductEntity } from './entities';
import { SeedModule } from 'src/seed/seed.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductImage])
  ],
  exports: [
    ProductsService,
    TypeOrmModule
  ]
})
export class ProductsModule { }
