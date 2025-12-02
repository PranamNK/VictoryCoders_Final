import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ExploreSection from "@/components/ExploreSection";
import Footer from "@/components/Footer";
import MapView from "@/components/MapView";
import TempleListView from "@/components/TempleListView";
import TempleDetailPanel from "@/components/TempleDetailPanel";
import { temples } from "@/data/temples";
import { Temple } from "@/data/temples";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, List } from "lucide-react";

const Index = () => {
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const nearbyTemples = useMemo(() => {
    if (!selectedTemple) return [];
    return temples
      .filter((t) => t.region === selectedTemple.region && t.id !== selectedTemple.id)
      .slice(0, 3);
  }, [selectedTemple]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      {/* Map + List Split View Section */}
      <section className="py-16" id="temples">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Temples
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interactive map and complete listing of temples across the region
            </p>
          </div>

          {/* Mobile view toggle */}
          <div className="flex justify-center gap-2 mb-4 md:hidden">
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              onClick={() => setViewMode("map")}
              className="flex-1"
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Map
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className="flex-1"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>

          {/* Desktop split view, Mobile stacked */}
          <div className="bg-card rounded-[var(--radius)] overflow-hidden card-shadow">
            <div className="flex flex-col md:flex-row h-[600px]">
              {/* Map View */}
              <div className={`${viewMode === "map" ? "block" : "hidden"} md:block md:w-[55%] h-full`}>
                <MapView
                  temples={temples}
                  selectedTemple={selectedTemple}
                  onTempleSelect={setSelectedTemple}
                />
              </div>

              {/* List View */}
              <div className={`${viewMode === "list" ? "block" : "hidden"} md:block md:w-[45%] h-full border-t md:border-t-0 md:border-l border-border`}>
                <TempleListView
                  temples={temples}
                  selectedTemple={selectedTemple}
                  onTempleSelect={setSelectedTemple}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ExploreSection />
      <Footer />

      {/* Temple Detail Panel */}
      {selectedTemple && (
        <TempleDetailPanel
          temple={selectedTemple}
          onClose={() => setSelectedTemple(null)}
          nearbyTemples={nearbyTemples}
        />
      )}
    </div>
  );
};

export default Index;
