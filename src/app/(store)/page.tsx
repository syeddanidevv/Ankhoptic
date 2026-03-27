// ─── Store Components ───────────────────────────────────────────────────────
import HeroSlider from "@/components/store/HeroSlider";
import CategorySlider from "@/components/store/CategorySlider";
import IconBox from "@/components/store/IconBox";
import Testimonial from "@/components/store/Testimonial";
import TopTrending from "@/components/store/TopTrending";
import BrandLogos from "@/components/store/BrandLogos";
import HomeNewsletter from "@/components/store/HomeNewsletter";
import HomeLocation from "@/components/store/HomeLocation";

// New components add karo: import YourComponent from "@/components/store/YourComponent";

export default function HomePage() {
  return (
    <div id="wrapper">
      {/* ── Top announcement scrolling bar ── */}

      {/* ── Hero banner slider ── */}
      <HeroSlider />

      {/* ── Icon box ── */}
      <IconBox />

      {/* ── Category horizontal slider ── */}
      <CategorySlider />

      <TopTrending />

      {/* ── Brand logos bar ── */}
      <BrandLogos />
      <HomeNewsletter />

      <Testimonial />
      <HomeLocation />
      {/*
        ─────────────────────────────────────────────────────────
        Yahan apne baqi components add karte jao, masalan:

        <BannerCollection />
        <BestSeller />
        <ShopCollection />
        <Testimonial />
        <IconBox />
        <BrandBar />
        <Footer />
        ─────────────────────────────────────────────────────────
      */}
    </div>
  );
}
