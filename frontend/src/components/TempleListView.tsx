import { useEffect, useRef } from "react";
import { Temple } from "@/data/temples";
import { Button } from "./ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import templeImage1 from "@/assets/temple-card-1.jpg";
import templeImage2 from "@/assets/temple-card-2.jpg";

interface TempleListViewProps {
  temples: Temple[];
  selectedTemple: Temple | null;
  onTempleSelect: (temple: Temple) => void;
}

const TempleListView = ({ temples, selectedTemple, onTempleSelect }: TempleListViewProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLElement }>({});

  useEffect(() => {
    // Scroll selected temple into view
    if (selectedTemple && cardRefs.current[selectedTemple.id]) {
      cardRefs.current[selectedTemple.id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedTemple]);

  const handleShare = (temple: Temple, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: temple.name,
        text: temple.shortDescription,
        url: window.location.origin + `/temple/${temple.id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/temple/${temple.id}`);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div ref={listRef} className="temple-list h-full overflow-y-auto px-4 py-6 space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Temples in Coastal Karnataka
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {temples.length} sacred places to explore
        </p>
      </div>

      {temples.map((temple, index) => {
        const displayImage = index % 2 === 0 ? templeImage1 : templeImage2;
        const isSelected = selectedTemple?.id === temple.id;

        return (
          <article
            key={temple.id}
            ref={(el) => {
              if (el) cardRefs.current[temple.id] = el;
            }}
            className={`temple-card bg-card rounded-[var(--radius)] overflow-hidden transition-all duration-200 cursor-pointer card-shadow hover-lift ${
              isSelected ? "border-l-4 border-l-primary ring-2 ring-primary/20" : "hover-accent-border"
            }`}
            onClick={() => onTempleSelect(temple)}
            data-slug={temple.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTempleSelect(temple);
              }
            }}
          >
            <div className="flex flex-col sm:flex-row">
              <img
                className="tc-thumb w-full sm:w-48 h-48 object-cover"
                src={displayImage}
                alt={temple.name}
                loading="lazy"
              />
              
              <div className="tc-body flex-1 p-4 space-y-2">
                <h3 className="tc-title text-lg font-serif font-bold text-foreground line-clamp-2">
                  {temple.name}
                </h3>
                
                <p className="tc-meta text-sm text-muted-foreground">
                  {temple.location} • {temple.deity}
                </p>
                
                <p className="tc-snippet text-sm text-foreground/80 line-clamp-2">
                  {temple.shortDescription}
                </p>
                
                <div className="tc-actions flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="btn-view bg-primary text-primary-foreground hover:bg-primary/90"
                    aria-controls={`detail-${temple.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTempleSelect(temple);
                    }}
                  >
                    View details
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="btn-share"
                    aria-label={`Share ${temple.name}`}
                    onClick={(e) => handleShare(temple, e)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default TempleListView;
