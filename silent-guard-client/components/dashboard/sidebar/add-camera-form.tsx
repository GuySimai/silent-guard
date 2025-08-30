'use client'

//Shadcn UI Imports
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { addCamera } from "@/server/actions/addCamera";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function AddCameraForm({categoryID}: {categoryID: string}) {

  console.log('yo im here')

  const router = useRouter();

  //Success State
  const [success, setSuccess] = useState<boolean | null>(null);

  const form = useForm<CameraSchemaType>({
          resolver: zodResolver(CameraSchema),
          defaultValues: {
            admin: "",
            password: "",
            url: "",
            name: "",
            categoryID: null,
          },
        });

    const handleCameraSubmit = async (values: CameraSchemaType) => {
        console.log('bla')
        values.categoryID = categoryID;
        const result = await addCamera(values);

        const data = result?.data?.success;

        console.log(result);

        if (data){
          setSuccess(true)
          return;
        }

      setSuccess(false);

      router.refresh();
        
    }


    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCameraSubmit)} className="space-y-8">
        <div>
            <FormField 
                control={form.control}
                name="admin"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-4">
                        <FormLabel>admin </FormLabel>
                            <FormControl>
                                <Input
                                className="col-span-3"
                                placeholder="Admin Username..."
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
              name="password"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input  className="col-span-3"
                      placeholder="***********"
                      type="password"
                      autoComplete="current-password"
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
                name="url"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-4">
                        <FormLabel>URL </FormLabel>
                            <FormControl>
                                <Input
                                className="col-span-3"
                                placeholder="Camera HTTP URL..."
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
                name="name"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-4">
                        <FormLabel>Name </FormLabel>
                            <FormControl>
                                <Input
                                className="col-span-3"
                                placeholder="Camera Name..."
                                type="text"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage className="col-span-4"/>
                    </FormItem>
                )}
                />
            </div>
            <Button variant={"default"} type="submit" className="w-full cursor-pointer"> Add Camera</Button> 
            <FormSuccess message={success ? "Camera added successfuly!" : ""} />
            <FormError message={success === false ? "Error adding camera" : ""}/>
        </form>
    </Form>
      )
  }