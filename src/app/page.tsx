import { EnhancedTimestampConverter } from "@/components/EnhancedTimestampConverter";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Examples } from "@/components/Examples";
import { FAQ } from "@/components/FAQ";
import { UnixTimestampGuide } from "@/components/UnixTimestampGuide";
import { ProgrammingExamples } from "@/components/ProgrammingExamples";
import { BatchConverter } from "@/components/BatchConverter";
import { CTASection } from "@/components/CTASection";
import { FeatureBanner } from "@/components/FeatureBanner";

export default function Home() {
  return (
    <>
      <FeatureBanner variant="batch" />
      <Hero />
      <EnhancedTimestampConverter />
      <CTASection />
      <UnixTimestampGuide />
      <ProgrammingExamples />
      <BatchConverter />
      <Features />
      <Examples />
      <FAQ />
    </>
  );
}
