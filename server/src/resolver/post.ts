import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entity/Post";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { AppContext } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { entityManager }: AppContext): Promise<Post[]> {
    return entityManager.query(`
    SELECT p.*, 
    json_build_object(
      'id', u.id,
      'email', u.email,
      'createdDate', u."createdDate",
      'updatedDate', u."updatedDate"
    ) creator
    FROM post p
    INNER JOIN public.user u on u.id = p."creatorId"
    `);
  }

  @Query(() => Post, { nullable: true })
  post(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number
  ): Promise<Post | null> {
    return entityManager.findOneBy(Post, { id });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuthenticated)
  async createPost(
    @Ctx() { entityManager, req }: AppContext,
    @Arg("title") title: string,
    @Arg("content") content: string
  ) {
    console.log("createPost", { title, content });
    // const errors: FieldError[] = [];
    // if (title.length < 3) {
    //   errors.push({ field: "email", message: "email too short" });
    // } else {
    //   if (await entityManager.findOneBy(Post, { email })) {
    //     errors.push({ field: "email", message: "email already taken" });
    //   }
    // }
    // if (password.length < 3) {
    //   errors.push({ field: "password", message: "password too short" });
    // }
    // if (errors.length > 0) {
    //   return { errors };
    // }
    const post = entityManager.create(Post, {
      title,
      content,
      creatorId: req!.session.userId!, // checked by isAuthenticated middleware
    });
    await entityManager.save(Post, post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number,
    @Arg("title", { nullable: true }) title?: string,
    @Arg("content", { nullable: true }) content?: string
  ): Promise<Post | null> {
    console.log("updatePost", { title, content });
    const post = await entityManager.findOneBy(Post, { id });
    if (!post) {
      return null;
    }
    if (title !== undefined) {
      post.title = title;
    }
    if (content !== undefined) {
      post.content = content;
    }
    return entityManager.save(Post, post);
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    await entityManager.delete(Post, { id });
    return true;
  }
}
