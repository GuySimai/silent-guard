'use client'

//Shadcn UI Imports
import { Input } from "@/components/ui/input"
import { CameraSchema, CameraSchemaType } from "@/schemas/camera-schema";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Button } from "@/components/ui/button"

//My imports
import { FormError, FormSuccess } from "@/components/auth/form-messages";



//General Imports
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { EditCategorySchema, TypeEditCategorySchema } from "@/schemas/edit-category-schema";
import { handleEditCategory } from "@/server/actions/handle-edit-category";
import { useRouter } from "next/navigation";


export default function EditCategoryForm({categoryID}: {categoryID: string}) {

  const router = useRouter();
  const form = useForm<TypeEditCategorySchema>({
          resolver: zodResolver(EditCategorySchema),
          defaultValues: {
            name: "",
          },
        });

    const handleEditCategorySubmit = async (values: TypeEditCategorySchema) => {
        const res = await handleEditCategory(values.name, categoryID);

        if(res?.error) {
            console.error("Error updating category:", res.error);
            return;
        }
        
        console.log(values)
        console.log(categoryID)
        // If the update is successful, you can redirect or show a success message
        router.refresh();
        
    }


    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEditCategorySubmit)} className="space-y-4">
        <div>
            <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-4">
                        <FormLabel>Name </FormLabel>
                            <FormControl>
                                <Input
                                className="col-span-3"
                                placeholder="Category new name..."
                                type="text"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage className="col-span-4"/>
                    </FormItem>
                )}
                />
            </div>
            <Button variant={"default"} type="submit" className="w-full cursor-pointer">Save changes</Button> 
            {/* <FormSuccess message={success ? "Category added successfuly!" : ""} />
            <FormError message={success === false ? errorMessage : ""}/> */}
        </form>
    </Form>
      )
  }