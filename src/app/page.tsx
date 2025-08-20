import { TimestampConverter } from "@/components/TimestampConverter";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Examples } from "@/components/Examples";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <TimestampConverter />
      <Features />
      <Examples />
      <FAQ />
    </>
  );
}
