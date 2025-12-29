import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Calendar as CalendarIcon,
  ChevronDown,
  User,
  Star,
  Flame,
  Music
} from "lucide-react";
import { getFestivalsByMonth, type TempleFestival } from "@/data/templeFestivals";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";

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
  const { language, toggleLanguage } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(11); // December (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedFestival, setSelectedFestival] = useState<TempleFestival | null>(null);

  const allVisibleFestivals = useMemo(() => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;

    return [
      ...getFestivalsByMonth(prevMonth),
      ...getFestivalsByMonth(currentMonth),
      ...getFestivalsByMonth(nextMonth)
    ];
  }, [currentMonth]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const monthIndex = currentDate.getMonth();
      const dateNum = currentDate.getDate();

      const dayFestivals = allVisibleFestivals.filter(
        festival => festival.day === dateNum && festival.month === monthIndex
      );

      days.push({
        date: new Date(currentDate),
        festivals: dayFestivals,
        isCurrentMonth,
        isToday: currentDate.toDateString() === new Date().toDateString()
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [currentMonth, currentYear, allVisibleFestivals]);

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

  const jumpToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      "Temple Festivals Calendar": { en: "Temple Festivals Calendar", kn: "ದೇವಾಲಯ ಹಬ್ಬಗಳ ಕ್ಯಾಲೆಂಡರ್" },
      "Calendar": { en: "Calendar", kn: "ಕ್ಯಾಲೆಂಡರ್" },
      "Temple Festivals": { en: "Temple Festivals", kn: "ದೇವಾಲಯ ಹಬ್ಬಗಳ" },
      "Discover sacred celebrations throughout the year": { en: "Discover sacred celebrations throughout the year", kn: "ವರ್ಷದುದ್ದಕ್ಕೂ ಪವಿತ್ರ ಆಚರಣೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ" },
      "Today": { en: "Today", kn: "ಇಂದು" },
      "View Details": { en: "View Details", kn: "ವಿವರಗಳನ್ನು ನೋಡಿ" },
      "Search ...": { en: "Search ...", kn: "ಹುಡುಕು..." }
    };
    return translations[key]?.[language] || key;
  };

  return (
    <div className="w-full bg-[#FDFCF8] min-h-screen font-sans selection:bg-[#DAA520] selection:text-white pb-20">

      {/* 1. Golden Header Section */}
      <div className="relative w-full bg-[#E6B15C] pb-24 pt-4 shadow-md overflow-hidden">
        {/* Mandala Pattern Overlay */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none">
          <img src="/header-bg.png" alt="" className="w-full h-full object-cover" />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E6B15C]/10 to-[#E6B15C]/40 z-0 pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-[1280px] relative z-20">
          {/* Top Row: Logo & Controls */}
          <div className="flex justify-between items-center mb-4">
            {/* Spacer for centering */}
            <div className="w-24 hidden md:block"></div>

            {/* Logo Center */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-[#3D2616] font-serif font-extrabold text-3xl tracking-tight drop-shadow-sm">TempleVerse</span>
              <Flame className="h-5 w-5 text-[#3D2616] fill-current" />
            </Link>

            {/* Right: Controls */}
            <div className="flex items-center gap-3">
              <button className="bg-[#EBE5D5]/60 backdrop-blur-sm px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest text-[#3D2616] border border-[#3D2616]/10 hover:bg-[#EBE5D5] transition-colors" onClick={toggleLanguage}>
                {language === 'en' ? 'ENG' : 'KAN'}
              </button>
              <button className="bg-[#3D2616] text-[#E6B15C] w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                <User className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Second Row: Nav Pill */}
          <div className="flex justify-center w-full overflow-x-auto no-scrollbar px-4 pb-2">
            <nav className="bg-[#F9F5EA] rounded-full px-1.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-0.5 border border-[#E6D5B8]/80 whitespace-nowrap min-w-max mx-auto">
              {[
                { name: 'Home', path: '/' },
                { name: 'Get Educated', path: '/education' },
                { name: 'Temples', path: '/' },
                { name: 'Calendar', path: '/calendar' },
                { name: 'Book Travel', path: '/book-travel' },
                { name: 'Add Temple Listing', path: '/add-temple' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                        px-5 py-2 rounded-full text-xs font-bold transition-all duration-300
                        ${item.name === 'Calendar'
                      ? 'bg-[#3D2616] text-[#F9F5EA] shadow-sm'
                      : 'text-[#5C3A21] hover:bg-[#E6B15C]/20 hover:text-[#3D2616]'}
                      `}
                >
                  {item.name}
                </Link>
              ))}
              <div className="w-px h-4 bg-[#D4C4A8] mx-2"></div>
              <button className="flex items-center gap-2 pr-4 pl-1 text-[#5C3A21] hover:text-[#3D2616]">
                <Search className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">Search</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* 2. Floating Hero Card Section - Adjusted Height and Overlap */}
      <div className="container mx-auto px-4 max-w-[1280px] -mt-16 relative z-10 mb-8">
        <div className="relative w-full h-[420px] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] bg-white border border-white/20">
          {/* Hero Image */}
          <div className="absolute inset-0">
            <img
              src="/hero-temple.png"
              alt="Temple Atmosphere"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/temples/kadri.png";
                target.onerror = null;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D2616]/60 via-transparent to-[#3D2616]/20"></div>
          </div>

          {/* Hero Text */}
          <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-16 text-center pointer-events-none">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white drop-shadow-xl mb-2 tracking-tight leading-tight">
              {translate("Temple Festivals Calendar")}
            </h1>
            <p className="text-[#F9F5EA] text-base font-medium tracking-wide drop-shadow-md opacity-90 max-w-xl mx-auto">
              {translate("Discover sacred celebrations throughout the year")}
            </p>
          </div>

          {/* Search Bar Strip (Bottom of Card) */}
          <div className="absolute bottom-5 left-5 right-5">
            <div className="bg-[#3D2616] p-2 rounded-xl shadow-xl flex flex-col md:flex-row items-center gap-2">

              {/* Search Input */}
              <div className="relative flex-grow w-full md:w-auto">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder={translate("Search ...")}
                  className="w-full h-10 pl-10 pr-10 rounded-lg bg-white text-sm font-medium text-[#3D2616] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E6B15C]"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#3D2616] h-8 w-8 rounded-md flex items-center justify-center text-[#E6B15C] hover:bg-[#5C3A21] transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex w-full md:w-auto gap-2 overflow-x-auto no-scrollbar md:pl-2">
                {[
                  { label: 'Type: All', width: 'min-w-[100px]' },
                  { label: 'Location', width: 'min-w-[100px]' },
                  { label: 'Deity', width: 'min-w-[90px]' },
                  { label: 'Date', width: 'min-w-[90px]' }
                ].map((filter) => (
                  <button key={filter.label} className={`h-10 px-4 bg-[#EBE5D5] hover:bg-[#D4C4A8] text-[#3D2616] text-xs font-bold rounded-lg flex items-center justify-between gap-2 ${filter.width} whitespace-nowrap transition-colors`}>
                    <span>{filter.label}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="bg-[#FDFCF8] min-h-screen pt-8 relative">
        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">

          {/* Calendar Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="flex gap-3">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-10 w-10 bg-[#F9F5EA] border-[#D4C4A8] text-[#5C3A21] hover:bg-[#EBE5D5] rounded-xl shadow-sm">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="bg-[#EBE5D5] border border-[#D4C4A8] px-6 py-2 rounded-xl text-[#3D2616] text-sm font-bold uppercase tracking-wider flex items-center transition-colors hover:bg-[#D4C4A8] shadow-sm cursor-pointer">
                Preview 2025
              </div>
            </div>

            <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#3D2616] drop-shadow-sm tracking-tight">
              {language === 'kn' ? monthNamesKannada[currentMonth] : monthNames[currentMonth]} {currentYear}
            </h2>

            <div className="flex gap-3">
              <div className="bg-[#EBE5D5] border border-[#D4C4A8] px-6 py-2 rounded-xl text-[#3D2616] text-sm font-bold uppercase tracking-wider cursor-pointer hover:bg-[#D4C4A8] shadow-sm" onClick={jumpToToday}>
                {translate("Today")}
              </div>
              <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-10 w-10 bg-[#F9F5EA] border-[#D4C4A8] text-[#5C3A21] hover:bg-[#EBE5D5] rounded-xl shadow-sm">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="bg-[#F6F1E3] p-8 rounded-[2rem] border border-[#E6D5B8] shadow-xl">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-6">
              {dayNames.map((day, i) => (
                <div key={i} className="text-center">
                  <span className="bg-[#EBE5D5] px-4 py-1.5 rounded-full font-serif text-[#3D2616] font-bold text-sm tracking-widest uppercase opacity-80 border border-[#D4C4A8]">
                    {language === 'kn' ? dayNamesKannada[i] : day}
                  </span>
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-4">
              {calendarDays.map((day, index) => {
                const hasFestival = day.festivals.length > 0;
                const primaryFestival = day.festivals[0];

                return (
                  <div
                    key={index}
                    className={`
                           relative aspect-[3/4.2] rounded-xl p-3
                           transition-all duration-300
                           ${!day.isCurrentMonth ? 'opacity-40 grayscale' : 'opacity-100'}
                           ${hasFestival ? 'cursor-pointer hover:-translate-y-1 hover:shadow-2xl bg-white' : 'bg-[#F9F5EA]'}
                           border border-[#E6D5B8]
                        `}
                    onClick={() => hasFestival && handleFestivalClick(primaryFestival)}
                  >
                    {/* Inner Dashed Border (The Vintage Card Look) */}
                    <div className="absolute inset-2 border-2 border-dashed border-[#D4C4A8] rounded-lg opacity-60 pointer-events-none"></div>

                    {/* Date Number */}
                    <div className="absolute top-4 left-5 z-10">
                      <span className={`
                              font-serif text-3xl leading-none
                              ${day.isToday ? 'text-[#FF4500] font-black' : 'text-[#3D2616] font-bold'}
                           `}>
                        {day.date.getDate()}
                      </span>
                    </div>

                    {/* Expand Icon */}
                    {hasFestival && (
                      <div className="absolute top-4 right-4 opacity-40">
                        <ChevronDown className="h-4 w-4 text-[#3D2616] rotate-180" />
                      </div>
                    )}

                    {/* Content */}
                    {hasFestival ? (
                      <div className="flex flex-col h-full justify-end relative z-10 px-1 pb-1">
                        {/* Image */}
                        <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden mb-2 border border-[#D4C4A8] shadow-sm group">
                          <img
                            src={primaryFestival.image || "/placeholder.svg"}
                            alt={primaryFestival.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className={`
                                    absolute top-2 left-2 py-0.5 px-1.5 rounded text-[0.6rem] font-black text-white uppercase tracking-wider shadow-sm
                                    ${primaryFestival.type === 'festival' ? 'bg-[#FF4500]' :
                              primaryFestival.type === 'pooja' ? 'bg-[#DAA520]' :
                                primaryFestival.type === 'special' ? 'bg-[#8B4513]' : 'bg-[#228B22]'}
                                 `}>
                            {primaryFestival.type}
                          </div>
                        </div>

                        <h4 className="font-serif text-[#3D2616] text-sm font-bold leading-tight line-clamp-2 mb-1">
                          {primaryFestival.name}
                        </h4>
                        <p className="text-[#8B4513] text-xs truncate font-semibold opacity-70">
                          {primaryFestival.temple}
                        </p>
                      </div>
                    ) : (
                      /* Huge Date for Empty Cells Layout */
                      <div className="flex items-center justify-center h-full pt-8">
                        <span className="font-serif text-[4rem] text-[#D4C4A8] font-bold opacity-10 select-none">
                          {day.date.getDate()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-12 flex justify-center pb-12">
            <div className="bg-[#FDFCF8] border border-[#E6D5B8] rounded-full px-10 py-4 flex gap-10 shadow-sm">
              {[
                { label: 'Pooja', color: 'bg-[#DAA520]', icon: Star },
                { label: 'Festival', color: 'bg-[#FF4500]', icon: Flame },
                { label: 'Special', color: 'bg-[#8B4513]', icon: Music },
                { label: 'Jatra', color: 'bg-[#228B22]', icon: User }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-full ${item.color} bg-opacity-20`}>
                    <item.icon className={`h-4 w-4 ${item.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="text-[#3D2616] text-xs font-bold uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Selected Festival Modal (Unchanged Logically) */}
      {selectedFestival && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3D2616]/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedFestival(null)}>
          <Card className="w-full max-w-2xl bg-[#F9F5EA] border-[6px] border-[#E6D5B8] shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="h-64 relative">
              <img
                src={selectedFestival.image || "/placeholder.svg"}
                className="w-full h-full object-cover"
                alt={selectedFestival.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              <Button variant="ghost" className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 p-0" onClick={() => setSelectedFestival(null)}>
                <span className="text-3xl leading-none">&times;</span>
              </Button>

              <div className="absolute bottom-6 left-8 right-8">
                <div className="flex gap-2 mb-3">
                  <Badge className="bg-[#DAA520] hover:bg-[#C5951D] text-[#3D2616] border-none px-3 py-1 text-xs font-bold tracking-widest uppercase shadow-lg">
                    {selectedFestival.type}
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-none px-3 py-1 text-xs font-bold tracking-widest uppercase">
                    {selectedFestival.duration}
                  </Badge>
                </div>
                <h3 className="font-serif text-4xl md:text-5xl font-bold text-white leading-none drop-shadow-xl">
                  {selectedFestival.name}
                </h3>
              </div>
            </div>

            <CardContent className="p-10 bg-[#F9F5EA]">
              <div className="grid grid-cols-3 gap-8 mb-8 pb-8 border-b border-[#D4C4A8]/30">
                <div className="col-span-2">
                  <p className="text-[#8B4513] text-xs font-bold uppercase tracking-widest mb-2">Temple</p>
                  <p className="font-serif text-2xl font-bold text-[#3D2616] leading-tight mb-2">
                    {selectedFestival.temple}
                  </p>
                  <p className="text-sm text-[#5C3A21] flex items-center gap-2 font-medium opacity-80">
                    <MapPin className="h-4 w-4" /> {selectedFestival.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#8B4513] text-xs font-bold uppercase tracking-widest mb-2">Date</p>
                  <div className="inline-block bg-[#3D2616] text-[#F9F5EA] px-4 py-2 rounded-lg text-lg font-bold shadow-md">
                    {selectedFestival.date}
                  </div>
                </div>
              </div>

              <div className="prose prose-lg text-[#5C3A21] mb-8 font-serif leading-relaxed opacity-90">
                <p>
                  {selectedFestival.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                {selectedFestival.highlights?.map((highlight, idx) => (
                  <span key={idx} className="text-sm font-bold text-[#5C3A21] bg-[#E6D5B8]/30 border border-[#E6D5B8] px-3 py-1.5 rounded-full flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]"></span>
                    {highlight}
                  </span>
                ))}
              </div>

              <Button className="w-full bg-[#3D2616] text-[#F9F5EA] hover:bg-[#2A1A0F] font-bold py-7 text-xl shadow-xl rounded-xl transition-all hover:scale-[1.01]">
                {translate("View Details")}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TempleCalendar;
