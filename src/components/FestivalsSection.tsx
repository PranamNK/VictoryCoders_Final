import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Calendar } from "lucide-react";

const festivals = [
  {
    name: "Kadri Rathotsava",
    temple: "Kadri Manjunatha Temple",
    description: "Grand chariot procession with thousands of devotees pulling the magnificent temple chariot through the streets.",
    month: "February-March"
  },
  {
    name: "Kateel Yakshagana Mahotsava",
    temple: "Kateel Durgaparameshwari Temple",
    description: "Annual spiritual performance festival showcasing traditional Yakshagana dance-drama depicting Hindu epics.",
    month: "November-December"
  },
  {
    name: "Kudroli Dasara",
    temple: "Kudroli Gokarnanatheshwara Temple",
    description: "Dazzling golden chariot and spectacular illumination making it one of Mangalore's grandest celebrations.",
    month: "September-October"
  },
  {
    name: "Polali Jatra",
    temple: "Polali Rajarajeshwari Temple",
    description: "Famous coastal fair dedicated to Goddess Rajarajeshwari featuring traditional rituals and cultural programs.",
    month: "March-April"
  }
];

const FestivalsSection = () => {
  return (
    <section id="festivals" className="py-20 spiritual-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-4 w-4 text-primary animate-glow" />
            <span className="text-primary text-sm font-semibold">Sacred Celebrations</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Festival Highlights of Tulunadu
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the vibrant spiritual celebrations that bring our temples to life throughout the year
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {festivals.map((festival, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-border hover-lift temple-shadow hover-glow animate-fade-in bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {festival.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-3">
                      {festival.temple}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">{festival.month}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {festival.description}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <div className="h-1 w-12 bg-primary rounded-full" />
                  <Sparkles className="h-4 w-4 text-accent animate-glow" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Decorative Temple Bell Icon */}
        <div className="mt-16 text-center opacity-20">
          <span className="text-6xl">🔔</span>
        </div>
      </div>
    </section>
  );
};

export default FestivalsSection;
