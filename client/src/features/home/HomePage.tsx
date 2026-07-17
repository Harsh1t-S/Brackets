import Hero from "./components/Hero";
import SearchSection from "./components/SearchSection";
import Stats from "./components/Stats";
import FeaturedProblems from "./components/FeaturedProblems";
import Topics from "./components/Topics";
import Companies from "./components/Companies";
import CTA from "./components/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SearchSection />
      <Stats />
      <FeaturedProblems />
      <Topics />
      <Companies />
      <CTA />
    </>
  );
}