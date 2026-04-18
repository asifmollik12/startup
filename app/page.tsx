import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import TopFounders from "@/components/sections/TopFounders";
import StartupSpotlight from "@/components/sections/StartupSpotlight";
import BestIdea from "@/components/sections/BestIdea";
import LatestArticles from "@/components/sections/LatestArticles";
import InlineAdBanner from "@/components/sections/InlineAdBanner";
import AdBanner from "@/components/sections/AdBanner";

export const revalidate = 30;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AdBanner variant="leaderboard" placement="Homepage Hero" />
      <StatsBar />
      <TopFounders />
      <StartupSpotlight />
      <InlineAdBanner label="Sponsored" />
      <BestIdea />
      <LatestArticles />
    </>
  );
}
