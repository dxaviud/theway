import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entity/Post";
import { Vote } from "../entity/Vote";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { AppContext } from "../types";

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  contentSnippet(@Root() post: Post) {
    if (post.content.length <= 100) {
      return post.content;
    }
    return post.content.slice(0, 100) + "...";
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async vote(
    @Ctx() { entityManager, req }: AppContext,
    @Arg("postId", () => Int) postId: number,
    @Arg("flow", () => Int) flow: number
  ) {
    const { userId } = req!.session;
    flow = flow > 0 ? 1 : -1;
    const vote = await entityManager.findOne(Vote, {
      where: { userId: userId!, postId },
    });
    if (vote) {
      if (vote.flow == flow) {
        // undo the vote
        entityManager.transaction(async (em) => {
          await em.remove(vote);
          await em.query(
            `
UPDATE post
SET flow = flow - $1 
WHERE id = $2
          `,
            [flow, postId]
          );
        });
      } else {
        // change the vote
        entityManager.transaction(async (em) => {
          vote.flow = flow;
          await em.save(vote);
          await em.query(
            `
UPDATE post
SET flow = flow + $1 
WHERE id = $2
          `,
            [2 * flow, postId]
          );
        });
      }
    } else {
      await entityManager.query(`
START TRANSACTION;

INSERT INTO vote ("userId", "postId", flow)
VALUES (${userId}, ${postId}, ${flow});

UPDATE post
SET flow = flow + ${flow}
WHERE id = ${postId};

COMMIT;
    `);
    }
    return true;
  }

  @Query(() => [Post])
  posts(@Ctx() { entityManager, req }: AppContext): Promise<Post[]> {
    return entityManager.query(`
SELECT p.*, 
json_build_object(
  'id', u.id,
  'email', u.email,
  'createdDate', u."createdDate",
  'updatedDate', u."updatedDate"
) creator,
${
  req!.session.userId
    ? `(SELECT flow FROM vote WHERE "userId"= ${
        req!.session.userId
      } AND "postId" = p.id) "voteFlow"`
    : 'null as "voteFlow"'
}
FROM post p
INNER JOIN public.user u on u.id = p."creatorId"
ORDER BY p."createdDate" DESC
    `);
  }

  @Query(() => Post, { nullable: true })
  post(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number
  ): Promise<Post | null> {
    return entityManager.findOne(Post, {
      relations: ["creator"],
      where: { id },
    });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuthenticated)
  async createPost(
    @Ctx() { entityManager, req }: AppContext,
    @Arg("title") title: string,
    @Arg("content") content: string
  ): Promise<Post> {
    const post = entityManager.create(Post, {
      title,
      content,
      creatorId: req!.session.userId!, // checked by isAuthenticated middleware
    });
    await entityManager.save(Post, post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async updatePost(
    @Ctx() { entityManager, req }: AppContext,
    @Arg("id", () => Int) id: number,
    @Arg("title", { nullable: true }) title?: string,
    @Arg("content", { nullable: true }) content?: string
  ): Promise<Post | null> {
    const post = await entityManager.findOne(Post, {
      where: {
        id,
        creatorId: req!.session.userId!,
      },
    });
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
  @UseMiddleware(isAuthenticated)
  async deletePost(
    @Ctx() { entityManager, req }: AppContext,
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    const post = await entityManager.findOneBy(Post, { id });
    if (!post || post.creatorId !== req?.session.userId) {
      return false;
    }
    await entityManager.delete(Vote, { postId: id });
    await entityManager.delete(Post, { id, creatorId: req.session.userId });
    return true;
  }
}
