import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entity/Post";
import { AppContext } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { entityManager }: AppContext): Promise<Post[]> {
    return entityManager.find(Post);
  }

  @Query(() => Post, { nullable: true })
  post(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number
  ): Promise<Post | null> {
    return entityManager.findOneBy(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Ctx() { entityManager }: AppContext,
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