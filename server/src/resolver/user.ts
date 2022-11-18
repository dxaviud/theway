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
import { COOKIE_NAME } from "../constants";
import { User } from "../entity/User";
import { AppContext } from "../types";

@InputType()
class UpdateUserInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class RegisterResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field({ nullable: true })
  user?: User;
}

@ObjectType()
class LoginResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field({ nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { entityManager, req }: AppContext): Promise<User | null> {
    if (!req?.session.userId) {
      return null;
    }
    return await entityManager.findOneBy(User, {
      id: req.session.userId,
    });
  }

  @Query(() => [User])
  users(@Ctx() { entityManager }: AppContext): Promise<User[]> {
    return entityManager.find(User);
  }

  @Query(() => User, { nullable: true })
  user(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number
  ): Promise<User | null> {
    return entityManager.findOneBy(User, { id });
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Ctx() { entityManager, req }: AppContext,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<RegisterResponse> {
    console.log("register", { email, password });
    const errors: FieldError[] = [];
    if (email.length < 3) {
      errors.push({ field: "email", message: "email too short" });
    } else {
      if (await entityManager.findOneBy(User, { email })) {
        errors.push({ field: "email", message: "email already taken" });
      }
    }
    if (password.length < 3) {
      errors.push({ field: "password", message: "password too short" });
    }
    if (errors.length > 0) {
      return { errors };
    }
    const passwordHash = await argon2.hash(password);
    const user = entityManager.create(User, {
      email,
      passwordHash,
    });
    await entityManager.save(User, user);
    if (!req) {
      throw new Error("request missing");
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number,
    @Arg("input")
    { email, password }: UpdateUserInput
  ): Promise<User | null> {
    const user = await entityManager.findOneBy(User, { id });
    if (!user) {
      return null;
    }
    if (email !== undefined) {
      user.email = email;
    }
    if (password !== undefined) {
      user.passwordHash = await argon2.hash(password);
    }
    return entityManager.save(User, user);
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteUser(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    await entityManager.delete(User, { id });
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Ctx() { entityManager, req }: AppContext,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<LoginResponse> {
    const user = await entityManager.findOneBy(User, { email });
    if (!user) {
      return { errors: [{ field: "email", message: "email not found" }] };
    }
    if (!(await argon2.verify(user.passwordHash, password))) {
      return { errors: [{ field: "password", message: "password incorrect" }] };
    }
    if (!req) {
      throw new Error("request missing");
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean!)
  async logout(@Ctx() { req, res }: AppContext) {
    res?.clearCookie(COOKIE_NAME);
    return new Promise((resolve) =>
      req?.session.destroy((err) => {
        if (err) {
          console.log("error destroying session", err);
          resolve(false);
        } else {
          console.log("destoryed session");
          resolve(true);
        }
      })
    );
  }
}
