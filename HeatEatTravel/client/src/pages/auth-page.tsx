import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Train, Utensils, MapPin, Clock } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  };

  const onRegister = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Train className="h-8 w-8 mr-2" style={{ color: '#B91C1C' }} />
              <CardTitle className="text-2xl font-bold" style={{ color: '#B91C1C' }}>
                Heat<span style={{ color: '#EA580C' }}>&</span>Eat
              </CardTitle>
            </div>
            <p className="text-gray-600">Welcome to Sri Lanka's premier train food delivery service</p>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="login-username">Username or Email</Label>
                    <Input
                      id="login-username"
                      {...loginForm.register("username")}
                      placeholder="Enter your username or email"
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-red-600 mt-1">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      {...loginForm.register("password")}
                      placeholder="Enter your password"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white hover:opacity-90"
                    style={{ backgroundColor: '#B91C1C' }}
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div>
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      {...registerForm.register("username")}
                      placeholder="Choose a username"
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      {...registerForm.register("email")}
                      placeholder="Enter your email"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="register-phone">Phone (Optional)</Label>
                    <Input
                      id="register-phone"
                      {...registerForm.register("phone")}
                      placeholder="+94 77 123 4567"
                    />
                    {registerForm.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      {...registerForm.register("password")}
                      placeholder="Create a password"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      {...registerForm.register("confirmPassword")}
                      placeholder="Confirm your password"
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white hover:opacity-90"
                    style={{ backgroundColor: '#B91C1C' }}
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Hero Section */}
      <div 
        className="flex-1 text-white p-8 flex items-center justify-center"
        style={{
          background: 'linear-gradient(to bottom right, #1E40AF, #059669)'
        }}
      >
        <div className="max-w-lg text-center">
          <h2 className="text-4xl font-bold mb-6">
            Delicious Meals<br />
            <span style={{ color: '#EAB308' }}>On Your Journey</span>
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experience authentic Sri Lankan cuisine while traveling from Colombo Fort to Badulla. 
            Fresh, hot meals delivered right to your train seat.
          </p>
          
          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <Utensils className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#EA580C' }} />
              <div>
                <h3 className="font-semibold mb-1">Fresh Cuisine</h3>
                <p className="text-sm opacity-75">Authentic Sri Lankan dishes prepared fresh</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Train className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#EA580C' }} />
              <div>
                <h3 className="font-semibold mb-1">Train Delivery</h3>
                <p className="text-sm opacity-75">Direct delivery to your train seat</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#EA580C' }} />
              <div>
                <h3 className="font-semibold mb-1">73 Stations</h3>
                <p className="text-sm opacity-75">Service across all major stations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#EA580C' }} />
              <div>
                <h3 className="font-semibold mb-1">24/7 Service</h3>
                <p className="text-sm opacity-75">Order anytime, anywhere on the route</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
