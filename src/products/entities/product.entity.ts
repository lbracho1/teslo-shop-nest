import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({ name: 'all_products' })
export class ProductEntity {

    @ApiProperty({
        example: '0baabea0-aa4f-4866-8441-241884a355b1',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string

    @ApiProperty({
        example: 0,
        description: 'Product Price',
    })
    @Column('float', {
        default: 0
    })
    price: number

    @ApiProperty({
        example: 'As with the iconic Tesla logo, the Cybertruck Graffiti',
        description: 'Product ID',
        default: null,
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string

    @ApiProperty({
        example: 10,
        description: 'Product Stock',
        default: 0,
    })
    @Column('int', {
        default: 0
    })
    stock: number

    @ApiProperty({
        example: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: 'Product Sizes',
    })
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: 'Men',
        description: 'Product Gender',
    })

    @Column('text')
    gender: string

    @ApiProperty({
        example: ['shirt', 'hoodie'],
        description: 'Product tags',
    })
    @Column('text', {
        array: true,
        default: [],
    })
    tags: string[];


    // images
    @ApiProperty({
        example: ['1741441-00-A_0_2000.jpg', '1741441-00-A_1.jpg'],
        description: 'Product Images',
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User


    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", ' ')
    }

    @BeforeUpdate()
    checkSlugUpdate() {

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}

