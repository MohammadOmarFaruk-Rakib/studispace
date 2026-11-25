import Hero from "@/components/Hero";
import HostGuarantee from "@/components/HostGuarantee";
import HowItworks from "@/components/HowItworks";
import HowBookingWorks from "@/components/HowItworks";
import Navbar from "@/components/Navbar";
import Studios from "@/components/Studio";
import Studiocategory from "@/components/Studiocategory";

const sections = [
  {
    title: "Create Something Extraordinary",
    subtitle: "Find the perfect creative space for your next big idea.",
    bg: "bg-slate-50",
  },
  {
    title: "Discover Creative Spaces",
    subtitle: "Explore inspiring studios and production environments.",
    bg: "bg-white",
  },
  {
    title: "Bring Your Ideas to Life",
    subtitle: "Connect with spaces, creators, and professionals.",
    bg: "bg-indigo-50",
  },
  {
    title: "Your Next Project Starts Here",
    subtitle: "Book your ideal workspace and start creating.",
    bg: "bg-slate-50",
  },
];

export default function page() {
 const images = [
  {
    src: "/Img_One.png",
    alt: "Professional photography studio with softbox lighting",
    eyebrow: "Photo & Video Studios",
    title: "Shoot Where Light Meets Vision",
    subtitle: "Book fully equipped studios by the hour. Lighting, backdrops and gear are ready when you are.",
  },
  {
    src: "/Img_two.jpg",
    alt: "Cyclorama backdrop in a creative studio space",
    eyebrow: "Creative Spaces",
    title: "Your Next Masterpiece Starts Here",
    subtitle: "Seamless backdrops, grip equipment and lighting kits, all in one place across the city.",
  },
  {
    src: "/Img_three.jpg",
    alt: "Empty studio floor with dramatic lighting",
    eyebrow: "For Studio Owners",
    title: "Turn Your Space Into Income",
    subtitle: "List your studio, set your own rates and reach creators looking for their next set.",
  },
];
  return (
    <main>
      {/* <Navbar/> */}
      <Hero images={images} />

      <Studiocategory />
      <Studios />
      <HowItworks/>
      <HostGuarantee/>


    </main>
  );
}
