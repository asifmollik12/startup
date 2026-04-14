import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import TopFounders from "@/components/sections/TopFounders";
import StartupSpotlight from "@/components/sections/StartupSpotlight";
import BestIdea from "@/components/sections/BestIdea";
import LatestArticles from "@/components/sections/LatestArticles";
import InlineAdBanner from "@/components/sections/InlineAdBanner";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <TopFounders />
      <StartupSpotlight />
      <InlineAdBanner label="Sponsored" />
      <BestIdea />
      <LatestArticles />
    </>
  );
}
