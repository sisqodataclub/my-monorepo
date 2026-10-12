// app/components/landing/cityContent.ts
//
// PER-CITY CONTENT MODULE
// -----------------------------------------------------------------------------
// Single source of truth for genuinely unique per-city content: local areas /
// neighbourhoods, landmarks & local references, an intro paragraph, per-service
// blurbs, and city-specific FAQs. Consumed by:
//   - app/routes/locations.$city.tsx            (city hub)
//   - app/routes/services.$service.in.$city.tsx (city + service)
//   - app/components/landing/dynamic.tsx        (shared renderer)
//
// Key format: city slug exactly as it appears in app/utils/locations.ts
// -----------------------------------------------------------------------------

export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityContent {
  /** Display name, e.g. "Manchester". */
  name: string;
  /** 2-3 sentence intro paragraph, unique to the city. */
  intro: string;
  /** Named neighbourhoods / districts served in this city. */
  areas: string[];
  /** Local landmarks / references relevant to cleaning context. */
  landmarks: string[];
  /** Short line about local coverage / response for this city. */
  coverageNote: string;
  /** Per-service body blurb overrides, keyed by service slug. */
  serviceBlurbs: Record<string, string>;
  /** City-specific FAQs (distinct from the shared service FAQs). */
  faqs: CityFAQ[];
}

export const cityContent: Record<string, CityContent> = {
  manchester: {
    name: "Manchester",
    intro:
      "Manchester is our home city, and we clean everything from Victorian terraces in Levenshulme to glass-fronted apartments in the Northern Quarter. City-centre concierge buildings, student halls around Fallowfield, and busy family homes in Didsbury all get the same vetted, insured D DEEP team.",
    areas: [
      "Ancoats",
      "Northern Quarter",
      "Didsbury",
      "Chorlton",
      "Fallowfield",
      "Levenshulme",
      "Withington",
      "City Centre",
      "Hulme",
      "Moss Side",
    ],
    landmarks: [
      "Manchester Piccadilly and Victoria stations",
      "the Northern Quarter's converted mills and loft apartments",
      "the Etihad and Old Trafford matchday footfall",
      "the Oxford Road student corridor",
      "the Bridgewater Canal and Castlefield warehouses",
    ],
    coverageNote:
      "Same-week slots across M1-M21, with city-centre parking and concierge access already worked out for M1-M4 apartment blocks.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Manchester homes — from Northern Quarter apartments with hard-to-reach mezzanine floors to family houses in Chorlton and Didsbury.",
      "deep-cleaning":
        "Deep cleans built for Manchester's mix of period terraces and new-build apartments: limescale on hard water in older Ancoats stock, and builder's dust in recent Northern Quarter conversions.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans timed around Manchester's student contract changeover in Fallowfield, Withington and Hulme, with landlord-ready checklists.",
      "office-cleaning":
        "Contract office cleaning for Manchester city-centre offices and Spinningfields workspaces, scheduled around your core hours.",
      "student-accommodation":
        "Student house and halls cleaning across the Oxford Road corridor — Fallowfield, Withington and Rusholme — with summer turnaround slots.",
      "appliances-cleaning":
        "Oven, hob and extractor cleaning for Manchester kitchens, including the heavy grease left in busy shared student houses.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Manchester homes, from Victorian floorboards-and-rugs terraces to modern apartment carpet tiles.",
      "bars-restaurants":
        "Deep cleans for Manchester's Northern Quarter bars and Deansgate restaurants, done out of hours so you never lose a service.",
      "post-construction":
        "After-builders cleans for Manchester's constant stream of mill conversions and new-build apartments, removing plaster dust and paint splatter.",
    },
    faqs: [
      {
        question: "Do you clean apartments in Manchester city centre with concierge access?",
        answer:
          "Yes. We regularly clean in M1-M4 apartment blocks and are used to booking in with concierge, collecting keys, and working around building access rules in the Northern Quarter and Ancoats.",
      },
      {
        question: "Can you clean student houses in Fallowfield and Withington?",
        answer:
          "Yes — the Oxford Road student corridor is one of our busiest areas. We handle end-of-term and summer turnaround cleans for shared student houses in Fallowfield, Withington and Rusholme.",
      },
      {
        question: "How quickly can you get to a Manchester postcode?",
        answer:
          "Because Manchester is our base, we can usually offer same-week slots across M1-M21 and often same-day for urgent end-of-tenancy cleans in the city centre.",
      },
    ],
  },

  liverpool: {
    name: "Liverpool",
    intro:
      "From the waterfront apartments around the Albert Dock to family homes in Aigburth and Sefton Park, we clean across Liverpool with the same vetted, insured team. We know the city's mix of Georgian townhouses, converted warehouses in the Baltic Triangle, and modern student blocks around the universities.",
    areas: [
      "Baltic Triangle",
      "Sefton Park",
      "Aigburth",
      "Toxteth",
      "Anfield",
      "Everton",
      "Wavertree",
      "Kensington",
      "Waterfront / Albert Dock",
      "Smithdown",
    ],
    landmarks: [
      "the Albert Dock and Liverpool waterfront apartments",
      "the Baltic Triangle's converted warehouses and creative studios",
      "Anfield and Goodison Park matchday traffic",
      "the two Liverpool universities and their student quarter",
      "Sefton Park and Princes Park Georgian terraces",
    ],
    coverageNote:
      "Covering L1-L25, including waterfront apartment blocks and the student quarter around Smithdown Road and Wavertree.",
    serviceBlurbs: {
      "regular-cleaning":
        "Regular cleaning for Liverpool homes, from Baltic Triangle warehouse apartments to family houses around Sefton Park and Aigburth.",
      "deep-cleaning":
        "Deep cleans for Liverpool's older housing stock — Georgian terraces near Princes Park and dockland conversions where dust and limescale build up.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Liverpool's large student and rental market around Smithdown, Wavertree and Kensington, with deposit-friendly checklists.",
      "office-cleaning":
        "Office cleaning for Liverpool city-centre businesses and Baltic Triangle studios, scheduled around your working day.",
      "student-accommodation":
        "Student accommodation cleaning across the Liverpool university quarter — Smithdown Road, Wavertree and Kensington — including summer turnarounds.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Liverpool kitchens, including the shared kitchens common in the city's student houses.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Liverpool homes, from Aigburth family houses to waterfront apartment carpets.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Liverpool's Baltic Triangle bars and waterfront restaurants, so service is never interrupted.",
      "post-construction":
        "After-builders cleans for Liverpool's dockland and Baltic Triangle conversions, clearing plaster dust and paint from new interiors.",
    },
    faqs: [
      {
        question: "Do you clean apartments around the Albert Dock and Liverpool waterfront?",
        answer:
          "Yes. We clean waterfront apartments in the L1-L3 area and are used to working with building management and access arrangements around the Albert Dock.",
      },
      {
        question: "Can you handle end-of-tenancy cleans in the Liverpool student area?",
        answer:
          "Yes — Smithdown Road, Wavertree and Kensington are regular areas for us. We work to a deposit-friendly checklist so student tenants get the best chance of a full deposit return.",
      },
      {
        question: "Do you cover the wider Liverpool postcodes like Aigburth and Anfield?",
        answer:
          "We cover L1-L25, including Aigburth, Sefton Park, Anfield and Everton, so most of Liverpool is within our normal service area.",
      },
    ],
  },

  didsbury: {
    name: "Didsbury",
    intro:
      "Didsbury is one of Manchester's most sought-after suburbs, and its Victorian villas, converted flats and family homes need a cleaner who treats them properly. We work across East and West Didsbury, from the busy Burton Road strip to the quieter streets around Didsbury Park.",
    areas: [
      "East Didsbury",
      "West Didsbury",
      "Didsbury Village",
      "Burton Road",
      "Withington",
      "Fallowfield",
      "Burnage",
      "Chorlton",
      "Northenden",
      "Didsbury Park",
    ],
    landmarks: [
      "Didsbury Village and its independent shops and cafes",
      "the Burton Road bar and restaurant strip in West Didsbury",
      "Didsbury Park and Fletcher Moss Gardens",
      "the Victorian villas around Wilmslow Road",
      "the M20 and M19 commuter corridors into the city",
    ],
    coverageNote:
      "Covering M20, M19 and M21, including East and West Didsbury, Didsbury Village, Burnage and Northenden.",
    serviceBlurbs: {
      "regular-cleaning":
        "Regular cleaning for Didsbury homes, from Victorian villas around the village to flats on the Burton Road strip.",
      "deep-cleaning":
        "Deep cleans for Didsbury's period housing stock — original sash windows, high ceilings and older kitchens that need a proper top-to-bottom reset.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Didsbury's rental flats and houses, with a deposit-friendly checklist for landlords and tenants.",
      "office-cleaning":
        "Office cleaning for Didsbury's independent businesses and professional practices, scheduled around your opening hours.",
      "student-accommodation":
        "Student accommodation cleaning for the shared houses around Didsbury and Withington used by Manchester's student population.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Didsbury kitchens, from period ranges to modern integrated ovens.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Didsbury homes, including the original floorboards-and-rugs look common in Victorian villas.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Burton Road and Didsbury Village bars and restaurants, so service is never interrupted.",
      "post-construction":
        "After-builders cleans for Didsbury's loft conversions, extensions and refurbished period homes.",
    },
    faqs: [
      {
        question: "Do you clean the Victorian villas and period homes in Didsbury?",
        answer:
          "Yes — period homes are a large part of our Didsbury work. We're used to sash windows, original floorboards, high ceilings and older kitchens that need careful handling.",
      },
      {
        question: "Do you cover both East and West Didsbury?",
        answer:
          "We cover the whole of Didsbury, including East Didsbury, West Didsbury, the village and the surrounding M20 and M19 postcodes.",
      },
      {
        question: "Can you clean flats above the Burton Road shops?",
        answer:
          "Yes. We regularly clean flats and apartments along Burton Road and Didsbury Village, including those with restricted parking or shared entrances.",
      },
    ],
  },


  stockport: {
    name: "Stockport",
    intro:
      "Stockport's Victorian terraces, its growing cluster of town-centre apartments and the family streets of Heaton Moor and Bramhall all fall within our patch. We clean across the borough, from the Market Place regeneration area to the quieter suburbs on the Cheshire edge.",
    areas: [
      "Stockport Town Centre",
      "Heaton Moor",
      "Heaton Chapel",
      "Bramhall",
      "Cheadle",
      "Marple",
      "Romiley",
      "Reddish",
      "Davenport",
      "Edgeley",
    ],
    landmarks: [
      "Stockport Market Place and the town-centre regeneration",
      "the Stockport Viaduct and the M60",
      "Bramhall Park and the Cheshire border",
      "the Peak Forest Canal through Marple and Romiley",
      "Stockport's Victorian terraces and mill conversions",
    ],
    coverageNote:
      "Covering SK1-SK8, including Stockport town centre, Heaton Moor, Bramhall, Cheadle, Marple and Romiley.",
    serviceBlurbs: {
      "regular-cleaning":
        "Regular cleaning for Stockport homes, from town-centre apartments to family houses in Heaton Moor, Bramhall and Cheadle.",
      "deep-cleaning":
        "Deep cleans for Stockport's Victorian terraces and older housing stock, tackling limescale, kitchen grease and years of build-up.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Stockport's rental market around Edgeley, Reddish and the town centre, with deposit-friendly checklists.",
      "office-cleaning":
        "Office cleaning for Stockport town-centre businesses and the Cheadle and Bramhall business parks, scheduled around your hours.",
      "student-accommodation":
        "Student accommodation cleaning for the shared houses used by students commuting into Manchester from Stockport.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Stockport kitchens, including the heavy grease left in busy family and rental homes.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Stockport homes, from Edgeley terraces to larger Bramhall family houses.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Stockport's Market Place bars and Heaton Moor restaurants, keeping kitchens compliant.",
      "post-construction":
        "After-builders cleans for Stockport's town-centre regeneration and new-build homes around Cheadle and Bramhall.",
    },
    faqs: [
      {
        question: "Do you clean the older terraces in Stockport?",
        answer:
          "Yes — Stockport's Victorian and Edwardian terraces are a large part of our work. We're used to older plumbing, hard water and the quirks of period housing.",
      },
      {
        question: "Do you cover Bramhall and Cheadle as well as Stockport town centre?",
        answer:
          "We cover the whole SK1-SK8 area, including Bramhall, Cheadle, Heaton Moor, Marple and Romiley.",
      },
      {
        question: "Can you clean apartments in Stockport town centre?",
        answer:
          "Yes. The new apartment blocks around Stockport Market Place and the town centre are regular jobs for us, including concierge buildings.",
      },
    ],
  },

  salford: {
    name: "Salford",
    intro:
      "Salford stretches from the regenerated Quays to the terraces of Ordsall and the family streets of Swinton and Walkden, and we clean across all of it. MediaCityUK apartments, Salford Quays waterside flats and student housing around the University of Salford all get the same vetted, insured D DEEP team.",
    areas: [
      "Salford Quays",
      "MediaCityUK",
      "Ordsall",
      "Eccles",
      "Swinton",
      "Walkden",
      "Pendleton",
      "Worsley",
      "Monton",
      "Broughton",
    ],
    landmarks: [
      "MediaCityUK and the BBC/ITV studios",
      "The Lowry and the Salford Quays waterfront",
      "the Manchester Ship Canal and its Victorian docks",
      "the University of Salford's Peel Park campus",
      "Worsley Delph and the Bridgewater Canal",
    ],
    coverageNote:
      "Covering M3, M5, M6, M7, M27, M28, M30 and M50, from Salford Quays apartments to family homes in Worsley and Walkden, with same-week slots.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Salford homes, from MediaCityUK apartments with floor-to-ceiling glass to family houses in Monton and Worsley.",
      "deep-cleaning":
        "Deep cleans for Salford's mix of new Quays apartments and older Ordsall terraces, tackling limescale, kitchen grease and hard-to-reach corners.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Salford landlords and tenants, including the student changeover around the University of Salford and the Quays.",
      "office-cleaning":
        "Contract office cleaning for MediaCityUK and Salford Quays workspaces, scheduled around broadcast and studio hours.",
      "student-accommodation":
        "Student accommodation cleaning around the University of Salford's Peel Park and Frederick Road campuses, with summer turnaround slots.",
      "appliances-cleaning":
        "Oven, hob and appliance cleaning for Salford kitchens, including the heavy grease left in rental and student flats.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Salford homes, from Quays apartments to larger family houses in Worsley and Boothstown.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Salford Quays and Chapel Street bars and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Salford's ongoing regeneration projects around the Quays, Ordsall and Pendleton.",
    },
    faqs: [
      {
        question: "Do you clean apartments at Salford Quays and MediaCityUK?",
        answer:
          "Yes. We clean regularly across Salford Quays and MediaCityUK, including high-rise apartments with concierge access. We're used to working around building access rules and lift bookings.",
      },
      {
        question: "Can you clean student accommodation near the University of Salford?",
        answer:
          "Yes. We cover student houses and halls around Peel Park and Frederick Road, with summer turnaround cleans timed to the academic calendar for landlords and letting agents.",
      },
      {
        question: "How quickly can you quote for a Salford clean?",
        answer:
          "Most Salford quotes are issued within 24 hours of your enquiry, and we can usually offer a first clean within the same week across M3-M50.",
      },
    ],
  },
  trafford: {
    name: "Trafford",
    intro:
      "Trafford takes in everything from the terraces of Stretford and Old Trafford to the leafy family streets of Sale, Timperley and Hale. We clean across the borough — matchday lets near Old Trafford, family homes in Urmston, and professional apartments in Altrincham's town centre.",
    areas: [
      "Stretford",
      "Old Trafford",
      "Sale",
      "Urmston",
      "Timperley",
      "Hale",
      "Hale Barns",
      "Bowdon",
      "Partington",
      "Flixton",
    ],
    landmarks: [
      "Old Trafford stadium and the matchday footfall around it",
      "the Bridgewater Canal through Stretford and Sale",
      "Sale and Altrincham town centres and their Metrolink stops",
      "Dunham Massey and the Cheshire border villages",
      "the M60 and M56 corridors serving Trafford Park",
    ],
    coverageNote:
      "Covering M16, M17, M31, M32, M33, M41 and WA14-WA15, from Old Trafford terraces to Hale and Bowdon family homes, with same-week availability.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Trafford homes, from Stretford terraces to larger family houses in Sale, Timperley and Hale.",
      "deep-cleaning":
        "Deep cleans for Trafford's mix of period terraces and modern family homes, tackling limescale, kitchen grease and built-up grime.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Trafford landlords and letting agents, with a deposit-ready checklist for the M16-M41 and WA14-WA15 areas.",
      "office-cleaning":
        "Contract office cleaning for Trafford Park and Sale town-centre offices, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning around Trafford College and the Stretford campus, with summer turnaround slots for landlords.",
      "appliances-cleaning":
        "Oven, hob and appliance cleaning for Trafford kitchens, including heavy grease in rental and family properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Trafford homes, from Stretford terraces to larger houses in Hale Barns and Bowdon.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Trafford's bars and restaurants around Sale, Urmston and Altrincham, keeping kitchens compliant.",
      "post-construction":
        "After-builders cleans for Trafford's new-build and refurbishment projects across Stretford, Sale and Partington.",
    },
    faqs: [
      {
        question: "Do you clean homes near Old Trafford on matchdays?",
        answer:
          "Yes. We schedule around Old Trafford matchdays so cleaning visits to nearby homes and short-let properties aren't disrupted by traffic or parking restrictions.",
      },
      {
        question: "Do you cover the WA14 and WA15 postcodes in Trafford?",
        answer:
          "Yes. We cover Hale, Hale Barns, Bowdon and the wider WA14-WA15 area as part of our Trafford service, alongside M16-M41.",
      },
      {
        question: "How much does a regular clean in Trafford cost?",
        answer:
          "Trafford regular cleans typically start from £18 per hour depending on property size, frequency and whether appliances or carpets are included. We quote after a short call or on-site visit.",
      },
    ],
  },
  bury: {
    name: "Bury",
    intro:
      "Bury covers the town centre, the market and the surrounding townships of Radcliffe, Whitefield, Prestwich and Ramsbottom. We clean homes across the borough — Victorian terraces in Prestwich, family houses in Unsworth, and rentals around Bury's Metrolink stops.",
    areas: [
      "Bury Town Centre",
      "Prestwich",
      "Whitefield",
      "Radcliffe",
      "Ramsbottom",
      "Tottington",
      "Unsworth",
      "Ainsworth",
      "Besses o' th' Barn",
      "Sedgley Park",
    ],
    landmarks: [
      "Bury Market and the town-centre shopping streets",
      "the East Lancashire Railway heritage line through Ramsbottom",
      "the Metrolink Bury line and its park-and-ride stops",
      "the M66 corridor and Pilsworth industrial estates",
      "the West Pennine Moors on Bury's northern edge",
    ],
    coverageNote:
      "Covering BL0, BL8, BL9, M25, M26 and M45, from Prestwich terraces to family homes in Ramsbottom and Tottington, with a typical response time under 24 hours.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Bury homes, from Prestwich terraces to larger family houses in Ramsbottom and Unsworth.",
      "deep-cleaning":
        "Deep cleans for Bury's older terraces and family homes, tackling limescale, kitchen grease and grime in hard-to-reach corners.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Bury landlords and tenants, with a checklist built around deposit-return standards.",
      "office-cleaning":
        "Contract office cleaning for Bury town-centre firms and Pilsworth business parks, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning around Bury College and the Metrolink corridor, including summer turnaround cleans for landlords.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Bury kitchens, including the heavy grease left in rental and student properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Bury homes, from Prestwich terraces to larger houses in Tottington and Ainsworth.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Bury town-centre bars and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Bury's new-build and refurbishment projects around the town centre, Radcliffe and Whitefield.",
    },
    faqs: [
      {
        question: "Do you cover Prestwich and Whitefield as part of Bury?",
        answer:
          "Yes. Prestwich, Whitefield, Radcliffe and Ramsbottom are all part of our Bury service, alongside the town centre and the BL8-BL9 postcodes.",
      },
      {
        question: "Can you clean rentals near Bury Metrolink stops?",
        answer:
          "Yes. We clean rentals and short-lets across the Metrolink Bury line, including the park-and-ride areas, with end-of-tenancy and changeover cleans available.",
      },
      {
        question: "Are your Bury cleaners insured and vetted?",
        answer:
          "Every cleaner we send to Bury is DBS-checked, fully insured and trained on our documented cleaning schedule. Insurance certificates are available on request.",
      },
    ],
  },
  oldham: {
    name: "Oldham",
    intro:
      "Oldham spans the town centre, the surrounding townships of Chadderton, Failsworth, Royton and Shaw, and the Saddleworth villages on the edge of the Pennines. We clean homes across the borough — terraces in Hollinwood, family houses in Uppermill, and rentals near Oldham's Metrolink stops.",
    areas: [
      "Oldham Town Centre",
      "Chadderton",
      "Failsworth",
      "Royton",
      "Shaw",
      "Crompton",
      "Saddleworth",
      "Uppermill",
      "Hollinwood",
      "Lees",
    ],
    landmarks: [
      "Oldham town centre and the Tommyfield Market",
      "the Metrolink Oldham line and its park-and-ride stops",
      "Saddleworth Moor and the Pennine villages",
      "the M60 and M62 corridors serving Oldham's industrial estates",
      "Oldham Athletic's Boundary Park and the surrounding streets",
    ],
    coverageNote:
      "Covering OL1-OL9, M35 and Saddleworth's OL3 villages, from Hollinwood terraces to Uppermill family homes, with same-week slots.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Oldham homes, from town-centre terraces to family houses in Royton, Shaw and Saddleworth.",
      "deep-cleaning":
        "Deep cleans for Oldham's older terraces and family homes, tackling limescale, kitchen grease and hard-to-reach grime.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Oldham landlords and tenants, with a checklist built around deposit-return standards.",
      "office-cleaning":
        "Contract office cleaning for Oldham town-centre firms and the Broadway business parks, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning around Oldham College and the Metrolink corridor, with summer turnaround slots for landlords.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Oldham kitchens, including heavy grease left in rental and student properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Oldham homes, from town-centre terraces to larger houses in Saddleworth.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Oldham town-centre bars and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Oldham's new-build and refurbishment projects across Chadderton, Failsworth and Hollinwood.",
    },
    faqs: [
      {
        question: "Do you cover Saddleworth and Uppermill as part of Oldham?",
        answer:
          "Yes. Saddleworth, Uppermill, Lees and the OL3 villages are all part of our Oldham service, alongside the town centre and OL1-OL9.",
      },
      {
        question: "Can you clean rentals near Oldham Metrolink stops?",
        answer:
          "Yes. We clean rentals and short-lets along the Metrolink Oldham line, including the park-and-ride areas, with end-of-tenancy and changeover cleans available.",
      },
      {
        question: "How quickly can you quote for an Oldham clean?",
        answer:
          "Most Oldham quotes are issued within 24 hours of enquiry, and we can usually offer a first clean within the same week across OL1-OL9 and M35.",
      },
    ],
  },
  bolton: {
    name: "Bolton",
    intro:
      "Bolton is one of our core towns, and we clean across it — from the terraces around the town centre to family homes in Horwich, Westhoughton and Bromley Cross. Whether it's a rental near the university or a business unit off the M61, we bring the same vetted, insured team.",
    areas: [
      "Bolton Town Centre",
      "Horwich",
      "Westhoughton",
      "Bromley Cross",
      "Farnworth",
      "Kearsley",
      "Little Lever",
      "Astley Bridge",
      "Middlebrook",
      "Harwood",
    ],
    landmarks: [
      "Middlebrook retail and the Toughsheet Community Stadium",
      "Bolton town centre and the Market Place",
      "the M61 corridor and Middlebrook business parks",
      "the West Pennine Moors on Bolton's doorstep",
      "the University of Bolton and its student housing",
    ],
    coverageNote:
      "Covering BL1-BL7, including Bolton town centre, Middlebrook, Horwich and Westhoughton, with a typical response time of under 24 hours for new quotes.",
    serviceBlurbs: {
      "regular-cleaning":
        "Regular cleaning for Bolton homes, from town-centre terraces to family houses in Horwich, Westhoughton and Bromley Cross.",
      "deep-cleaning":
        "Deep cleans for Bolton's older terraces and family homes, tackling limescale, kitchen grease and built-up grime in hard-to-reach corners.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Bolton landlords and tenants, with a checklist built around deposit-return standards.",
      "office-cleaning":
        "Contract office cleaning for Bolton town-centre firms and Middlebrook business parks, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning around the University of Bolton, including summer turnaround cleans for landlords.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Bolton kitchens, including the heavy grease left in rental and student properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Bolton homes, from town-centre terraces to larger family houses in Harwood.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Bolton town-centre bars and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Bolton's new-build and refurbishment projects around Middlebrook and the town centre.",
    },
    faqs: [
      {
        question: "Do you clean offices in Bolton town centre outside normal working hours?",
        answer:
          "Yes. Most of our Bolton office cleaning contracts are delivered before 8am or after 6pm so cleaning doesn't disrupt your staff or visitors. We can also cover weekends across the BL1-BL7 area.",
      },
      {
        question: "How much does contract office cleaning cost in Bolton?",
        answer:
          "Bolton office cleaning contracts typically start from £50 per visit depending on floor area, frequency, and the number of washrooms and kitchens. We provide a free on-site survey and a fixed monthly price before you commit.",
      },
      {
        question: "Are your Bolton cleaners insured and vetted?",
        answer:
          "Every cleaner we send to Bolton is DBS-checked, fully insured, and trained on our documented cleaning schedule. We can provide insurance certificates and method statements on request.",
      },
    ],
  },
  rochdale: {
    name: "Rochdale",
    intro:
      "Rochdale sits just north of Manchester, and we clean right across the borough — from town-centre terraces to family homes in Heywood, Littleborough and Milnrow. Whether it's a rental near the college or a business unit off the M62, you get the same vetted, insured D DEEP team.",
    areas: [
      "Rochdale Town Centre",
      "Heywood",
      "Littleborough",
      "Milnrow",
      "Norden",
      "Bamford",
      "Spotland",
      "Wardle",
      "Kingsway",
      "Castleton",
    ],
    landmarks: [
      "Rochdale Town Hall and the Pioneers Museum",
      "the Rochdale Canal and its restored lock flights",
      "Spotland Stadium and the surrounding residential streets",
      "the M62 corridor and Kingsway business park",
      "Hollingworth Lake and the Pennine foothills",
    ],
    coverageNote:
      "Covering OL10-OL16 and M24, including Rochdale town centre, Heywood, Littleborough and Milnrow, with quotes typically returned within 24 hours.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Rochdale homes, from town-centre terraces to family houses in Norden, Bamford and Littleborough.",
      "deep-cleaning":
        "Deep cleans for Rochdale's older stone terraces and family homes, tackling limescale, kitchen grease and built-up grime in hard-to-reach corners.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Rochdale landlords and tenants, with a deposit-return checklist built around local letting-agent standards.",
      "office-cleaning":
        "Contract office cleaning for Rochdale town-centre firms and Kingsway business park, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning around Rochdale's colleges, including summer turnaround cleans for landlords.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Rochdale kitchens, including the heavy grease left in rental properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Rochdale homes, from town-centre terraces to larger family houses in Wardle.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Rochdale town-centre pubs and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Rochdale's new-build and refurbishment projects around Kingsway and the town centre.",
    },
    faqs: [
      {
        question: "Do you clean offices in Rochdale outside normal working hours?",
        answer:
          "Yes. Most of our Rochdale office cleaning contracts are delivered before 8am or after 6pm so cleaning doesn't disrupt your staff or visitors. We also cover weekends across OL10-OL16 and M24.",
      },
      {
        question: "How much does contract office cleaning cost in Rochdale?",
        answer:
          "Rochdale office cleaning contracts typically start from £45 per visit depending on floor area, frequency, and the number of washrooms and kitchens. We provide a free on-site survey and a fixed monthly price before you commit.",
      },
      {
        question: "Are your Rochdale cleaners insured and vetted?",
        answer:
          "Every cleaner we send to Rochdale is DBS-checked, fully insured, and trained on our documented cleaning schedule. We can provide insurance certificates and method statements on request.",
      },
    ],
  },
  preston: {
    name: "Preston",
    intro:
      "Preston is Lancashire's administrative hub, and we clean across it — from city-centre apartments near the university to family homes in Fulwood, Penwortham and Ashton. Whether it's a student rental or a business unit off the M6, you get the same vetted, insured D DEEP team.",
    areas: [
      "Preston City Centre",
      "Fulwood",
      "Penwortham",
      "Ashton-on-Ribble",
      "Ribbleton",
      "Deepdale",
      "Ingol",
      "Cottam",
      "Leyland",
      "Bamber Bridge",
    ],
    landmarks: [
      "Preston Railway Station and the Fishergate shopping district",
      "Deepdale Stadium and the surrounding residential streets",
      "the University of Central Lancashire (UCLan) campus",
      "the M6 and M55 corridors and their business parks",
      "the Ribble and its riverside walks at Avenham and Miller Park",
    ],
    coverageNote:
      "Covering PR1-PR5, including Preston city centre, Fulwood, Penwortham and Bamber Bridge, with quotes typically returned within 24 hours.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Preston homes, from city-centre apartments to family houses in Fulwood, Penwortham and Cottam.",
      "deep-cleaning":
        "Deep cleans for Preston's period terraces and new-build homes, tackling limescale, kitchen grease and built-up grime in hard-to-reach corners.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans timed around Preston's student contract changeover near UCLan, with landlord-ready checklists.",
      "office-cleaning":
        "Contract office cleaning for Preston city-centre offices and business parks, scheduled around your core hours.",
      "student-accommodation":
        "Student house and halls cleaning across the UCLan campus area — Fulwood, Ashton and Ribbleton — with summer turnaround slots.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Preston kitchens, including the heavy grease left in busy shared student houses.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Preston homes, from city-centre apartments to larger family houses in Fulwood.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Preston's city-centre bars and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Preston's new-build and refurbishment projects around Cottam and the city centre.",
    },
    faqs: [
      {
        question: "Do you clean offices in Preston outside normal working hours?",
        answer:
          "Yes. Most of our Preston office cleaning contracts are delivered before 8am or after 6pm so cleaning doesn't disrupt your staff or visitors. We also cover weekends across PR1-PR5.",
      },
      {
        question: "How much does contract office cleaning cost in Preston?",
        answer:
          "Preston office cleaning contracts typically start from £50 per visit depending on floor area, frequency, and the number of washrooms and kitchens. We provide a free on-site survey and a fixed monthly price before you commit.",
      },
      {
        question: "Are your Preston cleaners insured and vetted?",
        answer:
          "Every cleaner we send to Preston is DBS-checked, fully insured, and trained on our documented cleaning schedule. We can provide insurance certificates and method statements on request.",
      },
    ],
  },
  blackburn: {
    name: "Blackburn",
    intro:
      "Blackburn sits in the heart of East Lancashire, and we clean right across the town — from terraces near the cathedral to family homes in Darwen, Mellor and Pleasington. Whether it's a rental near the college or a business unit off the M65, you get the same vetted, insured D DEEP team.",
    areas: [
      "Blackburn Town Centre",
      "Darwen",
      "Mellor",
      "Pleasington",
      "Cherry Tree",
      "Mill Hill",
      "Witton",
      "Livesey",
      "Lower Darwen",
      "Rishton",
    ],
    landmarks: [
      "Blackburn Cathedral and the town-centre retail core",
      "Ewood Park and the surrounding residential streets",
      "the M65 corridor and its business parks",
      "Blackburn College and the town's student housing",
      "the Leeds and Liverpool Canal as it passes through the town",
    ],
    coverageNote:
      "Covering BB1-BB3 and BB2 (Darwen), including Blackburn town centre, Mill Hill, Cherry Tree and Pleasington, with quotes typically returned within 24 hours.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Blackburn homes, from town-centre terraces to family houses in Mellor, Pleasington and Cherry Tree.",
      "deep-cleaning":
        "Deep cleans for Blackburn's stone terraces and family homes, tackling limescale, kitchen grease and built-up grime in hard-to-reach corners.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Blackburn landlords and tenants, with a deposit-return checklist built around local letting-agent standards.",
      "office-cleaning":
        "Contract office cleaning for Blackburn town-centre firms and M65 business parks, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning around Blackburn College, including summer turnaround cleans for landlords.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Blackburn kitchens, including the heavy grease left in rental properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Blackburn homes, from town-centre terraces to larger family houses in Mellor.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Blackburn town-centre pubs and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Blackburn's new-build and refurbishment projects around the town centre and Darwen.",
    },
    faqs: [
      {
        question: "Do you clean offices in Blackburn outside normal working hours?",
        answer:
          "Yes. Most of our Blackburn office cleaning contracts are delivered before 8am or after 6pm so cleaning doesn't disrupt your staff or visitors. We also cover weekends across BB1-BB3.",
      },
      {
        question: "How much does contract office cleaning cost in Blackburn?",
        answer:
          "Blackburn office cleaning contracts typically start from £45 per visit depending on floor area, frequency, and the number of washrooms and kitchens. We provide a free on-site survey and a fixed monthly price before you commit.",
      },
      {
        question: "Are your Blackburn cleaners insured and vetted?",
        answer:
          "Every cleaner we send to Blackburn is DBS-checked, fully insured, and trained on our documented cleaning schedule. We can provide insurance certificates and method statements on request.",
      },
    ],
  },
  burnley: {
    name: "Burnley",
    intro:
      "Burnley is a proud East Lancashire town, and we clean right across it — from terraces near Turf Moor to family homes in Padiham, Worsthorne and Ightenhill. Whether it's a rental near the college or a business unit off the M65, you get the same vetted, insured D DEEP team.",
    areas: [
      "Burnley Town Centre",
      "Padiham",
      "Worsthorne",
      "Ightenhill",
      "Rosegrove",
      "Harle Syke",
      "Briercliffe",
      "Hapton",
      "Read",
      "Simonstone",
    ],
    landmarks: [
      "Turf Moor and the surrounding residential streets",
      "Burnley town centre and the Charter Walk shopping area",
      "the M65 corridor and its business parks",
      "Burnley College and the town's student housing",
      "the Leeds and Liverpool Canal and the Straight Mile embankment",
    ],
    coverageNote:
      "Covering BB10-BB12, including Burnley town centre, Padiham, Worsthorne and Ightenhill, with quotes typically returned within 24 hours.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Burnley homes, from town-centre terraces to family houses in Padiham, Worsthorne and Ightenhill.",
      "deep-cleaning":
        "Deep cleans for Burnley's stone terraces and family homes, tackling limescale, kitchen grease and built-up grime in hard-to-reach corners.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Burnley landlords and tenants, with a deposit-return checklist built around local letting-agent standards.",
      "office-cleaning":
        "Contract office cleaning for Burnley town-centre firms and M65 business parks, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning around Burnley College, including summer turnaround cleans for landlords.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Burnley kitchens, including the heavy grease left in rental properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Burnley homes, from town-centre terraces to larger family houses in Ightenhill.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Burnley town-centre pubs and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Burnley's new-build and refurbishment projects around Padiham and the town centre.",
    },
    faqs: [
      {
        question: "Do you clean offices in Burnley outside normal working hours?",
        answer:
          "Yes. Most of our Burnley office cleaning contracts are delivered before 8am or after 6pm so cleaning doesn't disrupt your staff or visitors. We also cover weekends across BB10-BB12.",
      },
      {
        question: "How much does contract office cleaning cost in Burnley?",
        answer:
          "Burnley office cleaning contracts typically start from £45 per visit depending on floor area, frequency, and the number of washrooms and kitchens. We provide a free on-site survey and a fixed monthly price before you commit.",
      },
      {
        question: "Are your Burnley cleaners insured and vetted?",
        answer:
          "Every cleaner we send to Burnley is DBS-checked, fully insured, and trained on our documented cleaning schedule. We can provide insurance certificates and method statements on request.",
      },
    ],
  },
  warrington: {
    name: "Warrington",
    intro:
      "Warrington sits halfway between Manchester and Liverpool, and we clean everything from Victorian terraces near the town centre to new-build family homes in Chapelford and Great Sankey. Business parks around Birchwood and Omega get the same vetted, insured D DEEP team as the residential streets on the other side of the Mersey.",
    areas: [
      "Town Centre",
      "Great Sankey",
      "Chapelford",
      "Stockton Heath",
      "Birchwood",
      "Padgate",
      "Latchford",
      "Grappenhall",
      "Appleton",
      "Orford",
    ],
    landmarks: [
      "Warrington Bank Quay and Central stations",
      "the M62 and M6 interchange at Croft",
      "Omega and Birchwood business parks",
      "Warrington town centre and Golden Square shopping centre",
      "the Manchester Ship Canal and River Mersey waterfront",
    ],
    coverageNote:
      "Covering WA1-WA5, including Stockton Heath, Great Sankey, Birchwood and Chapelford, with quotes typically returned within 24 hours.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Warrington homes, from town-centre terraces to larger family houses in Stockton Heath and Appleton.",
      "deep-cleaning":
        "Deep cleans for Warrington's mix of Victorian terraces and new-builds, tackling hard-water limescale, kitchen grease and built-up grime.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Warrington landlords and tenants, with a deposit-return checklist built around local letting-agent standards.",
      "office-cleaning":
        "Contract office cleaning for Warrington firms around Birchwood, Omega and the town centre, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning near Warrington's colleges and commuter links, including summer turnaround cleans for landlords.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Warrington kitchens, including the heavy grease left in rental properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Warrington homes, from town-centre terraces to larger family houses in Grappenhall.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Warrington town-centre and Stockton Heath pubs and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Warrington's new-build and refurbishment projects around Chapelford and Omega.",
    },
    faqs: [
      {
        question: "Do you cover both Warrington town centre and the outlying villages?",
        answer:
          "Yes. We cover WA1-WA5, including Stockton Heath, Great Sankey, Birchwood, Padgate, Latchford, Grappenhall, Appleton and Chapelford, so both central and outlying Warrington addresses are covered.",
      },
      {
        question: "How much does contract office cleaning cost in Warrington?",
        answer:
          "Warrington office cleaning contracts typically start from £45 per visit depending on floor area, frequency, and the number of washrooms and kitchens. We provide a free on-site survey and a fixed monthly price before you commit.",
      },
      {
        question: "Are your Warrington cleaners insured and vetted?",
        answer:
          "Every cleaner we send to Warrington is DBS-checked, fully insured, and trained on our documented cleaning schedule. We can provide insurance certificates and method statements on request.",
      },
    ],
  },
  wigan: {
    name: "Wigan",
    intro:
      "Wigan spans the borough from the town centre to Standish, Ashton-in-Makerfield and the Leigh side, and we clean the full range — Victorian terraces, 1930s semis, and newer estates. Whether it's a family home near Mesnes Park or a business unit off the M6, the same vetted, insured D DEEP team turns up.",
    areas: [
      "Town Centre",
      "Standish",
      "Ashton-in-Makerfield",
      "Leigh",
      "Hindley",
      "Atherton",
      "Golborne",
      "Orrell",
      "Pemberton",
      "Shevington",
    ],
    landmarks: [
      "Wigan Wallgate and North Western stations",
      "the DW Stadium and Robin Park",
      "Mesnes Park and Haigh Hall",
      "the M6, M58 and A580 East Lancashire Road",
      "Wigan town centre and the Grand Arcade",
    ],
    coverageNote:
      "Covering WN1-WN5, including Standish, Ashton-in-Makerfield, Hindley, Atherton and Orrell, with quotes typically returned within 24 hours.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Wigan homes, from town-centre terraces to family houses in Standish, Orrell and Shevington.",
      "deep-cleaning":
        "Deep cleans for Wigan's Victorian terraces and 1930s semis, tackling limescale, kitchen grease and grime in hard-to-reach corners.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Wigan landlords and tenants, with a deposit-return checklist built around local letting-agent standards.",
      "office-cleaning":
        "Contract office cleaning for Wigan town-centre firms and business units along the A580 and M6, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning near Wigan's colleges and commuter links, including summer turnaround cleans for landlords.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Wigan kitchens, including the heavy grease left in rental properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Wigan homes, from town-centre terraces to larger family houses in Standish and Orrell.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Wigan town-centre pubs and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Wigan's new-build and refurbishment projects around Standish and the Leigh side.",
    },
    faqs: [
      {
        question: "Do you cover Leigh and Ashton-in-Makerfield as well as Wigan town centre?",
        answer:
          "Yes. We cover WN1-WN5, including Standish, Ashton-in-Makerfield, Leigh, Hindley, Atherton, Golborne, Orrell, Pemberton and Shevington, so the whole Wigan borough is covered.",
      },
      {
        question: "How much does contract office cleaning cost in Wigan?",
        answer:
          "Wigan office cleaning contracts typically start from £45 per visit depending on floor area, frequency, and the number of washrooms and kitchens. We provide a free on-site survey and a fixed monthly price before you commit.",
      },
      {
        question: "Are your Wigan cleaners insured and vetted?",
        answer:
          "Every cleaner we send to Wigan is DBS-checked, fully insured, and trained on our documented cleaning schedule. We can provide insurance certificates and method statements on request.",
      },
    ],
  },
  chorley: {
    name: "Chorley",
    intro:
      "Chorley has grown fast — the old mill town now sits alongside new-build estates in Buckshaw Village and Adlington. We clean both: period terraces near the town centre and modern family homes across the borough, with the same vetted, insured D DEEP team.",
    areas: [
      "Town Centre",
      "Buckshaw Village",
      "Adlington",
      "Coppull",
      "Euxton",
      "Astley Village",
      "Clayton-le-Woods",
      "Heapey",
      "Brinscall",
      "Charnock Richard",
    ],
    landmarks: [
      "Chorley railway station and the M61 corridor",
      "Buckshaw Village and its new-build estates",
      "Astley Park and Astley Hall",
      "Chorley town centre and the Market Walk shopping area",
      "the Leeds and Liverpool Canal and Yarrow Valley Country Park",
    ],
    coverageNote:
      "Covering PR6-PR7, including Buckshaw Village, Adlington, Coppull, Euxton and Clayton-le-Woods, with quotes typically returned within 24 hours.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Chorley homes, from town-centre terraces to family houses in Adlington and Clayton-le-Woods.",
      "deep-cleaning":
        "Deep cleans for Chorley's period terraces and new-builds, tackling limescale, kitchen grease and builder's dust in recent conversions.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for Chorley landlords and tenants, with a deposit-return checklist built around local letting-agent standards.",
      "office-cleaning":
        "Contract office cleaning for Chorley town-centre firms and Buckshaw Village business units, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning near Chorley's colleges and commuter links, including summer turnaround cleans for landlords.",
      "appliances-cleaning":
        "Oven and appliance cleaning for Chorley kitchens, including the heavy grease left in rental properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Chorley homes, from town-centre terraces to larger family houses in Euxton and Brinscall.",
      "bars-restaurants":
        "Out-of-hours deep cleans for Chorley town-centre pubs and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for Chorley's new-build and refurbishment projects around Buckshaw Village and Clayton-le-Woods.",
    },
    faqs: [
      {
        question: "Do you clean new-builds in Buckshaw Village as well as older Chorley homes?",
        answer:
          "Yes. We cover both — period terraces near the town centre and newer estates in Buckshaw Village, Adlington and Clayton-le-Woods. New-builds often need a post-construction or initial deep clean, which we handle as standard.",
      },
      {
        question: "How much does contract office cleaning cost in Chorley?",
        answer:
          "Chorley office cleaning contracts typically start from £45 per visit depending on floor area, frequency, and the number of washrooms and kitchens. We provide a free on-site survey and a fixed monthly price before you commit.",
      },
      {
        question: "Are your Chorley cleaners insured and vetted?",
        answer:
          "Every cleaner we send to Chorley is DBS-checked, fully insured, and trained on our documented cleaning schedule. We can provide insurance certificates and method statements on request.",
      },
    ],
  },
  "st-helens": {
    name: "St Helens",
    intro:
      "St Helens is a town of contrasts — Victorian terraces close to the town centre, larger family homes out towards Eccleston and Rainford, and business parks along the A580. We clean all of it with the same vetted, insured D DEEP team, whether it's a rental turnaround or a regular home clean.",
    areas: [
      "Town Centre",
      "Eccleston",
      "Rainford",
      "Rainhill",
      "Haydock",
      "Newton-le-Willows",
      "Billinge",
      "Sutton",
      "Thatto Heath",
      "Moss Bank",
    ],
    landmarks: [
      "St Helens Central station and the A580 East Lancashire Road",
      "Haydock Park Racecourse and the M6 corridor",
      "St Helens town centre and the Church Square shopping area",
      "the Dream sculpture and Sutton Manor",
      "Taylor Park and Sherdley Park",
    ],
    coverageNote:
      "Covering WA9-WA11, including Eccleston, Rainford, Rainhill, Haydock and Newton-le-Willows, with quotes typically returned within 24 hours.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for St Helens homes, from town-centre terraces to family houses in Eccleston and Rainford.",
      "deep-cleaning":
        "Deep cleans for St Helens' Victorian terraces and larger family homes, tackling limescale, kitchen grease and grime in hard-to-reach corners.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans for St Helens landlords and tenants, with a deposit-return checklist built around local letting-agent standards.",
      "office-cleaning":
        "Contract office cleaning for St Helens town-centre firms and Haydock business parks, scheduled before 8am or after 6pm.",
      "student-accommodation":
        "Student accommodation cleaning near St Helens' colleges and commuter links, including summer turnaround cleans for landlords.",
      "appliances-cleaning":
        "Oven and appliance cleaning for St Helens kitchens, including the heavy grease left in rental properties.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for St Helens homes, from town-centre terraces to larger family houses in Rainhill and Billinge.",
      "bars-restaurants":
        "Out-of-hours deep cleans for St Helens town-centre pubs and restaurants, keeping kitchens and front-of-house compliant.",
      "post-construction":
        "After-builders cleans for St Helens' new-build and refurbishment projects around Eccleston and Newton-le-Willows.",
    },
    faqs: [
      {
        question: "Do you cover Newton-le-Willows and Rainford as well as St Helens town centre?",
        answer:
          "Yes. We cover WA9-WA11, including Eccleston, Rainford, Rainhill, Haydock, Newton-le-Willows, Billinge, Sutton, Thatto Heath and Moss Bank, so the whole St Helens borough is covered.",
      },
      {
        question: "How much does contract office cleaning cost in St Helens?",
        answer:
          "St Helens office cleaning contracts typically start from £45 per visit depending on floor area, frequency, and the number of washrooms and kitchens. We provide a free on-site survey and a fixed monthly price before you commit.",
      },
      {
        question: "Are your St Helens cleaners insured and vetted?",
        answer:
          "Every cleaner we send to St Helens is DBS-checked, fully insured, and trained on our documented cleaning schedule. We can provide insurance certificates and method statements on request.",
      },
    ],
  },
};

/**
 * Look up per-city content by slug. Returns undefined for cities we have not
 * yet authored unique content for, so callers can fall back gracefully.
 */
export function getCityContent(citySlug: string): CityContent | undefined {
  return cityContent[citySlug];
}
