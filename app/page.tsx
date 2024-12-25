"use client"
import GenerateKey from "@/components/key/GenerateKey";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
   <div>
    <Button onClick={() => {console.log("hello")}}>oy</Button>
    <GenerateKey />
   </div>
  );
}
