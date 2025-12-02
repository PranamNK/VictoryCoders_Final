import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-temple.jpg";
import { useLanguage } from "@/context/LanguageContext";

const Hero = () => {
  const { language } = useLanguage();
  
  const scrollToTemples = () => {
    const templesSection = document.getElementById("temples");
    templesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Strong Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Mangalore Temple"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Main Headline - Clean and Bold */}
          <div className="space-y-6">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
              {language === 'kn' ? (
                <>ತುಳುನಾಡಿನ<br/><span className="text-accent">ದೇವಾಲಯಗಳು</span></>
              ) : (
                <>Temples of<br/><span className="text-accent">Coastal Karnataka</span></>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
              {language === 'kn' 
                ? 'ಮಂಗಳೂರು ಮತ್ತು ಉಡುಪಿ ಪ್ರದೇಶದ ಪವಿತ್ರ ಪರಂಪರೆ'
                : 'Sacred heritage of Mangalore and Udupi region'}
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-6">
            <Button
              onClick={scrollToTemples}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 text-lg font-semibold rounded-md group shadow-2xl"
            >
              {language === 'kn' ? 'ಪ್ರಾರಂಭಿಸಿ' : 'Explore'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
