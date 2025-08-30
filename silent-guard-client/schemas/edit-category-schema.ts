import {z} from 'zod'

export const EditCategorySchema = z.object({
    name: z.string().min(2, {message: "Name must be at least 2 characters long"}),
  });

export type TypeEditCategorySchema = z.infer<typeof EditCategorySchema>