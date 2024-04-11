import { Effect, Layer } from "effect";
import { TodoController } from "./controllers";
import { base, Express } from "./setup";
import { TodoRepositoryService, repositories } from "./services/repositories";

function main() {
  /**
   * Live express instance to inject as dependency.
   */
  const ExpressLive = Layer.sync(Express, () => base);

  /**
   * Starts and stops a provided express instance.
   */
  const ServerLive = Layer.scopedDiscard(
    Effect.gen(function* (_) {
      const port = 3000;
      const app = yield* _(Express);

      yield* _(
        Effect.acquireRelease(
          Effect.sync(() => {
            const server = app.listen(port, () => {
              console.log(`Listening at http://localhost:${port}`);
            });
            return server;
          }),
          (server) => Effect.sync(() => server.close()),
        ),
      );
    }),
  );

  const TodoRepositoryLive = Layer.succeed(
    TodoRepositoryService,
    repositories.todo,
  );

  const TodoControllerLive = Layer.scopedDiscard(TodoController);

  /**
   * A live instance of the app is created by providing an express instance to be initialized.
   */
  const AppLive = ServerLive.pipe(Layer.provide(ExpressLive));

  /**
   * Live instance of all the merged controllers.
   */
  const ControllerLive = Layer.mergeAll(TodoControllerLive);

  const Main = AppLive.pipe(
    Layer.provide(ControllerLive),
    Layer.provide(ExpressLive),
    Layer.provide(TodoRepositoryLive),
  );

  Effect.runFork(Layer.launch(Main));
}

main();
