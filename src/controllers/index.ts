import { Effect, FiberSet } from "effect";
import type { Request, Response } from "express-serve-static-core";
import { TodoRepositoryService } from "../services/repositories";
import { Express } from "../setup";

export const TodoController = Effect.gen(function* (_) {
  const app = yield* _(Express);
  const run = yield* _(FiberSet.makeRuntime());
  const todo = yield* _(TodoRepositoryService);

  const body = (_req: Request, res: Response) => {
    return Effect.gen(function* (_) {
      const todos = yield* _(todo.getTodos());
      res.json(todos);
    });
  };

  app.get("/", (req, res) => run(body(req, res)));
});
