import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { temples } from "@/data/temples";
import { templeDescriptions } from "@/data/translations/templeDescriptions";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TempleReviews from "@/components/TempleReviews";
import FavoriteButton from "@/components/FavoriteButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  Calendar,
  Share2,
  Navigation,
} from "lucide-react";
import templeImage1 from "@/assets/temple-card-1.jpg";
import templeImage2 from "@/assets/temple-card-2.jpg";
import { toast } from "sonner";

const TempleDetail = () => {
  const { id } = useParams();
  const temple = temples.find((t) => t.id === id);
  const { language, translate } = useLanguage();

  // Memoize the full story to prevent recalculation on every render
  const fullStory = useMemo(() => {
    if (!temple) return '';

    // Map temple ID to description key
    const baseId = temple.id.replace('-temple', '').replace('-shri-', '').replace('shri-', '');
    const firstWord = baseId.split('-')[0];
    const descriptionKey = `temple.${firstWord}`;
    const fullStoryKey = `${descriptionKey}.full`;

    if (templeDescriptions[fullStoryKey]) {
      const story = templeDescriptions[fullStoryKey][language];
      if (story) return story;
    }

    return temple.description;
  }, [temple, language]);

  if (!temple) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Temple Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const templeIndex = temples.findIndex((t) => t.id === id);
  const displayImage = temple.image && temple.image !== '/placeholder.svg'
    ? temple.image
    : (templeIndex % 2 === 0 ? templeImage1 : templeImage2);

  const nearbyTemples = temples
    .filter((t) => t.region === temple.region && t.id !== temple.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: temple.name,
        text: temple.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDirections = () => {
    toast.info("Opening directions in Google Maps...");
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(
        temple.name + " " + temple.location
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[50vh] md:h-[60vh] mt-16 md:mt-20">
        <img
          src={displayImage}
          alt={temple.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link to="/">
              <Button
                variant="ghost"
                className="mb-4 text-white hover:text-white hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Temples
              </Button>
            </Link>

            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-primary text-primary-foreground border-0">
                  {temple.region}
                </Badge>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Sparkles className="h-3 w-3 text-accent" />
                  <span className="text-white text-sm font-medium">
                    {temple.deity}
                  </span>
                </div>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                {temple.name}
              </h1>

              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{temple.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={handleDirections}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <FavoriteButton
                templeId={temple.id}
                variant="outline"
                size="default"
                className="gap-2"
              />
            </div>

            {/* Description */}
            <Card className="border-border temple-shadow bg-card">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    About This Temple
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                    {fullStory}
                  </p>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Key Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Primary Deity
                      </p>
                      <p className="text-foreground font-medium">{translate(temple.deity)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Region
                      </p>
                      <p className="text-foreground font-medium">{translate(temple.region)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Location
                      </p>
                      <p className="text-foreground font-medium">
                        {translate(temple.location)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Festival Calendar Placeholder */}
            <Card className="border-border temple-shadow bg-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Festival Calendar
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  Festival information and special poojas for {temple.name} will be
                  updated soon. Visit the temple or contact local authorities for
                  current schedules.
                </p>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <TempleReviews templeId={temple.id} />

            {/* Nearby Temples */}
            {nearbyTemples.length > 0 && (
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Nearby Temples in {temple.region}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {nearbyTemples.map((nearbyTemple) => (
                    <Link key={nearbyTemple.id} to={`/temple/${nearbyTemple.id}`}>
                      <Card className="group hover-lift temple-shadow hover-glow bg-card h-full">
                        <CardContent className="p-4 space-y-2">
                          <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {nearbyTemple.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {nearbyTemple.location}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {nearbyTemple.shortDescription}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TempleDetail;
