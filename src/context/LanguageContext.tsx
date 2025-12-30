import React, { createContext, useContext, useState, ReactNode } from 'react';
import { templeDescriptions, type Language } from '../data/translations/templeDescriptions';
import { uiTranslations } from '../data/translations/uiTranslations';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  translate: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Import translations from separate files to keep this file manageable
const translations: Record<string, Record<Language, string>> = {
  ...templeDescriptions,
  ...uiTranslations
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'kn' : 'en');
  };

  const translate = (text: string): string => {
    // Return empty string for undefined/null
    if (!text) return '';
    
    // Check for exact match first
    if (translations[text]?.[language]) {
      return translations[text][language];
    }

    // For location-based strings and section headers
    if (text.includes('Nearby Temples') || text.includes('ಸಮೀಪದ ದೇವಾಲಯಗಳು')) {
      // Try exact match first for the full text
      if (translations[text]?.[language]) {
        return translations[text][language];
      }
      // Try matching with the known header pattern
      const key = 'ಸಮೀಪದ ದೇವಾಲಯಗಳು - Mangalore';
      if (translations[key]) {
        return translations[key][language];
      }
      // If still no match, try to extract location
      const locationMatch = text.match(/in (.+)$/) || text.match(/- (.+)$/);
      if (locationMatch) {
        const location = locationMatch[1];
        const translatedLocation = translations[location]?.[language] || location;
        return language === 'kn' 
          ? `ಸಮೀಪದ ದೇವಾಲಯಗಳು - ${translatedLocation}`
          : `Nearby Temples in ${translatedLocation}`;
      }
    }

    // For strings with bullets, commas, or repeated locations
    if (text.includes('•') || text.includes(',')) {
      // First check if there's an exact match for the whole string
      if (translations[text]?.[language]) {
        return translations[text][language];
      }
      // Split by both bullets and commas
      const parts = text.split(/[•,]/).map(part => part.trim()).filter(Boolean);
      const uniqueParts = [...new Set(parts)];
      // For location strings (no bullets), just show the first unique part
      if (!text.includes('•') && text.toLowerCase().includes('mangalore')) {
        const firstPart = uniqueParts.find(part => translations[part]?.[language]);
        return firstPart ? translations[firstPart][language] : uniqueParts[0];
      }
      // If it originally had bullets, join with bullets
      const separator = text.includes('•') ? ' • ' : '';
      return uniqueParts.map(part => translations[part]?.[language] || part).join(separator);
    }

    // Check for composite strings with colons (e.g., "Deity: Goddess Mangaladevi")
    if (text.includes(':')) {
      const [label, ...rest] = text.split(':');
      const translatedLabel = translations[label.trim() + ':']?.[language] || label + ':';
      const value = rest.join(':').trim();
      
      // Handle comma-separated values in the second part
      const values = value.split(',').map(v => v.trim());
      // Only translate unique values
      const uniqueValues = [...new Set(values)];
      const translatedValues = uniqueValues.map(v => translations[v]?.[language] || v);
      
      return `${translatedLabel} ${translatedValues.join(', ')}`;
    }

    // Handle phrases that contain known translations - but only translate unique instances
    let translatedText = text;
    // Sort keys by length (descending) to handle longer matches first
    const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);
    
    const processedParts = new Set();
    for (const key of sortedKeys) {
      if (text.includes(key) && !processedParts.has(key)) {
        const translation = translations[key][language];
        // Only replace the first occurrence of each key
        translatedText = translatedText.replace(key, translation);
        processedParts.add(key);
      }
    }

    return translatedText;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}