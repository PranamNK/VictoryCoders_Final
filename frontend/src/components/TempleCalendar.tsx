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
  ArrowRight
} from "lucide-react";
import { templeFestivals, getFestivalsByMonth, type TempleFestival } from "@/data/templeFestivals";
import { useLanguage } from "@/context/LanguageContext";

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

interface TempleCalendarProps {
  onFestivalSelect?: (festival: TempleFestival) => void;
}

const TempleCalendar = ({ onFestivalSelect }: TempleCalendarProps) => {
  const { language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedFestival, setSelectedFestival] = useState<TempleFestival | null>(null);

  const currentMonthFestivals = useMemo(() => {
    return getFestivalsByMonth(currentMonth);
  }, [currentMonth]);

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
    onFestivalSelect?.(festival);
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
      }
    };
    
    return translations[key]?.[language] || key;
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 mb-3">
          <CalendarIcon className="h-3 w-3 text-primary" />
          <span className="text-primary text-xs font-semibold">Sacred Calendar</span>
        </div>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">
          {translate("Temple Festivals Calendar")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {translate("Discover sacred celebrations throughout the year")}
        </p>
      </div>

      {/* Calendar Header */}
      <div className="bg-card rounded-lg shadow-sm mb-4 overflow-hidden">
        <div className="bg-primary/5 px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className="hover:bg-primary/10 h-8 w-8 p-0"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            
            <h3 className="text-lg font-bold text-foreground">
              {language === 'kn' ? monthNamesKannada[currentMonth] : monthNames[currentMonth]} {currentYear}
            </h3>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="hover:bg-primary/10 h-8 w-8 p-0"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-3">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, index) => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-1">
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
                  min-h-[60px] p-1 border border-border rounded
                  ${day.isCurrentMonth ? 'bg-card' : 'bg-muted/30'}
                  ${day.isToday ? 'ring-1 ring-primary' : ''}
                  hover:bg-muted/50 transition-colors
                `}
              >
                <div className={`
                  text-xs font-medium mb-1
                  ${day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                  ${day.isToday ? 'text-primary font-bold' : ''}
                `}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-0.5">
                  {day.festivals.slice(0, 1).map((festival, festIndex) => (
                    <div
                      key={festIndex}
                      className={`
                        text-xs p-1 rounded cursor-pointer
                        ${getFestivalTypeColor(festival.type)}
                        hover:opacity-80 transition-opacity
                      `}
                      onClick={() => handleFestivalClick(festival)}
                    >
                      <div className="truncate font-medium text-xs">{festival.name}</div>
                    </div>
                  ))}
                  {day.festivals.length > 1 && (
                    <div className="text-xs text-muted-foreground">
                      +{day.festivals.length - 1}
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
        <Card className="mb-4 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getFestivalTypeColor(selectedFestival.type)}>
                    {selectedFestival.type.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {selectedFestival.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {selectedFestival.name}
                </h3>
                <p className="text-primary font-medium mb-2 text-sm">
                  {selectedFestival.temple}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {selectedFestival.description}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFestival(null)}
                className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-primary" />
                <div>
                  <div className="text-xs font-medium">{translate("Temple")}</div>
                  <div className="text-xs text-muted-foreground">{selectedFestival.temple}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-primary" />
                <div>
                  <div className="text-xs font-medium">{translate("Duration")}</div>
                  <div className="text-xs text-muted-foreground">{selectedFestival.duration}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">
                {translate("View Details")}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Festival Type Legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-orange-100 border border-orange-200"></div>
          <span className="text-xs text-muted-foreground">Festival</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-blue-100 border border-blue-200"></div>
          <span className="text-xs text-muted-foreground">Pooja</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-purple-100 border border-purple-200"></div>
          <span className="text-xs text-muted-foreground">Special</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-green-100 border border-green-200"></div>
          <span className="text-xs text-muted-foreground">Jatra</span>
        </div>
      </div>
    </div>
  );
};

export default TempleCalendar;
