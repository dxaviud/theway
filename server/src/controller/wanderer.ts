import express, { Router } from "express";
import { QueryFailedError } from "typeorm";
import { createInputProps, WandererResolver } from "../resolver/wanderer";
import { hasProperties } from "../util";

export const wanderer = Router();

wanderer.use(express.json());

const resolver = new WandererResolver();

wanderer.get("/", async (req, res) => {
  res.json(await resolver.wanderers(req.context));
});

wanderer.get("/me", async (req, res) => {
  res.json(await resolver.me(req.context));
});

wanderer.get("/:id", async (req, res) => {
  const wanderer = await resolver.wanderer(req.context, Number(req.params.id));
  if (!wanderer) {
    res.sendStatus(404);
    return;
  }
  res.json(wanderer);
});

wanderer.post("/create", async (req, res, next) => {
  console.log("create wanderer");
  if (!hasProperties(req.body, createInputProps)) {
    res.sendStatus(400);
    return;
  }
  try {
    res.json(await resolver.createWanderer(req.context, req.body));
  } catch (err) {
    console.log(err);
    if (err instanceof QueryFailedError) {
      err.message.includes("violates unique constraint");
      res.sendStatus(400);
      return;
    }
    next(err);
    return;
  }
});

wanderer.post("/update/:id", async (req, res, next) => {
  console.log("update wanderer w/ id", req.params.id);
  try {
    const wanderer = await resolver.updateWanderer(
      req.context,
      Number(req.params.id),
      req.body
    );
    if (!wanderer) {
      res.sendStatus(404);
      return;
    }
    res.json(wanderer);
  } catch (err) {
    if (err instanceof QueryFailedError) {
      err.message.includes("violates unique constraint");
      res.sendStatus(400);
      return;
    }
    next(err);
    return;
  }
});

wanderer.post("/delete/:id", async (req, res) => {
  console.log("delete wanderer w/ id", req.params.id);
  res.json(await resolver.deleteWanderer(req.context, Number(req.params.id)));
});

wanderer.post("/login", async (req, res) => {
  console.log("logging in ", req.body);
  if (!hasProperties(req.body, ["username", "password"])) {
    res.sendStatus(400);
    return;
  }
  const loginResponse = await resolver.login(
    req.context,
    req.body.username,
    req.body.password
  );
  if (loginResponse.error) {
    res.status(400);
  }
  res.json(loginResponse);
});
