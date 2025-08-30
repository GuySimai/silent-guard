'use client'

//General Imports
import { useForm } from "react-hook-form"
import { z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";


//------ShadcnUi Imports---------
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
import { Button } from "@/components/ui/button";

//-----My Components Imports------
import AuthCard from "../auth-card";
import { FormError, FormSuccess } from "@/components/auth/form-messages";

//------Importing Schema---------
import { LoginSchema } from "@/schemas/login-schema";
import type {LoginSchemaType } from "@/schemas/login-schema";
import { handleLogin } from "@/server/actions/handle-login";
import Link from "next/link";

export default function LoginForm(){
  //Success State
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  //Intializing a new react-hook-form instance.
  //Using LoginSchema to validate the form
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values:LoginSchemaType) =>{
    setLoading(true);

    //Logic for handling the login form submission
    const res = await handleLogin(values);
    const data = res?.data?.success;

    console.log(res);

    if (data){
      setSuccess(true)
      return;
    }

    setSuccess(false);
    setLoading(false);
  }



  return (
    <AuthCard
    cardTitle="Welcome Back!"
    backButtonHref="/"
    backButtonLabel="Return to Homepage"
  >
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@gmail.com"
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
            <FormSuccess message={success ? "Logged in successfully!" : ""} />
            <FormError
              message={success === false ? "Invalid credentials!" : ""}
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Button variant={"outline"} asChild className="w-full">
          <Link href="/auth/register">Create an account</Link>
        </Button>
      </form>
    </Form>
  </AuthCard>
  )

}