import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Wanderer } from "../entity/Wanderer";
import { AppContext } from "../types";

@InputType()
class CreateInput {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
export const createInputProps = [
  "email",
  "firstName",
  "lastName",
  "username",
  "password",
]; // keep in sync with CreateInput

@InputType()
class UpdateInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  password?: string;
}

@ObjectType()
class LoginResponse {
  @Field({ nullable: true })
  error?: string;

  @Field({ nullable: true })
  wanderer?: Wanderer;
}

@Resolver()
export class WandererResolver {
  @Query(() => [Wanderer])
  wanderers(@Ctx() { entityManager }: AppContext): Promise<Wanderer[]> {
    return entityManager.find(Wanderer);
  }

  @Query(() => Wanderer, { nullable: true })
  wanderer(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number
  ): Promise<Wanderer | null> {
    return entityManager.findOneBy(Wanderer, { id });
  }

  @Mutation(() => Wanderer)
  async createWanderer(
    @Ctx() { entityManager }: AppContext,
    @Arg("input")
    { email, firstName, lastName, username, password }: CreateInput
  ): Promise<Wanderer> {
    const passwordHash = await argon2.hash(password);
    const wanderer = entityManager.create(Wanderer, {
      email,
      firstName,
      lastName,
      username,
      passwordHash,
    });
    return entityManager.save(Wanderer, wanderer);
  }

  @Mutation(() => Wanderer, { nullable: true })
  async updateWanderer(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number,
    @Arg("input")
    { email, firstName, lastName, username, password }: UpdateInput
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
    if (username !== undefined) {
      wanderer.username = username;
    }
    if (password !== undefined) {
      wanderer.passwordHash = await argon2.hash(password);
    }
    return entityManager.save(Wanderer, wanderer);
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteWanderer(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    await entityManager.delete(Wanderer, { id });
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Ctx() { entityManager }: AppContext,
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<LoginResponse> {
    const wanderer = await entityManager.findOneBy(Wanderer, { username });
    if (!wanderer) {
      return { error: "wanderer with username does not exist: " + username };
    }
    if (!(await argon2.verify(wanderer.passwordHash, password))) {
      return { error: "incorrect password" };
    }
    return { wanderer };
  }
}
