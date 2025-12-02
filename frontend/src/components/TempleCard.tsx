import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles, Languages } from "lucide-react";
import type { Temple } from "@/data/temples";
import { useLanguage } from "@/context/LanguageContext";
import templeImage1 from "@/assets/temple-card-1.jpg";
import templeImage2 from "@/assets/temple-card-2.jpg";

interface TempleCardProps {
  temple: Temple;
  index: number;
}

const TempleCard = ({ temple, index }: TempleCardProps) => {
  const { translate, language } = useLanguage();
  // Use temple image if available, otherwise alternate between two local images
  const displayImage = temple.image && temple.image !== '/placeholder.svg'
    ? temple.image
    : (index % 2 === 0 ? templeImage1 : templeImage2);

  return (
    <Card className="group overflow-hidden border-border hover-lift temple-shadow bg-card">
      <div className="relative h-56 overflow-hidden">
        <img
          src={displayImage}
          alt={temple.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Region Badge */}
        <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground border-0">
          {translate(temple.region)}
        </Badge>

        {/* Deity Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <Sparkles className="h-3 w-3 text-accent" />
          <span className="text-white text-xs font-medium">{translate(temple.deity)}</span>
        </div>
      </div>

      <CardContent className="p-5 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {translate(temple.name)}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-primary hover:text-primary hover:bg-primary/10 p-1 h-auto"
              onClick={(e) => {
                e.preventDefault();
                const nextLanguage = language === 'en' ? 'kn' : 'en';
                localStorage.setItem('language', nextLanguage);
                window.location.reload();
              }}
            >
              <Languages className="h-4 w-4" />
              <span className="text-xs font-medium">
                {language === 'en' ? 'ಕನ್ನಡ' : 'ಇಂಗ್ಲಿಷ್'}
              </span>
            </Button>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5" />
            <span>{translate(temple.location)}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
          {translate(`temple.${temple.id}.full`)}
        </p>

        <div>
          <Link to={`/temple/${temple.id}`} className="w-full">
            <Button
              variant="default"
              className="w-full bg-primary/90 hover:bg-primary text-primary-foreground font-medium"
            >
              {translate("View Details")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TempleCard;
