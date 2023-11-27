import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { IsString, IsNotEmpty } from "class-validator";
import { Post } from "./Post";
import { Comment } from "./Comment";

import * as bcrypt from "bcrypt";
import { Model } from "./base";

@Entity()
export class User extends Model<User> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @Column({
    select: false,
  })
  password!: string;

  @CreateDateColumn({
    select: false,
  })
  createdAt!: Date;

  @UpdateDateColumn({
    select: false,
  })
  updatedAt!: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
}
