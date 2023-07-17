import { Server, Response } from "miragejs";

// Some imports from routes folder. Ex:
// import { mock1Routes } from './routes/mock1Routes'

const createMirageServer = () => {
  const server = new Server({
    routes() {
      this.post("/api/auth/sign-in", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);
        return {
          success: schema.db.users.findBy({ username }).password === password,
        };
      });

      this.post("/api/auth/sign-up", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);
        console.log(username);
        if (schema.db.users.findBy({ username })) {
          return new Response(400, {}, { error: "Username already exists" });
        } else {
          schema.db.users.insert({
            username,
            password,
          });
        }
      });

      this.get("api/todos", (schema) => {
        return schema.db.todos;
      });

      this.post("/api/todos/create", (schema, request) => {
        let { text } = JSON.parse(request.requestBody);
        let id = server.db.todos.length;
        schema.db.todos.insert({
          id,
          text,
          completed: false,
        });
        return {
          success: true,
          todo: schema.db.todos.at(id),
        };
      });

      this.put("api/todos/update", (schema, request) => {
        let { id, text, completed } = JSON.parse(request.requestBody);
        console.log(completed);
        schema.db.todos.update(id, { text, completed });
        console.log(server.db.todos);
        return schema.db.todos.findBy({ id });
      });

      this.del("api/todos/remove/:id", (schema, request) => {
        let id = request.params.id;
        schema.db.todos.remove(id);
        return { success: true };
      });

      this.passthrough();
    },
    seeds(server) {
      const dbData = localStorage.getItem("db");

      if (dbData) {
        server.db.loadData(JSON.parse(dbData));
      } else {
        server.db.loadData({
          users: [{ username: "admin", password: "12345" }],
          todos: [
            {
              id: 0,
              text: "Make dinner",
              completed: true,
            },
            {
              id: 1,
              text: "Finish todo list side project",
              completed: false,
            },
            {
              id: 2,
              text: "Look up SASS doc",
              completed: false,
            },
          ],
        });
      }
    },
  });
  server.pretender.handledRequest = function (verb) {
    if (verb.toLowerCase() !== "get" && verb.toLowerCase() !== "head") {
      localStorage.setItem("db", JSON.stringify(server.db.dump()));
    }
  };
  return server;
};

export default createMirageServer;
