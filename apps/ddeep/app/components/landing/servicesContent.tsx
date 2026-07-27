// app/components/landing/servicesContent.tsx
export interface FeatureCard {
  title: string;
  items: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceData {
  heroTitle: string;
  heroSubtitle: string;
  heroButtons: { label: string; href: string; primary?: boolean }[];
  featureCards: FeatureCard[];
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  faqs: FAQItem[];
  cities: string[];
  cityName?: string;
  whyChooseUs: string[]; // Unique value proposition points per service
}

export const servicesContent: Record<string, ServiceData> = {
  "regular-cleaning": {
    heroTitle: "Reliable Regular Cleaning",
    heroSubtitle: "Keep your home or workplace consistently clean with trusted professionals on a schedule that suits you.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/#contact", primary: true },
      { label: "Speak to Our Team", href: "/#contact" },
    ],
    ctaPrimaryText: "Our regular cleaning services maintain hygiene, comfort, and a spotless environment all year round.",
    ctaSecondaryText: "Trusted by households and businesses across the North West.",
    cities: ["Manchester", "Liverpool", "Salford", "Warrington", "Bolton", "Stockport", "Oldham"],
    whyChooseUs: [
      "Consistent weekly or fortnightly visits from your dedicated local cleaner",
      "Fully vetted, insured, and background-checked domestic cleaning professionals",
      "Customizable cleaning checklists tailored entirely to your household routine",
      "Eco-friendly products safe for children, pets, and sensitive surfaces"
    ],
    featureCards: [
      { title: "Living Areas & Workspaces", items: ["Dust and wipe all surfaces", "Vacuum carpets and rugs", "Mop hard floors", "Empty bins and replace liners"] },
      { title: "Kitchen Cleaning", items: ["Clean and sanitise worktops", "Wipe appliance exteriors", "Clean sinks and taps", "Disinfect high-touch areas"] },
      { title: "Bathrooms & Toilets", items: ["Clean and disinfect toilets", "Wash sinks, baths, and showers", "Polish mirrors and chrome", "Disinfect bathroom floors"] },
      { title: "Professional Standards", items: ["Weekly or fortnightly schedules", "Fully insured and vetted staff", "Tailored cleaning checklist", "Eco-friendly products available"] },
    ],
    faqs: [
      { question: "Do I have to be home during the regular clean?", answer: "No, you don't. Many of our clients provide us with a spare key or access code. All our cleaners are fully vetted and insured for your peace of mind." },
      { question: "Will I get the same cleaner every time?", answer: "Yes, we always aim to send the same cleaner for regular weekly or fortnightly visits to ensure consistency and build trust." },
      { question: "Which areas in Greater Manchester and Lancashire do you cover?", answer: "We cover the entire North West, including Manchester City Centre, Salford Quays, Trafford Park, Altrincham, Stockport, Bolton, and surrounding areas." }
    ]
  },

  "deep-cleaning": {
    heroTitle: "Deep Cleaning Services",
    heroSubtitle: "A thorough top-to-bottom clean designed to refresh, sanitise, and restore your space.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/#contact", primary: true },
      { label: "Speak to Our Team", href: "/#contact" },
    ],
    ctaPrimaryText: "Our deep cleaning service targets built-up dirt, grease, and bacteria for a complete reset.",
    ctaSecondaryText: "Ideal for homes, offices, inspections, and special occasions.",
    cities: ["Manchester", "Liverpool", "Salford", "Warrington", "Bolton", "Stockport", "Oldham"],
    whyChooseUs: [
      "Intensive detailing that targets hidden grime behind furniture and appliances",
      "Specialized heavy-duty lime-scale and grease removal treatments",
      "Professional-grade equipment and industrial sanitisation agents",
      "Comprehensive top-to-bottom property restoration for an immaculate finish"
    ],
    featureCards: [
      { title: "Full Property Deep Clean", items: ["All surfaces scrubbed and sanitised", "Skirting boards and doors cleaned", "Fixtures and fittings detailed", "Hard-to-reach areas covered"] },
      { title: "Kitchen Deep Clean", items: ["Oven and appliance deep cleaning", "Cupboards cleaned inside and out", "Grease and grime removal", "Descaling sinks and taps"] },
      { title: "Bathroom Descaling", items: ["Limescale removal", "Tiles and grout scrubbing", "Toilets and showers sanitised", "Mirrors and chrome polished"] },
      { title: "Hygiene Focus", items: ["High-touch areas disinfected", "Odour and bacteria removal", "Eco-friendly cleaning products", "Inspection-ready results"] },
    ],
    faqs: [
      { question: "What is the difference between a regular clean and a deep clean?", answer: "A deep clean is much more thorough. It includes hard-to-reach areas, inside cupboards, deep descaling of bathrooms, and intensive grease removal in the kitchen." },
      { question: "Do I need to provide the cleaning equipment?", answer: "No, our deep cleaning teams arrive fully equipped with professional-grade tools, detergents, and eco-friendly products." },
      { question: "How long does a deep clean take?", answer: "It depends on the size and condition of the property, but typically a full property deep clean takes between 4 to 8 hours." }
    ]
  },

  "end-of-tenancy-cleaning": {
    heroTitle: "End of Tenancy Cleaning",
    heroSubtitle: "Professional end of tenancy cleaning to ensure a smooth property handover.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/#contact", primary: true },
      { label: "Speak to Our Team", href: "/#contact" },
    ],
    ctaPrimaryText: "We clean every room to inspection-ready standards for tenants and landlords.",
    ctaSecondaryText: "Landlord and letting-agent approved cleaning service.",
    cities: ["Manchester", "Liverpool", "Salford", "Warrington", "Bolton", "Stockport", "Oldham"],
    whyChooseUs: [
      "Strict adherence to official inventory and letting agency check-out checklists",
      "Deposit back guarantee with professional cleaning certificate provided on completion",
      "Includes comprehensive deep oven cleaning and window glass detailing",
      "Fast turnaround times designed to match tight moving schedules"
    ],
    featureCards: [
      { title: "Kitchen & Appliances", items: ["Oven and hob deep cleaned", "Appliances cleaned inside and out", "Cupboards and drawers wiped", "Sinks and taps descaled"] },
      { title: "Bathrooms & Toilets", items: ["Full bathroom sanitisation", "Limescale and mould removal", "Tiles and grout scrubbed", "Floors disinfected"] },
      { title: "Living Areas & Bedrooms", items: ["Carpets vacuumed thoroughly", "Hard floors mopped", "Skirting boards wiped", "Internal doors cleaned"] },
      { title: "Move-Out Ready", items: ["Inspection-standard cleaning", "Flexible booking times", "Trusted by landlords", "Fast turnaround available"] },
    ],
    faqs: [
      { question: "Does your End of Tenancy cleaning guarantee deposit recovery?", answer: "Yes. Our End of Tenancy service follows a rigorous, agency-approved checklist designed to meet landlord requirements. A 'Cleaning Certificate' is provided upon completion." },
      { question: "Is oven cleaning included in the end of tenancy clean?", answer: "Yes, a deep professional oven clean is standard in all our end of tenancy packages." },
      { question: "Do you offer carpet cleaning alongside end of tenancy?", answer: "Yes, professional hot-water extraction carpet cleaning is an optional add-on that can be booked alongside your clean at a discounted rate." }
    ]
  },

  "office-cleaning": {
    heroTitle: "Professional Office Cleaning",
    heroSubtitle: "Maintain a clean, productive, and hygienic workplace with professional office cleaning.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/#contact", primary: true },
      { label: "Speak to Our Team", href: "/#contact" },
    ],
    ctaPrimaryText: "We keep offices clean, safe, and welcoming for staff and visitors.",
    ctaSecondaryText: "Trusted by offices and businesses across the North West.",
    cities: ["Manchester", "Liverpool", "Salford", "Warrington", "Bolton", "Stockport", "Oldham"],
    whyChooseUs: [
      "Flexible out-of-hours scheduling including early mornings, evenings, and weekends",
      "Strict key-holding security protocols managed by vetted commercial operatives",
      "Customized janitorial and washroom restocking management solutions",
      "Creates a pristine, health-compliant corporate environment for employees and clients"
    ],
    featureCards: [
      { title: "Workstations & Offices", items: ["Desks wiped and sanitised", "Chairs and surfaces cleaned", "Bins emptied", "Floors vacuumed or mopped"] },
      { title: "Shared Areas", items: ["Break rooms cleaned", "Kitchen areas sanitised", "Meeting rooms refreshed", "High-touch points disinfected"] },
      { title: "Restrooms & Hygiene", items: ["Toilets cleaned and disinfected", "Sinks and mirrors polished", "Supplies checked", "Floors sanitised"] },
      { title: "Reliable Service", items: ["Daily or weekly schedules", "Key-holder cleaning available", "Fully insured staff", "Consistent professional results"] },
    ],
    faqs: [
      { question: "Do you offer out-of-hours cleaning for offices?", answer: "Yes. Flexible scheduling including early mornings, late evenings, and weekends is available to minimize disruption to your staff." },
      { question: "Do you supply toilet rolls and hand soaps?", answer: "We can provide a complete washroom management service, supplying and restocking toilet rolls, hand towels, and soaps if requested." },
      { question: "Are your office cleaners insured?", answer: "Absolutely. All our commercial cleaners are fully insured, vetted, and trained in safe key-holding procedures." }
    ]
  },

  "student-accommodation": {
    heroTitle: "Student Accommodation Cleaning",
    heroSubtitle: "Affordable, reliable cleaning for student homes, flats, and shared accommodation.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/#contact", primary: true },
      { label: "Speak to Our Team", href: "/#contact" },
    ],
    ctaPrimaryText: "We help keep student living spaces clean, hygienic, and landlord-ready.",
    ctaSecondaryText: "Trusted by students, landlords, and letting agents.",
    cities: ["Manchester", "Liverpool", "Salford", "Warrington", "Bolton", "Stockport", "Oldham"],
    whyChooseUs: [
      "Specialized summer turnaround packages for high-volume student property portfolios",
      "Budget-friendly pricing tailored specifically to student tenant agreements",
      "Rigorous disinfection of communal kitchens, hallways, and private study rooms",
      "Guaranteed compliance with university accommodation inspection standards"
    ],
    featureCards: [
      { title: "Bedrooms & Living Areas", items: ["Dust and wipe surfaces", "Vacuum carpets", "Empty bins", "Floors cleaned"] },
      { title: "Shared Kitchens", items: ["Surfaces disinfected", "Appliances cleaned", "Bins emptied", "Grease and food residue removed"] },
      { title: "Bathrooms & Toilets", items: ["Full sanitisation", "Showers and sinks cleaned", "Mirrors polished", "Floors disinfected"] },
      { title: "Student-Friendly Service", items: ["Affordable pricing", "End-of-term cleaning", "Flexible scheduling", "Landlord-approved standards"] },
    ],
    faqs: [
      { question: "Are your cleaners vetted for Student Accommodation turnarounds?", answer: "Yes. All staff are fully vetted and background-checked. We ensure spotless rooms for high-volume student housing." },
      { question: "Can we book a one-off deep clean at the end of the term?", answer: "Yes, we specialize in summer turnarounds and end-of-term deep cleans to get the property ready for the next intake of students." },
      { question: "Do you only clean communal areas?", answer: "We offer both communal area cleaning (kitchens, hallways, shared bathrooms) and full bedroom cleans depending on your contract needs." }
    ]
  },

  "appliances-cleaning": {
    heroTitle: "Appliance Cleaning",
    heroSubtitle: "Professional appliance cleaning to restore hygiene and performance.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/#contact", primary: true },
      { label: "Speak to Our Team", href: "/#contact" },
    ],
    ctaPrimaryText: "Extend the life of your appliances with expert cleaning.",
    ctaSecondaryText: "Ideal for homes, landlords, and property managers.",
    cities: ["Manchester", "Liverpool", "Salford", "Warrington", "Bolton", "Stockport", "Oldham"],
    whyChooseUs: [
      "100% fume-free, non-caustic, and child-safe cleaning formulations",
      "Restores energy efficiency and heating performance across all white goods",
      "Expert removal of stubborn carbon deposits, burnt grease, and food odours",
      "Fully insured technicians protecting your kitchen fixtures and worktops"
    ],
    featureCards: [
      { title: "Oven & Hob Cleaning", items: ["Carbon and grease removal", "Glass and racks cleaned", "Control panels wiped", "Safe degreasing products"] },
      { title: "Fridge & Freezer", items: ["Interior sanitisation", "Shelves and drawers cleaned", "Odour removal", "Food-safe products used"] },
      { title: "Small Appliances", items: ["Microwave cleaning", "Kettle descaling", "Toaster crumb removal", "External surfaces polished"] },
      { title: "Professional Care", items: ["Eco-friendly solutions", "No damage to appliances", "Fully insured service", "Hygienic, safe results"] },
    ],
    faqs: [
      { question: "How long does a professional oven clean take?", answer: "A standard single oven usually takes about 1.5 to 2 hours. A large range cooker can take 3 to 4 hours." },
      { question: "Do you clean the extractor fan and filters?", answer: "Yes, our oven cleaning service includes degreasing the extractor hood and cleaning or replacing the filters if required." },
      { question: "Are the chemicals you use safe?", answer: "We use eco-friendly, non-caustic, and fume-free solutions inside your home, meaning your appliances are safe to use immediately after we finish." }
    ]
  },

  "carpet-cleaning": {
    heroTitle: "Professional Carpet Cleaning",
    heroSubtitle: "Revive carpets and rugs with deep professional carpet cleaning.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/#contact", primary: true },
      { label: "Speak to Our Team", href: "/#contact" },
    ],
    ctaPrimaryText: "We remove dirt, stains, and allergens for a fresh, long-lasting clean.",
    ctaSecondaryText: "Trusted by homes and offices across the North West.",
    cities: ["Manchester", "Liverpool", "Salford", "Warrington", "Bolton", "Stockport", "Oldham"],
    whyChooseUs: [
      "Advanced hot water extraction (steam cleaning) technology reaching deep into carpet fibers",
      "Specialized enzymatic spot treatments for stubborn pet urine and organic stains",
      "Rapid-drying extraction systems minimizing downtime for homes and busy offices",
      "Eliminates trapped allergens, dust mites, and bacteria to improve indoor air quality"
    ],
    featureCards: [
      { title: "Deep Carpet Cleaning", items: ["Deep fibre dirt removal", "High-traffic areas treated", "Professional equipment used", "Fresh finish restored"] },
      { title: "Stain & Odour Treatment", items: ["Targeted stain removal", "Odour neutralisation", "Pet stain treatment", "Spill and wear care"] },
      { title: "Health Benefits", items: ["Allergen reduction", "Dust mite removal", "Improved air quality", "Cleaner indoor environment"] },
      { title: "Efficient Service", items: ["Quick drying methods", "Eco-friendly products", "Suitable for homes & offices", "Fully insured professionals"] },
    ],
    faqs: [
      { question: "How does your Carpet Cleaning process work?", answer: "We use professional-grade hot water extraction (steam cleaning), removing deep-seated stains, allergens, and bacteria, while extending carpet life." },
      { question: "How long will my carpets take to dry?", answer: "Thanks to our high-powered extraction machines, most carpets will be dry and ready to walk on within 4 to 6 hours, depending on ventilation." },
      { question: "Can you remove pet stains and odours?", answer: "Yes, we use specialized enzymatic cleaners that break down pet urine and neutralize odours rather than just masking them." }
    ]
  },

  "bars-restaurants": {
    heroTitle: "Hospitality Cleaning Services",
    heroSubtitle: "Maintain spotless, hygienic, and welcoming environments for your guests.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/#contact", primary: true },
      { label: "Speak to Our Team", href: "/#contact" },
    ],
    ctaPrimaryText: "Our hospitality cleaning services ensure your premises meet the highest hygiene standards for staff and guests.",
    ctaSecondaryText: "Trusted by hotels, bars, and restaurants across the North West.",
    cities: ["Manchester", "Liverpool", "Salford", "Warrington", "Bolton", "Stockport", "Oldham"],
    whyChooseUs: [
      "Strict compliance protocols tailored for Environmental Health Officer (EHO) standards",
      "Overnight and pre-opening service schedules designed around hospitality operating hours",
      "Food-safe, certified sanitisation agents used across all food preparation areas",
      "Immaculate front-of-house glass, bar counters, and guest washroom detailing"
    ],
    featureCards: [
      { title: "Front of House", items: ["Floors vacuumed and mopped", "Tables, counters, and displays cleaned", "Glass and mirrors polished", "High-touch areas sanitised"] },
      { title: "Kitchens & Food Prep Areas", items: ["Worktops and surfaces sanitised", "Ovens, fridges, and appliances cleaned", "Sinks and taps descaled", "Floors and drains thoroughly cleaned"] },
      { title: "Bathrooms & Washrooms", items: ["Toilets and sinks disinfected", "Mirrors and fixtures polished", "Floors sanitized and mopped", "Supplies restocked and organised"] },
      { title: "Staff & Operational Areas", items: ["Locker rooms and break areas cleaned", "Bins emptied and sanitised", "High-touch points disinfected", "Eco-friendly products used"] },
    ],
    faqs: [
      { question: "Do you offer late-night or early-morning cleaning for venues?", answer: "Yes. Flexible scheduling including early mornings, late evenings, and overnight cleaning is available to ensure your venue is ready before opening." },
      { question: "Are your cleaning products food-safe?", answer: "Absolutely. We strictly adhere to commercial kitchen regulations and use food-safe, non-toxic sanitizers in all food preparation areas." },
      { question: "Do you provide one-off deep cleans for EHO inspections?", answer: "Yes, we offer intensive 'kitchen deep cleans' specifically designed to meet and exceed Environmental Health Officer standards." }
    ]
  },

  "post-construction": {
    heroTitle: "Post-Construction Cleaning",
    heroSubtitle: "Comprehensive cleaning for newly built or renovated properties.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/#contact", primary: true },
      { label: "Speak to Our Team", href: "/#contact" },
    ],
    ctaPrimaryText: "We make your new or renovated property ready for handover, inspection, or occupation.",
    ctaSecondaryText: "Trusted by builders, contractors, and property developers.",
    cities: ["Manchester", "Liverpool", "Salford", "Warrington", "Bolton", "Stockport", "Oldham"],
    whyChooseUs: [
      "CSCS certified cleaning operatives equipped with full site safety PPE",
      "Specialized removal of stubborn fine masonry dust, paint splatters, and silicone residues",
      "Detailed builder sparkle clean ensuring flawless handover readiness",
      "Collaborative scheduling working directly with main contractors and developers"
    ],
    featureCards: [
      { title: "Debris & Dust Removal", items: ["Vacuum and remove construction dust", "Sweep and mop all floors", "Clean walls and ceilings", "Remove stickers, labels, and residues"] },
      { title: "Kitchen & Bathroom Focus", items: ["Cabinets wiped inside and out", "Sinks, taps, and appliances sanitised", "Tiles and grout cleaned", "Mirrors and glass polished"] },
      { title: "Windows & Fixtures", items: ["Window frames and glass cleaned", "Doors and handles wiped", "Light fittings dusted", "Switches and sockets sanitised"] },
      { title: "Final Touches", items: ["Odor removal and ventilation", "Bins emptied", "Eco-friendly cleaning solutions", "Inspection-ready results"] },
    ],
    faqs: [
      { question: "What is included in a Post-Construction clean?", answer: "We remove fine masonry dust, paint splatters, silicone residue, and debris left by builders, ensuring the property is move-in ready." },
      { question: "Do you clean the exterior windows?", answer: "Yes, exterior and interior window cleaning (including removing paint specs and stickers from glass) can be included in your post-construction package." },
      { question: "Are your cleaners CSCS certified?", answer: "Yes, our post-construction teams hold the necessary site safety certifications and come equipped with all required PPE." }
    ]
  },

    "healthcare-cleaning": {
    heroTitle: "Healthcare & Clinical Cleaning",
    heroSubtitle: "Specialised cleaning services for hospitals, clinics, GP surgeries, and medical facilities.",
    heroButtons: [
      { label: "Get a Free Quote", href: "/#contact", primary: true },
      { label: "Speak to Our Team", href: "/#contact" },
    ],
    ctaPrimaryText: "We maintain high-level hygiene standards to protect patients, staff, and visitors.",
    ctaSecondaryText: "Trusted by NHS facilities, clinics, and private healthcare providers.",
    cities: ["Manchester", "Liverpool", "Salford", "Warrington", "Bolton", "Stockport", "Oldham"],
    whyChooseUs: [
      "Strict compliance with CQC (Care Quality Commission) infection control standards",
      "Medical-grade disinfectants proven to eliminate MRSA, pathogens, and viruses",
      "Rigorous cross-contamination prevention protocols and specialized waste handling",
      "Fully trained, vetted, and health-screened clinical cleaning specialists"
    ],
    featureCards: [
      { title: "Patient & Clinical Areas", items: ["Disinfect high-touch surfaces", "Sanitise beds, trolleys, and equipment", "Floors thoroughly cleaned and mopped", "Waste safely disposed of"] },
      { title: "Bathrooms & Toilets", items: ["Toilets, sinks, and showers disinfected", "Mirrors and fixtures polished", "Floors sanitised", "Supplies restocked as needed"] },
      { title: "Staff & Waiting Areas", items: ["Desks and counters wiped", "Chairs and seating disinfected", "High-touch points sanitised", "Floors cleaned and mopped"] },
      { title: "Compliance & Safety", items: ["Adherence to infection control standards", "Use of medical-grade cleaning products", "Fully trained and vetted staff", "Consistent inspection-ready results"] },
    ],
    faqs: [
      { question: "What standards do you follow for Healthcare & Clinical cleaning?", answer: "Hygiene is our priority. Our healthcare cleaning team is trained in infection control and cross-contamination prevention, strictly meeting CQC (Care Quality Commission) standards." },
      { question: "Do you provide clinical waste disposal?", answer: "We follow strict protocols for the safe handling and bagging of clinical waste, preparing it for your licensed medical waste disposal contractor." },
      { question: "What products do you use in clinical environments?", answer: "We use medical-grade, hospital-approved disinfectants that are proven to eliminate a broad spectrum of bacteria and viruses, including MRSA and COVID-19." }
    ]
  },
};
