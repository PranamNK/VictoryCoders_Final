import { useEffect, useRef, useState, useMemo } from "react";
import { Temple } from "@/data/temples";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { templeDescriptions } from "@/data/translations/templeDescriptions";

// Declare ResponsiveVoice for TypeScript
declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice: string, options: Record<string, unknown>) => void;
    };
  }
}
import {
  X,
  Volume2,
  Navigation,
  Bookmark,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Languages,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import templeImage1 from "@/assets/temple-card-1.jpg";
import templeImage2 from "@/assets/temple-card-2.jpg";

interface TempleDetailPanelProps {
  temple: Temple | null;
  onClose: () => void;
  nearbyTemples?: Temple[];
}

const TempleDetailPanel = ({ temple, onClose, nearbyTemples = [] }: TempleDetailPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const { translate, language, toggleLanguage } = useLanguage();

  // Memoize the full story to prevent recalculation on every render
  const fullStory = useMemo(() => {
    if (!temple) return '';

    // Map temple ID to description key
    let baseId = temple.id.replace('-temple', '').replace('-shri-', '').replace('shri-', '');
    const firstWord = baseId.split('-')[0];
    const descriptionKey = `temple.${firstWord}`;
    const fullStoryKey = `${descriptionKey}.full`;

    // Try to get the full story from templeDescriptions
    if (templeDescriptions[fullStoryKey]) {
      const story = templeDescriptions[fullStoryKey][language];
      if (story) return story;
    }

    // Fallback to the temple description if no full story is available
    return temple.description;
  }, [temple, language]);

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
  }, []);

  useEffect(() => {
    if (temple && panelRef.current) {
      // Focus trap
      const focusableElements = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (isSpeaking) {
        window.speechSynthesis?.cancel();
      }
    };
  }, [temple, onClose, isSpeaking]);

  if (!temple) return null;

  const images = [templeImage1, templeImage2];
  const currentImage = images[currentImageIndex];

  const handleTTS = async () => {
    if (!speechSupported) {
      toast.error(translate("Text-to-speech is not supported in your browser"));
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Get the text to speak in the current language
    const textToSpeak = language === 'kn'
      ? `${temple.name}. ${fullStory}. ಈ ದೇವಾಲಯವು ${temple.location} ನಲ್ಲಿ ನೆಲೆಸಿದೆ.`
      : `${temple.name}. ${fullStory}. This temple is located in ${temple.location}.`;

    setIsSpeaking(true);

    // Wait for voices to load
    const loadVoices = () => {
      return new Promise<SpeechSynthesisVoice[]>((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve(voices);
          return;
        }
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        };
      });
    };

    const voices = await loadVoices();
    console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));

    if (language === 'kn') {
      // Try to find Kannada voice (kn-IN)
      const kannadaVoice = voices.find(v => v.lang.includes('kn') || v.lang.includes('Kannada'));

      if (kannadaVoice) {
        // Use native Kannada voice if available
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.voice = kannadaVoice;
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'kn-IN';

        utterance.onend = () => {
          setIsSpeaking(false);
          toast.success("Kannada story completed!");
        };

        utterance.onerror = (e) => {
          console.error("Kannada TTS error:", e);
          setIsSpeaking(false);
          toast.error("Kannada TTS failed");
        };

        window.speechSynthesis.speak(utterance);
        toast.success("Playing in Kannada");
      } else {
        // No Kannada voice available, try Hindi as alternative
        const hindiVoice = voices.find(v => v.lang.includes('hi-IN') || v.lang.includes('Hindi'));
        const tamilVoice = voices.find(v => v.lang.includes('ta-IN') || v.lang.includes('Tamil'));

        // Prefer Hindi over Tamil for better pronunciation of Kannada
        const alternativeVoice = hindiVoice || tamilVoice;

        if (alternativeVoice) {
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.voice = alternativeVoice;
          utterance.rate = 0.7;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          utterance.lang = alternativeVoice.lang;

          utterance.onend = () => {
            setIsSpeaking(false);
          };

          utterance.onerror = () => {
            setIsSpeaking(false);
            toast.error("TTS failed");
          };

          window.speechSynthesis.speak(utterance);
          toast.info(`Playing in ${alternativeVoice.name} (Kannada voice not available)`);
        } else {
          // No Indian language voices available
          setIsSpeaking(false);
          toast.warning("Kannada text-to-speech is not available. Please install Kannada language support in your browser or Windows settings.");
        }
      }
    } else {
      // Use browser TTS for English
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error("TTS failed");
      };

      window.speechSynthesis.speak(utterance);
      toast.success(translate("Playing temple story"));
    }
  };

  const handleDirections = () => {
    toast.info(translate("Opening directions in Google Maps..."));
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(temple.name + " " + temple.location)}`,
      "_blank"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: temple.name,
        text: temple.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(translate("Link copied to clipboard!"));
    }
  }; const handleSave = () => {
    toast.success(translate("Temple saved to your collection"));
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      <aside
        ref={panelRef}
        id={`detail-${temple.id}`}
        className="detail-panel fixed top-0 right-0 h-full w-full md:w-[44%] md:min-w-[420px] bg-background z-50 overflow-y-auto shadow-2xl animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`title-${temple.id}`}
      >
        <header className="dp-header sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 id={`title-${temple.id}`} className="text-2xl font-serif font-bold text-foreground">
                {translate(temple.name)}
              </h2>
              <div className="dp-sub flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{translate(temple.location)} • {translate(temple.region)}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-primary text-primary-foreground">
                  {translate(temple.deity)}
                </Badge>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="dp-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="dp-hero">
          <div className="dp-gallery relative">
            <img
              src={currentImage}
              alt={temple.name}
              className="dp-main w-full h-64 md:h-80 object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/20 hover:bg-black/40 text-white"
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="bg-black/20 hover:bg-black/40 text-white"
                onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            <div className="dp-thumbs absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                    }`}
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="dp-actions flex flex-wrap gap-2 p-4 border-b border-border">
            <Button
              id={`tts-${temple.id}`}
              className="btn-tts"
              variant={isSpeaking ? "default" : "outline"}
              onClick={handleTTS}
              aria-pressed={isSpeaking}
            >
              <Volume2 className="mr-2 h-4 w-4" />
              {translate(isSpeaking ? "Stop Story" : "Play Full Story")}
              {language === 'kn' && (
                <span className="ml-2 text-xs opacity-70">
                  (ಕನ್ನಡ)
                </span>
              )}
            </Button>


            <Button
              className="btn-directions"
              variant="outline"
              onClick={handleDirections}
            >
              <Navigation className="mr-2 h-4 w-4" />
              <span>{translate("Directions")}</span>
            </Button>

            <Button
              className="btn-language"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                toggleLanguage();
              }}
            >
              <Languages className="mr-2 h-4 w-4" />
              {language === 'en' ? 'ಕನ್ನಡ' : 'ಇಂಗ್ಲಿಷ್'}
            </Button>

            <Button
              className="btn-save"
              variant="outline"
              size="icon"
              onClick={handleSave}
            >
              <Bookmark className="h-4 w-4" />
            </Button>

            <Button
              className="btn-share"
              variant="outline"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <section className="dp-content p-6 space-y-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-3">
              {translate("Quick Facts")}
            </h3>
            <ul className="dp-facts space-y-2">
              <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong className="text-sm font-medium">{translate("Deity:")}</strong>
                  <span className="text-sm text-muted-foreground ml-2">{translate(temple.deity)}</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong className="text-sm font-medium">{translate("Location:")}</strong>
                  <span className="text-sm text-muted-foreground ml-2">{translate(temple.location)}, {translate(temple.region)}</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-3">
              {translate("Story")}
            </h3>
            <div className="dp-story text-foreground/90 leading-relaxed whitespace-pre-line">
              <p>{fullStory}</p>
            </div>
          </div>

          {/* Opening Hours Section */}
          {temple.openingHours && (
            <div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {translate("Opening Hours")}
              </h3>
              <div className="space-y-2">
                {temple.openingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-muted/30 rounded-lg">
                    <span className="font-medium text-foreground">{translate(schedule.day)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{schedule.hours}</span>
                      {schedule.isOpen && (
                        <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded">
                          {translate("Open now")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Guide Section */}
          {temple.travelInfo && (
            <div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                {translate("Travel Guide")}
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm">🚌</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'kn'
                      ? `ಈ ದೇವಾಲಯ ಜೂಬ್ಲೀ ಬಸ್ ಸ್ಟೇಷನ್ ನಿಂದ ${temple.travelInfo.fromJubileeBusStation}, ಷಾಮಿರ್ಪೇಟ ನಿಂದ ${temple.travelInfo.fromShamirpet}, ORR ಎಗ್ಜಿಟ್ ನಿಂದ ${temple.travelInfo.fromORRExit} ದೂರದಲ್ಲಿದೆ.`
                      : `This temple is around ${temple.travelInfo.fromJubileeBusStation} from Jubilee Bus Station, ${temple.travelInfo.fromShamirpet} from Shamirpet, ${temple.travelInfo.fromORRExit} from ORR Exit.`
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {temple.faqs && temple.faqs.length > 0 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                {translate("FAQ's")}
              </h3>
              <div className="space-y-3">
                {temple.faqs.map((faq, index) => (
                  <div key={index} className="border border-border rounded-lg">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">{translate(faq.question)}</h4>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-3 text-muted-foreground">
                        {translate(faq.answer)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events & Calendar Section */}
          {temple.events && temple.events.length > 0 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                {translate("Events & Calendar")}
              </h3>
              <div className="space-y-4">
                {temple.events.map((event) => (
                  <div key={event.id} className="border border-border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {translate(event.type)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          {translate("Add to My Calendar")}
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{event.description}</p>
                    {event.contact && (
                      <div className="text-xs text-muted-foreground">
                        <strong>{translate("Contact")}:</strong> {event.contact}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {translate("Festivals & Rituals")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {translate("Festival information and special poojas for")} {temple.name} {translate("will be updated soon. Visit the temple or contact local authorities for current schedules.")}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-3">
              {translate("Visitor Info")}
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <Clock className="inline h-4 w-4 mr-2 text-primary" />
                <strong>{translate("Timings:")}</strong> <span className="text-muted-foreground">6:00 AM – 8:00 PM ({translate("typical")})</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {translate("Please verify timings before visiting as they may vary on festival days.")}
              </p>
            </div>
          </div>

          {nearbyTemples.length > 0 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                {translate("Nearby Temples in")} {temple.region}
              </h3>
              <div className="space-y-2">
                {nearbyTemples.slice(0, 3).map((nearby) => (
                  <button
                    key={nearby.id}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    onClick={() => window.location.href = `/temple/${nearby.id}`}
                  >
                    <p className="font-medium text-sm text-foreground">{nearby.name}</p>
                    <p className="text-xs text-muted-foreground">{nearby.location}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-4 border-t border-border">
            <p>
              {translate("Source: Community contributions • Last updated:")} 2025-10-25
            </p>
          </div>
        </section>
      </aside>
    </>
  );
};

export default TempleDetailPanel;
