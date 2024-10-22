"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { signupSchema } from "@/lib/validation-schemas/signup-schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined, // Set default role to 'student'
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      setIsSubmitting(true);
      const response = await axios.post("api/user/new", values);
      console.log("Signup successful:", response.data);

      toast.success("Signup successful! Your account has been created.");

      // Redirect to the login page after a delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      // Change from 'any' to 'unknown'
      if (axios.isAxiosError(error)) {
        // Check if the error has a response
        if (error.response) {
          if (error.response.status === 409) {
            console.error("Email already in use:", error.response.data);
            // Show a user-friendly message
            toast.error(
              "An account already exists with this email. Please login instead."
            );
          } else {
            console.error("Signup failed:", error.response.data);
            // Handle other known errors
            toast.error(
              "An unexpected error occurred. Please try again later."
            );
          }
        } else {
          // Handle unexpected errors (e.g., network errors)
          console.error("An unexpected error occurred:", error.message);
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } else if (error instanceof Error) {
        // Handle other errors (general JavaScript errors)
        console.error("An unexpected error occurred:", error.message);
        toast.error("An unexpected error occurred. Please try again later.");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...signupForm}>
      <form onSubmit={signupForm.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl text-focus text-center">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="Max" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Robinson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={signupForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4 items-center"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="student" id="student" />
                          </FormControl>
                          <Label htmlFor="student">Student</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="teacher" id="teacher" />
                          </FormControl>
                          <Label htmlFor="teacher">Teacher</Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full flex gap-4 bg-rose-700 hover:bg-rose-700/90 dark:text-white"
              >
                {isSubmitting && <Loader2 className="animate-spin w-4" />}
                <span>Create an account</span>
              </Button>
              {/* <Button variant="outline" className="w-full">
                Sign up with GitHub
              </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
