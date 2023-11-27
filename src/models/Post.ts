import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { Model } from "./base";
import { IsNotEmpty, IsString } from "class-validator";

@Entity()
export class Post extends Model<Post> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Column({
    unique: true,
    default: "",
  })
  slug!: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user!: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
  createSlug() {
    this.slug = this.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
}
