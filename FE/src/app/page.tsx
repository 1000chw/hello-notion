import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import HeroSection from "@/components/HeroSection";
import WidgetGallery from "@/components/WidgetGallery";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
	return (
		<>
			<Navbar />
			<PageBackground>
				<main>
					<HeroSection />
					<WidgetGallery />
					<Features />
					<HowItWorks />
					<div className="hidden" aria-hidden>
						<Pricing />
					</div>
				</main>
			</PageBackground>
			<Footer />
		</>
	);
}
