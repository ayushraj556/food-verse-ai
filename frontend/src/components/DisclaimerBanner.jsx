import React from 'react';
import { AlertTriangle, ShieldAlert, HeartPulse, Info } from 'lucide-react';

export default function DisclaimerBanner({ type = "nutrition", customText, className = "" }) {
  const configs = {
    nutrition: {
      icon: HeartPulse,
      title: "Visual Nutrition Estimation Notice",
      color: "bg-amberfood-50/70 border-amberfood-200 text-amberfood-900",
      iconColor: "text-amberfood-600",
      defaultText: "Nutritional values are approximate visual AI estimates. Portions, cooking oils, and hidden ingredients vary. Never consider this medical or clinical dietetic advice."
    },
    freshness: {
      icon: AlertTriangle,
      title: "Visual Freshness Screening Limitation",
      color: "bg-amber-50 border-amber-200 text-amber-900",
      iconColor: "text-amber-600",
      defaultText: "Visual appearance alone cannot detect harmful micro-bacterial pathogens (Salmonella, Listeria) or invisible toxins. When in doubt, prioritize safety and discard questionable food."
    },
    hygiene: {
      icon: ShieldAlert,
      title: "Kitchen Observation Notice",
      color: "bg-blue-50 border-blue-200 text-blue-900",
      iconColor: "text-blue-600",
      defaultText: "Preliminary visual screening based strictly on observable frames. Does not constitute a formal health department certification or regulatory compliance guarantee."
    },
    allergy: {
      icon: AlertTriangle,
      title: "Allergen & Cross-Contact Alert",
      color: "bg-rose-50 border-rose-200 text-rose-900",
      iconColor: "text-rose-600",
      defaultText: "Always inspect ingredient packaging labels directly. Automated recipe suggestions cannot guarantee total freedom from allergen cross-contact."
    }
  };

  const config = configs[type] || configs.nutrition;
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs leading-relaxed ${config.color} ${className}`}>
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div>
        <span className="font-semibold block mb-0.5">{config.title}</span>
        <p className="opacity-90">{customText || config.defaultText}</p>
      </div>
    </div>
  );
}
