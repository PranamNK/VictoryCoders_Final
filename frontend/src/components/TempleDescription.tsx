import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './TempleDescription.css';

interface TempleDescriptionProps {
  templeId: string;
}

export function TempleDescription({ templeId }: TempleDescriptionProps) {
  const { translate } = useLanguage();
  const fullKey = `temple.${templeId}.full`;
  const description = translate(fullKey);

  return (
    <div className="temple-description-container">
      <p className="temple-description expanded">
        {description}
      </p>
    </div>
  );
}