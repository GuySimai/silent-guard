'use client'

//General Imports
import { useForm } from "react-hook-form"
import { z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//Shadcn imports
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Button } from "@/components/ui/button"

  import {
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
    } from "@/components/ui/form";

//Lucide Imports
import { Plus } from "lucide-react";

//React Imports
import { useState } from "react";
import { handleAddCategory } from "@/server/actions/handle-add-category"
import { CategorySchema, CategorySchemaType } from "@/schemas/category-schema";

//Temporary colors
const presetColors = [
    "#EF4444", // red-500
    "#F59E0B", // amber-500
    "#10B981", // green-500
    "#3B82F6", // blue-500
  ];

//My imports
import { FormError, FormSuccess } from "@/components/auth/form-messages";

  
export default function AddCategoryButton(){

    const form = useForm<CategorySchemaType>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
         name: "",
          color: presetColors[0],
        },
      });

     //States
    const [selectedColor,setSelectedColor] = useState<string>(presetColors[0])
    const [success, setSuccess] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const handleCategorySubmit = async (values:CategorySchemaType) => { 
        

        const res = await handleAddCategory(values);

        if( res.success){
            setSuccess(true)
        }
        else{
            setSuccess(false);
            setErrorMessage(res?.error || "");
        }
          
        
    }

    return (
        <Dialog>
             <DialogTrigger asChild>
                <Button variant={"outline"} className=" w-10 h-8 border-dashed border-gray-600 border-1 bg-transparent cursor-pointer" asChild>
                        <Plus/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>
                    To add category please fill the form below.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCategorySubmit)} className="space-y-8">
                    <div>
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4">
                                    <FormLabel>name </FormLabel>
                                        <FormControl>
                                            <Input
                                            className="col-span-3"
                                            placeholder="Category Name.."
                                            type="text"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4"/>
                                </FormItem>
                            )}
                            />
                        </div>
                        <div>
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4">
                                    <FormLabel>color </FormLabel>
                                        <FormControl>
                                            <div className="col-span-3 space-x-3">
                                                {/* Color picker */}
                                             {presetColors.map((color)=>(
                                                            <Button
                                                        key={color}
                                                        className={`w-10 h-10 rounded-full border-2
                                                            opacity-60 cursor-pointer transition ${selectedColor === color ? 'border-black scale-110' : 'border-transparent'}`}
                                                        style={{ backgroundColor: color }}
                                                        onClick={(e) =>{
                                                            e.preventDefault();
                                                            setSelectedColor(color);
                                                            field.onChange(color);
                                                        } }
                                                />
                                                 ))}
                                            </div>      
                                        </FormControl>
                                </FormItem>
                            )}
                            />
                        </div>
                        <Button variant={"default"} type="submit" className="w-full cursor-pointer">Save changes</Button> 
                        <FormSuccess message={success ? "Category added successfuly!" : ""} />
                        <FormError message={success === false ? errorMessage : ""}/>
                    </form>
                </Form>
                
            </DialogContent>
            </Dialog>
    )
}


