// servicesContent.tsx
// Runtime-safe service content only

export interface FeatureCard {
  title: string;
  items: string[];
}

export interface ServiceData {
  heroTitle: string;
  heroSubtitle: string;
  heroButtons: { label: string; href: string; primary?: boolean }[];
  featureCards: FeatureCard[];
  ctaPrimaryText: string;
  ctaSecondaryText: string;
}

export const servicesContent: Record<string, ServiceData> = {
  "regular-cleaning": {
    heroTitle: "Reliable Regular Cleaning",
    heroSubtitle:
      "Keep your home or workplace consistently clean with trusted professionals on a schedule that suits you.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/contact", primary: true },
      { label: "Speak to Our Team", href: "/contact" },
    ],
    ctaPrimaryText:
      "Our regular cleaning services maintain hygiene, comfort, and a spotless environment all year round.",
    ctaSecondaryText:
      "Trusted by households and businesses across the North West.",
    featureCards: [
      {
        title: "Living Areas & Workspaces",
        items: [
          "Dust and wipe all surfaces",
          "Vacuum carpets and rugs",
          "Mop hard floors",
          "Empty bins and replace liners",
        ],
      },
      {
        title: "Kitchen Cleaning",
        items: [
          "Clean and sanitise worktops",
          "Wipe appliance exteriors",
          "Clean sinks and taps",
          "Disinfect high-touch areas",
        ],
      },
      {
        title: "Bathrooms & Toilets",
        items: [
          "Clean and disinfect toilets",
          "Wash sinks, baths, and showers",
          "Polish mirrors and chrome",
          "Disinfect bathroom floors",
        ],
      },
      {
        title: "Professional Standards",
        items: [
          "Weekly or fortnightly schedules",
          "Fully insured and vetted staff",
          "Tailored cleaning checklist",
          "Eco-friendly products available",
        ],
      },
    ],
  },

  "deep-cleaning": {
    heroTitle: "Deep Cleaning Services",
    heroSubtitle:
      "A thorough top-to-bottom clean designed to refresh, sanitise, and restore your space.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/contact", primary: true },
      { label: "Speak to Our Team", href: "/deep-cleaning-checklist" },
    ],
    ctaPrimaryText:
      "Our deep cleaning service targets built-up dirt, grease, and bacteria for a complete reset.",
    ctaSecondaryText:
      "Ideal for homes, offices, inspections, and special occasions.",
    featureCards: [
      {
        title: "Full Property Deep Clean",
        items: [
          "All surfaces scrubbed and sanitised",
          "Skirting boards and doors cleaned",
          "Fixtures and fittings detailed",
          "Hard-to-reach areas covered",
        ],
      },
      {
        title: "Kitchen Deep Clean",
        items: [
          "Oven and appliance deep cleaning",
          "Cupboards cleaned inside and out",
          "Grease and grime removal",
          "Descaling sinks and taps",
        ],
      },
      {
        title: "Bathroom Descaling",
        items: [
          "Limescale removal",
          "Tiles and grout scrubbing",
          "Toilets and showers sanitised",
          "Mirrors and chrome polished",
        ],
      },
      {
        title: "Hygiene Focus",
        items: [
          "High-touch areas disinfected",
          "Odour and bacteria removal",
          "Eco-friendly cleaning products",
          "Inspection-ready results",
        ],
      },
    ],
  },

  "end-of-tenancy-cleaning": {
    heroTitle: "End of Tenancy Cleaning",
    heroSubtitle:
      "Professional end of tenancy cleaning to ensure a smooth property handover.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/contact", primary: true },
      { label: "Speak to Our Team", href: "/contact" },
    ],
    ctaPrimaryText:
      "We clean every room to inspection-ready standards for tenants and landlords.",
    ctaSecondaryText:
      "Landlord and letting-agent approved cleaning service.",
    featureCards: [
      {
        title: "Kitchen & Appliances",
        items: [
          "Oven and hob deep cleaned",
          "Appliances cleaned inside and out",
          "Cupboards and drawers wiped",
          "Sinks and taps descaled",
        ],
      },
      {
        title: "Bathrooms & Toilets",
        items: [
          "Full bathroom sanitisation",
          "Limescale and mould removal",
          "Tiles and grout scrubbed",
          "Floors disinfected",
        ],
      },
      {
        title: "Living Areas & Bedrooms",
        items: [
          "Carpets vacuumed thoroughly",
          "Hard floors mopped",
          "Skirting boards wiped",
          "Internal doors cleaned",
        ],
      },
      {
        title: "Move-Out Ready",
        items: [
          "Inspection-standard cleaning",
          "Flexible booking times",
          "Trusted by landlords",
          "Fast turnaround available",
        ],
      },
    ],
  },

  "office-cleaning": {
    heroTitle: "Professional Office Cleaning",
    heroSubtitle:
      "Maintain a clean, productive, and hygienic workplace with professional office cleaning.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/contact", primary: true },
      { label: "Speak to Our Team", href: "/contact" },
    ],
    ctaPrimaryText:
      "We keep offices clean, safe, and welcoming for staff and visitors.",
    ctaSecondaryText:
      "Trusted by offices and businesses across the North West.",
    featureCards: [
      {
        title: "Workstations & Offices",
        items: [
          "Desks wiped and sanitised",
          "Chairs and surfaces cleaned",
          "Bins emptied",
          "Floors vacuumed or mopped",
        ],
      },
      {
        title: "Shared Areas",
        items: [
          "Break rooms cleaned",
          "Kitchen areas sanitised",
          "Meeting rooms refreshed",
          "High-touch points disinfected",
        ],
      },
      {
        title: "Restrooms & Hygiene",
        items: [
          "Toilets cleaned and disinfected",
          "Sinks and mirrors polished",
          "Supplies checked",
          "Floors sanitised",
        ],
      },
      {
        title: "Reliable Service",
        items: [
          "Daily or weekly schedules",
          "Key-holder cleaning available",
          "Fully insured staff",
          "Consistent professional results",
        ],
      },
    ],
  },

  "student-accommodation": {
    heroTitle: "Student Accommodation Cleaning",
    heroSubtitle:
      "Affordable, reliable cleaning for student homes, flats, and shared accommodation.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/contact", primary: true },
      { label: "Speak to Our Team", href: "/contact" },
    ],
    ctaPrimaryText:
      "We help keep student living spaces clean, hygienic, and landlord-ready.",
    ctaSecondaryText:
      "Trusted by students, landlords, and letting agents.",
    featureCards: [
      {
        title: "Bedrooms & Living Areas",
        items: [
          "Dust and wipe surfaces",
          "Vacuum carpets",
          "Empty bins",
          "Floors cleaned",
        ],
      },
      {
        title: "Shared Kitchens",
        items: [
          "Surfaces disinfected",
          "Appliances cleaned",
          "Bins emptied",
          "Grease and food residue removed",
        ],
      },
      {
        title: "Bathrooms & Toilets",
        items: [
          "Full sanitisation",
          "Showers and sinks cleaned",
          "Mirrors polished",
          "Floors disinfected",
        ],
      },
      {
        title: "Student-Friendly Service",
        items: [
          "Affordable pricing",
          "End-of-term cleaning",
          "Flexible scheduling",
          "Landlord-approved standards",
        ],
      },
    ],
  },

  "appliances-cleaning": {
    heroTitle: "Appliance Cleaning",
    heroSubtitle:
      "Professional appliance cleaning to restore hygiene and performance.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/contact", primary: true },
      { label: "Speak to Our Team", href: "/contact" },
    ],
    ctaPrimaryText:
      "Extend the life of your appliances with expert cleaning.",
    ctaSecondaryText:
      "Ideal for homes, landlords, and property managers.",
    featureCards: [
      {
        title: "Oven & Hob Cleaning",
        items: [
          "Carbon and grease removal",
          "Glass and racks cleaned",
          "Control panels wiped",
          "Safe degreasing products",
        ],
      },
      {
        title: "Fridge & Freezer",
        items: [
          "Interior sanitisation",
          "Shelves and drawers cleaned",
          "Odour removal",
          "Food-safe products used",
        ],
      },
      {
        title: "Small Appliances",
        items: [
          "Microwave cleaning",
          "Kettle descaling",
          "Toaster crumb removal",
          "External surfaces polished",
        ],
      },
      {
        title: "Professional Care",
        items: [
          "Eco-friendly solutions",
          "No damage to appliances",
          "Fully insured service",
          "Hygienic, safe results",
        ],
      },
    ],
  },

  "carpet-cleaning": {
    heroTitle: "Professional Carpet Cleaning",
    heroSubtitle:
      "Revive carpets and rugs with deep professional carpet cleaning.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/contact", primary: true },
      { label: "Speak to Our Team", href: "/contact" },
    ],
    ctaPrimaryText:
      "We remove dirt, stains, and allergens for a fresh, long-lasting clean.",
    ctaSecondaryText:
      "Trusted by homes and offices across the North West.",
    featureCards: [
      {
        title: "Deep Carpet Cleaning",
        items: [
          "Deep fibre dirt removal",
          "High-traffic areas treated",
          "Professional equipment used",
          "Fresh finish restored",
        ],
      },
      {
        title: "Stain & Odour Treatment",
        items: [
          "Targeted stain removal",
          "Odour neutralisation",
          "Pet stain treatment",
          "Spill and wear care",
        ],
      },
      {
        title: "Health Benefits",
        items: [
          "Allergen reduction",
          "Dust mite removal",
          "Improved air quality",
          "Cleaner indoor environment",
        ],
      },
      {
        title: "Efficient Service",
        items: [
          "Quick drying methods",
          "Eco-friendly products",
          "Suitable for homes & offices",
          "Fully insured professionals",
        ],
      },
    ],
  },

  // Hospitality Cleaning (Bars, Restaurants, Hotels)
  "bars-restaurants": {
    heroTitle: "Hospitality Cleaning Services",
    heroSubtitle:
      "Maintain spotless, hygienic, and welcoming environments for your guests in hotels, bars, and restaurants.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/contact", primary: true },
      { label: "Speak to Our Team", href: "/contact" },
    ],
    ctaPrimaryText:
      "Our hospitality cleaning services ensure your premises meet the highest hygiene standards for staff and guests.",
    ctaSecondaryText:
      "Trusted by hotels, bars, and restaurants across the North West.",
    featureCards: [
      {
        title: "Front of House",
        items: [
          "Floors vacuumed and mopped",
          "Tables, counters, and displays cleaned",
          "Glass and mirrors polished",
          "High-touch areas sanitised",
        ],
      },
      {
        title: "Kitchens & Food Prep Areas",
        items: [
          "Worktops and surfaces sanitised",
          "Ovens, fridges, and appliances cleaned",
          "Sinks and taps descaled",
          "Floors and drains thoroughly cleaned",
        ],
      },
      {
        title: "Bathrooms & Washrooms",
        items: [
          "Toilets and sinks disinfected",
          "Mirrors and fixtures polished",
          "Floors sanitized and mopped",
          "Supplies restocked and organised",
        ],
      },
      {
        title: "Staff & Operational Areas",
        items: [
          "Locker rooms and break areas cleaned",
          "Bins emptied and sanitised",
          "High-touch points disinfected",
          "Eco-friendly products used",
        ],
      },
    ],
  },

  // Post-Construction Cleaning
  "post-construction": {
    heroTitle: "Post-Construction Cleaning",
    heroSubtitle:
      "Comprehensive cleaning for newly built or renovated properties, removing dust, debris, and residues.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/contact", primary: true },
      { label: "Speak to Our Team", href: "/contact" },
    ],
    ctaPrimaryText:
      "We make your new or renovated property ready for handover, inspection, or occupation.",
    ctaSecondaryText:
      "Trusted by builders, contractors, and property developers.",
    featureCards: [
      {
        title: "Debris & Dust Removal",
        items: [
          "Vacuum and remove construction dust",
          "Sweep and mop all floors",
          "Clean walls and ceilings",
          "Remove stickers, labels, and residues",
        ],
      },
      {
        title: "Kitchen & Bathroom Focus",
        items: [
          "Cabinets wiped inside and out",
          "Sinks, taps, and appliances sanitised",
          "Tiles and grout cleaned",
          "Mirrors and glass polished",
        ],
      },
      {
        title: "Windows & Fixtures",
        items: [
          "Window frames and glass cleaned",
          "Doors and handles wiped",
          "Light fittings dusted",
          "Switches and sockets sanitised",
        ],
      },
      {
        title: "Final Touches",
        items: [
          "Odor removal and ventilation",
          "Bins emptied",
          "Eco-friendly cleaning solutions",
          "Inspection-ready results",
        ],
      },
    ],
  },

  // NHS / Healthcare & Clinical Cleaning
  "healthcare-cleaning": {
    heroTitle: "Healthcare & Clinical Cleaning",
    heroSubtitle:
      "Specialised cleaning services for hospitals, clinics, GP surgeries, and medical facilities.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/contact", primary: true },
      { label: "Speak to Our Team", href: "/contact" },
    ],
    ctaPrimaryText:
      "We maintain high-level hygiene standards to protect patients, staff, and visitors in healthcare environments.",
    ctaSecondaryText:
      "Trusted by NHS facilities, clinics, and private healthcare providers.",
    featureCards: [
      {
        title: "Patient & Clinical Areas",
        items: [
          "Disinfect high-touch surfaces",
          "Sanitise beds, trolleys, and equipment",
          "Floors thoroughly cleaned and mopped",
          "Waste safely disposed of",
        ],
      },
      {
        title: "Bathrooms & Toilets",
        items: [
          "Toilets, sinks, and showers disinfected",
          "Mirrors and fixtures polished",
          "Floors sanitised",
          "Supplies restocked as needed",
        ],
      },
      {
        title: "Staff & Waiting Areas",
        items: [
          "Desks and counters wiped",
          "Chairs and seating disinfected",
          "High-touch points sanitised",
          "Floors cleaned and mopped",
        ],
      },
      {
        title: "Compliance & Safety",
        items: [
          "Adherence to infection control standards",
          "Use of medical-grade cleaning products",
          "Fully trained and vetted staff",
          "Consistent inspection-ready results",
        ],
      },
    ],
  },

};
