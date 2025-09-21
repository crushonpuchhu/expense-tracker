'use client'


import {Button, HeroUIProvider} from "@heroui/react";

import Link from "next/link";
export default function Home() {
  return (
    <div className="  min-h-screen ">
     <HeroUIProvider>
  
      <main className=" bg-gradient-to-br from-white via-blue-50 to-blue-200 gap-2 flex justify-center items-center flex-col  min-h-screen ">
        {/* start here */}
        
        <h1 onClick={()=>{addToast({
              title: "profile Created",
              description: "hello",
              color: 'success',
            })
}} className=" max-sm:text-3xl font-bold text-5xl ">Expense <span className=" font-light">Tracker</span></h1>
        <p>Track your Income and expenses easily</p>
         <section className=" p-5 gap-2 flex "> <Link href='/CreateAccount'><Button  color="primary">SignUp</Button></Link> <Link href={'/LoginPage'}><Button>LogIn</Button></Link></section>
         
      </main>
    </HeroUIProvider>
    </div>
  );
}
