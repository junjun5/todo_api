import { z } from "@hono/zod-openapi";

export const ErrorSchema = z.object({
	code: z.number().openapi({
		example: 400,
	}),
	message: z.string().openapi({
		example: "Bad Request",
	}),
});

export const TaskParamSchema = z.object({
	taskId: z.string().openapi({
		param: {
			name: "taskId",
			in: "path",
		},
		example: "44e02794-3779-4364-8438-45695153eb9b",
	}),
});

export const TaskSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		timestamp: z.date(),
		deadline: z.date(),
	})
	.openapi("task");
