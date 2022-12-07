import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Vote {
  @PrimaryColumn()
  postId!: number;

  @PrimaryColumn()
  userId!: number;

  @Column()
  flow!: number;

  @ManyToOne(() => Post, (post) => post.votes)
  post!: Post;

  @ManyToOne(() => User, (user) => user.votes)
  user!: User;
}
