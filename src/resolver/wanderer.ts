import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Wanderer } from "../entity/Wanderer";
import { ResolverContext } from "../types";

@Resolver()
export class WandererResolver {
  @Query(() => [Wanderer])
  wanderers(@Ctx() { entityManager }: ResolverContext): Promise<Wanderer[]> {
    return entityManager.find(Wanderer);
  }

  @Query(() => Wanderer, { nullable: true })
  wanderer(
    @Ctx() { entityManager }: ResolverContext,
    @Arg("id", () => Int) id: number
  ): Promise<Wanderer | null> {
    return entityManager.findOneBy(Wanderer, { id });
  }

  @Mutation(() => Wanderer)
  createWanderer(
    @Ctx() { entityManager }: ResolverContext,
    @Arg("email") email: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("age", () => Int) age: number
  ): Promise<Wanderer> {
    return entityManager.save(Wanderer, {
      email,
      firstName,
      lastName,
      age,
    });
  }

  @Mutation(() => Wanderer, { nullable: true })
  async updateWanderer(
    @Ctx() { entityManager }: ResolverContext,
    @Arg("id", () => Int) id: number,
    @Arg("email", { nullable: true }) email?: string,
    @Arg("firstName", { nullable: true }) firstName?: string,
    @Arg("lastName", { nullable: true }) lastName?: string,
    @Arg("age", () => Int, { nullable: true }) age?: number
  ): Promise<Wanderer | null> {
    const wanderer = await entityManager.findOneBy(Wanderer, { id });
    if (!wanderer) {
      return null;
    }
    if (email !== undefined) {
      wanderer.email = email;
    }
    if (firstName !== undefined) {
      wanderer.firstName = firstName;
    }
    if (lastName !== undefined) {
      wanderer.lastName = lastName;
    }
    if (age !== undefined) {
      wanderer.age = age;
    }
    return entityManager.save(Wanderer, wanderer);
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteWanderer(
    @Ctx() { entityManager }: ResolverContext,
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    await entityManager.delete(Wanderer, { id });
    return true;
  }
}
