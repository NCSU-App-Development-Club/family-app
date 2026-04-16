## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create environment variables (described below)

3. Initialize the database with the following command (make sure to run in the backend project):

   ```bash
   npx drizzle-kit push
   ```

4. Start the backend

   ```bash
   npm run dev
   ```

## Environment variables

Create a `.env` in the root of the backend project with the following variables:

- `BETTER_AUTH_SECRET` - set to the output of `openssl rand -base64 32`
- `BETTER_AUTH_URL="http://localhost:3000`
- `DB_FILE_NAME="file:dev.db"` - tells Drizzle to use a local file called dev.db for the database

## Adding an API route

1. Define a schema in `types/src/index.ts`:

   ```ts
   // Example of a schema for a request to get info about a family group

   // When the client wants to get info about a group, what is it sending to the server?
   // A request schema is only required if you want your request to send additional information not included in the URL - this is just shown as an example
   export const GetGroupRequestSchema = z.object({
     id: z.number(),
   });

   // What is the server sending back?
   export const GetGroupResponseSchema = z.object({
     name: z.string(),
     users: z.array(z.number()),
   });
   ```

   See [Zod docs](https://zod.dev/api) for more information.

2. Define the API route in `backend/src/index.ts`:

   ```ts
   import { GetGroupRequestSchema, GetGroupResponse } from "@family-app/types";
   // ...
   app.get(
     "/api/group/:groupId",
     zValidator("json", GetGroupRequestSchema),
     (c) => {
       // put the backend code for the api route here

       return c.json({
         name: "sample name",
         users: [0, 1, 2],
       } satisfies GetGroupResponse);
     },
   );
   ```

   See [Hono docs](https://hono.dev/docs/api/request) for more information.

3. Call the API route from the client:

   ```ts
   import { GetGroupResponseSchema } from "@family-app/types";
   import { apiClient } from "@/lib/api-client";
   // ...
   const data = await apiClient("/api/group/0", {
     method: "GET",
     // body should conform to the GetGroupRequestSchema
     body: { id: 0 },
   });
   const response = GetGroupResponseSchema.parse(data);
   // response is a json object conforming to the GetGroupResponseSchema
   console.log(response.name);
   ```
