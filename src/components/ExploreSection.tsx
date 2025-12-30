import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { temples } from "@/data/temples";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const ExploreSection = () => {
  const { language } = useLanguage();
  const [revealedTemple, setRevealedTemple] = useState<typeof temples[0] | null>(null);

  const revealRandomTemple = () => {
    const randomIndex = Math.floor(Math.random() * temples.length);
    setRevealedTemple(temples[randomIndex]);
  };

  return (
    <section id="explore" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {language === 'kn' ? 'ದೇವಾಲಯ ಅನ್ವೇಷಣೆ' : 'Random Discovery'}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              {language === 'kn' 
                ? 'ಯಾದೃಚ್ಛಿಕ ದೇವಾಲಯವನ್ನು ಅನ್ವೇಷಿಸಿ'
                : 'Explore a randomly selected temple from our collection'}
            </p>
            <Button
              onClick={revealRandomTemple}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg font-semibold rounded-md shadow-lg"
            >
              {language === 'kn' ? 'ಅನ್ವೇಷಿಸಿ' : 'Discover'}
            </Button>
          </div>

          {revealedTemple && (
            <Card className="border-border shadow-lg bg-card">
              <CardContent className="p-10">
                <div className="space-y-5">
                  <h3 className="font-serif text-3xl font-bold text-foreground">
                    {revealedTemple.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground border-l-4 border-primary pl-4">
                    <span>{revealedTemple.location}</span>
                    <span>•</span>
                    <span>{revealedTemple.deity}</span>
                  </div>

                  <p className="text-foreground/90 leading-relaxed text-lg">
                    {revealedTemple.description}
                  </p>

                  <Link to={`/temple/${revealedTemple.id}`}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {language === 'kn' ? 'ಸಂಪೂರ್ಣ ವಿವರಗಳು' : 'View Details'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
