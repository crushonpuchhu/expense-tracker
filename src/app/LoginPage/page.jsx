"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  addToast,
} from "@heroui/react";
import Loading from "../../component/LodingUi/Loding.jsx";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // send cookies
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            // Redirect based on role
            if (data.user.role === "admin") router.replace("/Admin");
            else router.replace("/Dashboard");
          }
        }
       
      } catch (err) {
        
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async () => {
    if (!email || !password) {
      return addToast({
        title: "Error",
        description: "All fields are required",
        color: "danger",
      });
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return addToast({
          title: "Error",
          description: data.message || "Login failed",
          color: "danger",
        });
      }

      const user = data.user || { name: "User", role: "user" };

      addToast({
        title: "Login Successful",
        description: `Welcome , ${user.name}!`,
        color: "success",
      });
      
      if (user.role === "admin") router.push("/Admin");
      else router.push("/Dashboard");

    
      
    } catch (err) {
      setLoading(false);
      console.error(err);
      addToast({
        title: "Error",
        description: "Something went wrong, please try again",
        color: "danger",
      });
    }
  };


  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-200 px-4">
      {loading && <Loading />}
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-2xl bg-white">
        <CardHeader className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Please login to continue</p>
        </CardHeader>
        <CardBody>
          <section className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              radius="lg"
              variant="bordered"
              isClearable
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              radius="lg"
              variant="bordered"
              required
            />
            <div className="flex justify-between items-center text-sm">
              <a href="/ForgotResetPassword" className="text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold"
              radius="lg"
              onPress={handleSubmit}
            >
              Log In
            </Button>
          </section>
          <div className="flex items-center my-6">
            <Divider className="flex-1" />
            <span className="px-2 text-gray-400 text-sm">or</span>
            <Divider className="flex-1" />
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a href="/CreateAccount" className="text-indigo-600 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
