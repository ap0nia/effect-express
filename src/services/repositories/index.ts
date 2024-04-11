import { Context, Effect } from "effect";

export interface Todo {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
}

// Define the repository as a service
export class TodoRepositoryService extends Context.Tag("TodoRepository")<
  TodoRepositoryService,
  TodoRepository
>() {}

const sampleData: Todo[] = [
  {
    id: 1,
    title: "delectus aut autem",
    completed: false,
  },
  {
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false,
  },
  {
    id: 3,
    title: "fugiat veniam minus",
    completed: false,
  },
];

/**
 * Implementation of the todo repository.
 */
export class TodoRepository {
  getTodos() {
    return Effect.succeed(sampleData);
  }

  getTodo(id: number) {
    return Effect.succeed(sampleData.find((todo) => todo.id === id) || null);
  }
}

export const repositories = {
  todo: new TodoRepository(),
};
