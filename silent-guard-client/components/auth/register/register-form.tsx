"use client";

//General Imports
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

//------ShadcnUi Imports---------
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

//-----My Components Imports------
import AuthCard from "@/components/auth/auth-card";
import { handleRegister } from "@/server/actions/handle-register";
import { FormError, FormSuccess } from "@/components/auth/form-messages";


//------Importing Schema---------
import { RegisterSchema } from "@/schemas/register-schema"
import type { RegisterSchemaType } from "@/schemas/register-schema"

export const RegisterForm = () => {

  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | undefined>(undefined);


  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      ITnumber: "",
      password: "",
      confirmPassword: "",
    },
  });

const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
     const res = await handleRegister(values);
     const data = res?.data

 
     if (data?.success){
       setSuccess(true)
     }else{
       setSuccess(false);
       setMessage(data?.error);
     }
     return;
 
  };

  return (
    <div className="max-w-6xl mx-auto">
        <AuthCard
            cardTitle="Join Our Squad!"
            backButtonHref="/auth/login"
            backButtonLabel="Return to Login"
            >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col gap-2">
                <div>
                    <FormField
                        control={form.control}
                        name="ITnumber"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>IT Identifier</FormLabel>
                            <FormControl>
                            <Input
                                placeholder="8283474838"
                                type="text"
                                {...field}
                            />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    
                    <div>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>FullName</FormLabel>
                            <FormControl>
                            <Input
                                placeholder="yourName"
                                type="text"
                                autoComplete="name"
                                {...field}
                            />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input
                                placeholder="your-example@gmail.com"
                                type="email"
                                autoComplete="email"
                                {...field}
                            />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <div>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                            <Input
                                placeholder="***********"
                                type="password"
                                autoComplete="current-password"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <div>
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                            <Input
                                placeholder="***********"
                                type="password"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormSuccess message={success ? "✅ Your account has been created successfully.": ""} />
                    <FormError message={success === false ? ("❌" + message)  : ""} />
                    </div>
                </div>
                <Button type="submit" className="w-full">
                    Signup
                </Button>
                </form>
            </Form>
        </AuthCard>
    </div>
    
  );
};
