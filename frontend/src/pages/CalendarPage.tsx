import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Sparkles,
  Star,
  ArrowRight,
  Filter,
  Search
} from "lucide-react";
import { templeFestivals, getFestivalsByMonth, type TempleFestival } from "@/data/templeFestivals";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monthNamesKannada = [
  "ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್",
  "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayNamesKannada = ["ಭಾನು", "ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"];

const CalendarPage = () => {
  const { language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedFestival, setSelectedFestival] = useState<TempleFestival | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const currentMonthFestivals = useMemo(() => {
    let festivals = getFestivalsByMonth(currentMonth);
    
    // Apply type filter
    if (filterType !== "all") {
      festivals = festivals.filter(festival => festival.type === filterType);
    }
    
    // Apply search filter
    if (searchTerm) {
      festivals = festivals.filter(festival => 
        festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        festival.temple.toLowerCase().includes(searchTerm.toLowerCase()) ||
        festival.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return festivals;
  }, [currentMonth, filterType, searchTerm]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayFestivals = currentMonthFestivals.filter(
        festival => festival.day === currentDate.getDate()
      );
      
      days.push({
        date: new Date(currentDate),
        festivals: dayFestivals,
        isCurrentMonth: currentDate.getMonth() === currentMonth,
        isToday: currentDate.toDateString() === new Date().toDateString()
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }, [currentMonth, currentYear, currentMonthFestivals]);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleFestivalClick = (festival: TempleFestival) => {
    setSelectedFestival(festival);
  };

  const getFestivalTypeColor = (type: string) => {
    switch (type) {
      case "festival": return "bg-orange-100 text-orange-800 border-orange-200";
      case "pooja": return "bg-blue-100 text-blue-800 border-blue-200";
      case "special": return "bg-purple-100 text-purple-800 border-purple-200";
      case "jatra": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      "Temple Festivals Calendar": {
        en: "Temple Festivals Calendar",
        kn: "ದೇವಾಲಯ ಹಬ್ಬಗಳ ಕ್ಯಾಲೆಂಡರ್"
      },
      "Discover sacred celebrations throughout the year": {
        en: "Discover sacred celebrations throughout the year",
        kn: "ವರ್ಷದುದ್ದಕ್ಕೂ ಪವಿತ್ರ ಆಚರಣೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ"
      },
      "Festival Details": {
        en: "Festival Details",
        kn: "ಹಬ್ಬದ ವಿವರಗಳು"
      },
      "Temple": {
        en: "Temple",
        kn: "ದೇವಾಲಯ"
      },
      "Duration": {
        en: "Duration",
        kn: "ಅವಧಿ"
      },
      "Highlights": {
        en: "Highlights",
        kn: "ಮುಖ್ಯಾಂಶಗಳು"
      },
      "View Details": {
        en: "View Details",
        kn: "ವಿವರಗಳನ್ನು ನೋಡಿ"
      },
      "Filter by Type": {
        en: "Filter by Type",
        kn: "ಪ್ರಕಾರದಿಂದ ಫಿಲ್ಟರ್ ಮಾಡಿ"
      },
      "Search Festivals": {
        en: "Search Festivals",
        kn: "ಹಬ್ಬಗಳನ್ನು ಹುಡುಕಿ"
      },
      "All": {
        en: "All",
        kn: "ಎಲ್ಲಾ"
      },
      "Festival": {
        en: "Festival",
        kn: "ಹಬ್ಬ"
      },
      "Pooja": {
        en: "Pooja",
        kn: "ಪೂಜೆ"
      },
      "Special": {
        en: "Special",
        kn: "ವಿಶೇಷ"
      },
      "Jatra": {
        en: "Jatra",
        kn: "ಜಾತ್ರೆ"
      }
    };
    
    return translations[key]?.[language] || key;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="pt-20">
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                <CalendarIcon className="h-4 w-4 text-primary animate-glow" />
                <span className="text-primary text-sm font-semibold">Sacred Calendar</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                {translate("Temple Festivals Calendar")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {translate("Discover sacred celebrations throughout the year")}
              </p>
            </div>

            {/* Filters and Search */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="bg-card rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={translate("Search Festivals")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {translate("Filter by Type")}:
                    </span>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">{translate("All")}</option>
                      <option value="festival">{translate("Festival")}</option>
                      <option value="pooja">{translate("Pooja")}</option>
                      <option value="special">{translate("Special")}</option>
                      <option value="jatra">{translate("Jatra")}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Calendar Header */}
              <div className="bg-card rounded-lg shadow-lg mb-8 overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePreviousMonth}
                      className="hover:bg-primary/10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <h2 className="text-2xl font-bold text-foreground">
                      {language === 'kn' ? monthNamesKannada[currentMonth] : monthNames[currentMonth]} {currentYear}
                    </h2>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNextMonth}
                      className="hover:bg-primary/10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {dayNames.map((day, index) => (
                      <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                        {language === 'kn' ? dayNamesKannada[index] : day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`
                          min-h-[120px] p-2 border border-border rounded-lg
                          ${day.isCurrentMonth ? 'bg-card' : 'bg-muted/30'}
                          ${day.isToday ? 'ring-2 ring-primary' : ''}
                          hover:bg-muted/50 transition-colors
                        `}
                      >
                        <div className={`
                          text-sm font-medium mb-2
                          ${day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                          ${day.isToday ? 'text-primary font-bold' : ''}
                        `}>
                          {day.date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {day.festivals.slice(0, 3).map((festival, festIndex) => (
                            <div
                              key={festIndex}
                              className={`
                                text-xs p-1 rounded cursor-pointer
                                ${getFestivalTypeColor(festival.type)}
                                hover:opacity-80 transition-opacity
                              `}
                              onClick={() => handleFestivalClick(festival)}
                            >
                              <div className="truncate font-medium">{festival.name}</div>
                              <div className="text-xs opacity-75">{festival.temple}</div>
                            </div>
                          ))}
                          {day.festivals.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{day.festivals.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Festival Details */}
              {selectedFestival && (
                <Card className="mb-8 overflow-hidden temple-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getFestivalTypeColor(selectedFestival.type)}>
                            {selectedFestival.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {selectedFestival.date}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {selectedFestival.name}
                        </h3>
                        <p className="text-primary font-medium mb-3">
                          {selectedFestival.temple}
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {selectedFestival.description}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFestival(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">{translate("Temple")}</div>
                          <div className="text-sm text-muted-foreground">{selectedFestival.temple}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">{translate("Duration")}</div>
                          <div className="text-sm text-muted-foreground">{selectedFestival.duration}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">{translate("Highlights")}</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedFestival.highlights.slice(0, 2).join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        {translate("View Details")}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Festival Type Legend */}
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-100 border border-orange-200"></div>
                  <span className="text-sm text-muted-foreground">Festival</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
                  <span className="text-sm text-muted-foreground">Pooja</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-purple-100 border border-purple-200"></div>
                  <span className="text-sm text-muted-foreground">Special</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
                  <span className="text-sm text-muted-foreground">Jatra</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CalendarPage;
