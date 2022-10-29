import express, { Router } from "express";
import { WandererResolver } from "../resolver/wanderer";

export const wanderer = Router();

wanderer.use(express.json());

const resolver = new WandererResolver();

wanderer.get("/", async (req, res) => {
  res.json(await resolver.wanderers(req.context));
});

wanderer.get("/:id", async (req, res) => {
  res.json(await resolver.wanderer(req.context, Number(req.params.id)));
});

wanderer.post("/create", async (req, res) => {
  console.log("create wanderer");
  res.json(
    await resolver.createWanderer(
      req.context,
      req.body.email,
      req.body.firstName,
      req.body.lastName,
      Number(req.body.age)
    )
  );
});

wanderer.post("/update/:id", async (req, res) => {
  console.log("update wanderer w/ id", req.params.id);
  res.json(
    await resolver.updateWanderer(
      req.context,
      Number(req.params.id),
      req.body.email,
      req.body.firstName,
      req.body.lastName,
      Number(req.body.age)
    )
  );
});

wanderer.post("/delete/:id", async (req, res) => {
  console.log("delete wanderer w/ id", req.params.id);
  res.json(await resolver.deleteWanderer(req.context, Number(req.params.id)));
});
