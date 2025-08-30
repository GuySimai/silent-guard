import {z} from 'zod'

export const CameraSchema = z.object({
    admin: z.string().min(2, {message: "Name must be at least 2 characters long"}),
    password: z.string().min(3, {message: "Color must be at least 3 characters long"}),
    categoryID: z.string().nullable(),
    name: z.string().min(2, {message: "Name must be at least 2 characters long"}),
    url: z.string()
    .url({ message: "Must be a valid URL" })
    .min(10, { message: "URL is too short" }), // optional length check
  });

export type CameraSchemaType = z.infer<typeof CameraSchema>