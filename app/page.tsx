import LandingHero from "@/components/landing/landing-hero";
import LandingAbout from "@/components/landing/landing-about";
import LandingSkills from "@/components/landing/landing-skills";
import LandingExperience from "@/components/landing/landing-experience";
import LandingEducation from "@/components/landing/landing-education";
import LandingProjects from "@/components/landing/landing-projects";
import LandingContact from "@/components/landing/landing-contact";

export default function IndexPage() {
  /* -------------------------------- Render UI ------------------------------- */
  return (
    <main>
      {/* Section 1: Hero */}
      <LandingHero />

      {/* Section 2: About */}
      <LandingAbout />

      {/* Section 3: Skills */}
      <LandingSkills />

      {/* Section 4: Experience */}
      <LandingExperience />

      {/* Section 5: Education */}
      <LandingEducation />

      {/* Section 6: Projects */}
      <LandingProjects />

      {/* Section 7: Contact */}
      <LandingContact />
    </main>
  );
}
