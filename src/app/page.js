'use client'


import ExpenseTrackerLanding from "../component/landingPage/ExpenseTrackerLanding.jsx";
import {Button, HeroUIProvider} from "@heroui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
export default function Home() {

  const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include", // send cookies
          });
  
          if (res.ok) {
            const data = await res.json();
            router.replace("/")
           

          }
         
         
        } catch (err) {
          
        }
      };
  
      checkAuth();
    }, [router]);
  
  
  return (
    <div className="  min-h-screen ">
     <HeroUIProvider>
  
      <ExpenseTrackerLanding/>
    </HeroUIProvider>
    </div>
  );
}
