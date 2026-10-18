import BigDay from "@/components/BigDay";
import Footer from "@/components/Footer";
import GiftList from "@/components/GiftList";
import HeroAquarela from "@/components/experiencia/HeroAquarela";
import LocationSection from "@/components/LocationSection";
import Navbar from "@/components/Navbar";
import OurStory from "@/components/OurStory";
import RsvpForm from "@/components/RsvpForm";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroAquarela />
        <OurStory />
        <BigDay />
        <LocationSection />
        <GiftList />
        <RsvpForm />
      </main>
      <Footer />
    </>
  );
}
