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
import { v4 } from "uuid";
import isEmail from "validator/lib/isEmail";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { User } from "../entity/User";
import { AppContext } from "../types";
import { sendEmail } from "../util/sendEmail";

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
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field({ nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Ctx() { entityManager, redis, req }: AppContext,
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string
  ): Promise<UserResponse> {
    console.log("changePassword", { token, newPassword });
    if (newPassword.length < 3) {
      return {
        errors: [{ field: "newPassword", message: "password too short" }],
      };
    }
    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return { errors: [{ field: "token", message: "token expired" }] };
    }
    const user = await entityManager.findOneBy(User, { id: Number(userId) });
    if (!user) {
      return { errors: [{ field: "token", message: "user no longer exists" }] };
    }
    user.passwordHash = await argon2.hash(newPassword);
    await entityManager.save(user);

    await redis.del(key);

    if (!req) {
      throw new Error("request missing");
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() { entityManager, redis }: AppContext,
    @Arg("email") email: string
  ): Promise<boolean> {
    const user = await entityManager.findOneBy(User, { email });
    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60
    );

    sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">Click to reset password</a>`
    );
    return true;
  }

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

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { entityManager, req }: AppContext,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    console.log("register", { email, password });
    const errors: FieldError[] = [];
    if (email.length < 3) {
      errors.push({ field: "email", message: "email too short" });
    } else if (!isEmail(email)) {
      errors.push({ field: "email", message: "email is invalid" });
    } else if (await entityManager.findOneBy(User, { email })) {
      errors.push({ field: "email", message: "email already taken" });
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
    await entityManager.save(user);
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
    return entityManager.save(user);
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteUser(
    @Ctx() { entityManager }: AppContext,
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    await entityManager.delete(User, { id });
    return true;
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { entityManager, req }: AppContext,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
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
