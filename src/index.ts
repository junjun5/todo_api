import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ErrorSchema, TaskParamSchema, TaskSchema } from "./schema";
import { swaggerUI } from "@hono/swagger-ui";

const taskReadRoute = createRoute({
	method: "get",
	path: "/read",
	request: {},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: TaskSchema,
				},
			},
			description: "Retrieve the task lists",
		},
	},
});
const taskCreateRoute = createRoute({
	method: "post",
	path: "/create",
	request: {},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: TaskSchema,
				},
			},
			description: "Create a task, which is already attached to user",
		},
		400: {
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
			description: "Bad Request",
		},
	},
});
const taskUpdateRoute = createRoute({
	method: "post",
	path: "/update/{taskId}",
	request: {
		params: TaskParamSchema,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: TaskSchema,
				},
			},
			description: "Create a task, which is already attached to user",
		},
		400: {
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
			description: "Bad Request",
		},
	},
});

const app = new OpenAPIHono();
// const app = new Hono()
app.openapi(taskReadRoute, (c) => {
	return c.json({ tasks: taskLists }, 200);
});
app.openapi(taskCreateRoute, async (c) => {
	const { title, deadline } = await c.req.json<{
		title: string;
		deadline: string;
	}>();
	const tasksMaxNum = taskLists.length;
	const now = new Date();
	const newTask: Task = {
		id: uuidv4(),
		title: title,
		timestamp: new Date(),
		deadline: new Date(deadline),
	};
	taskLists.push(newTask);
	console.log(title, deadline);
	return c.json(taskLists);
});
app.openapi(taskUpdateRoute, async (c) => {
	const id = c.req.param("taskId");
	console.log(id);
	const index = taskLists.findIndex((p) => p.id === id);
	if (index === -1) {
		console.log("bad request");
		return c.json({ message: "Post not found" }, 400);
	}
	const { title, deadline } = await c.req.json<{
		title: string;
		deadline: Date;
	}>();
	taskLists[index] = { ...taskLists[index], title, deadline };
	return c.json("Completed");
});

// The OpenAPI documentation will be available at /doc
app.doc31("/doc", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Task API",
	},
});
app.get("/ui", swaggerUI({ url: "/doc" }));

interface Task {
	id: string;
	title: string;
	timestamp: Date;
	deadline: Date;
}

const taskLists: Task[] = [
	{
		id: uuidv4(),
		title: "企画書作成",
		timestamp: new Date(2025, 4, 18),
		deadline: new Date(2025, 9, 20),
	},
	{
		id: uuidv4(),
		title: "チーム会議",
		timestamp: new Date(2025, 4, 18),
		deadline: new Date(2025, 9, 20),
	},
	{
		id: uuidv4(),
		title: "顧客へのメール送信",
		timestamp: new Date(2025, 4, 18),
		deadline: new Date(2025, 9, 20),
	},
];

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/delete", (c) => {
	return c.text("Hello Hono!");
});

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
