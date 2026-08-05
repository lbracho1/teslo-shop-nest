import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from ".";

@Entity({ name: 'all_images' })
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        () => ProductEntity,
        (productEntity) => productEntity.images,
        { onDelete: 'CASCADE' }
    )
    product: ProductEntity;
};