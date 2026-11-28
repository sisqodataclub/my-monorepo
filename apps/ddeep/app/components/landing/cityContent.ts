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
  /** Optional per-city H1 override (used on the city+service page). */
  h1?: string;
  /** Optional per-service SEO overrides keyed by service slug. */
  serviceSeo?: Record<string, { title?: string; description?: string; keywords?: string; h1?: string }>;
  /** Optional long-form dynamic sections rendered on the city page when present. */
  dynamicSections?: { story?: string; process?: string; areas?: string; reviews?: string };
}

export const cityContent: Record<string, CityContent> = {
  manchester: {
    name: "Manchester",
    intro:
      "D DEEP is a Manchester company, not a national franchise — our base at 48a Gill Street, M9 puts a vetted two-person deep-cleaning team within 30 minutes of most M-postcodes. We work the city's real housing stock: Victorian terraces in Levenshulme and Withington with original sash windows and decades of coal-smoke grime, converted mill apartments in the Northern Quarter where builder's dust settles into exposed brick, and the Ancoats new-builds where hard water has already started furring up the shower glass. One fixed price, one written checklist, no hourly creep.",
    areas: [
      "City Centre",
      "Northern Quarter",
      "Ancoats",
      "New Islington",
      "Hulme",
      "Moss Side",
      "Fallowfield",
      "Withington",
      "Levenshulme",
      "Chorlton",
      "Didsbury",
      "Openshaw",
      "Gorton",
      "Moston",
      "Harpurhey",
      "Cheetham Hill",
      "Middleton",
      "Oldham",
    ],
    landmarks: [
      "Piccadilly and Victoria stations",
      "the Northern Quarter's converted mills and loft apartments",
      "the Etihad and Old Trafford matchday footfall",
      "the Oxford Road student corridor",
      "the Bridgewater Canal and Castlefield warehouses",
    ],
    coverageNote:
      "Same-week slots across M1-M21, with city-centre parking and concierge access already worked out for M1-M4 apartment blocks.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for local homes — from Northern Quarter apartments with hard-to-reach mezzanine floors to family houses in Chorlton, Didsbury and Sale, with flexible M-postcode scheduling.",
      "deep-cleaning":
        "Deep cleaning in Manchester means four different jobs depending on the postcode. In Ancoats and New Islington new-builds it is hard-water descaling — M4 water leaves visible scale on shower screens, kettles and tap bases within months. In Northern Quarter mill conversions it is fine builder's dust that has settled into exposed brickwork, steel beams and window reveals since handover. In Fallowfield and Withington student terraces it is the end-of-year grease film on kitchen units, hobs and extractor hoods that a standard clean will not shift. In Levenshulme and Withington Victorian terraces it is original sash windows, deep skirting and the grime that collects behind radiators nobody has moved in a decade. Our team is based at 48a Gill Street, M9, so we know which of those jobs we are walking into before we knock.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans timed around the student contract changeover in Fallowfield, Withington, Hulme and Rusholme, with landlord-ready checklists accepted by letting agents across the region.",
      "office-cleaning":
        "Contract office cleaning for city-centre offices and Spinningfields workspaces, scheduled around your core hours.",
      "student-accommodation":
        "Student house and halls cleaning across the Oxford Road corridor — Fallowfield, Withington and Rusholme — with summer turnaround slots.",
      "appliances-cleaning":
        "Oven, hob and extractor cleaning for local kitchens, including the heavy grease left in busy shared student houses.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for local homes, from Victorian floorboards-and-rugs terraces to modern apartment carpet tiles.",
      "bars-restaurants":
        "Deep cleans for Northern Quarter bars and Deansgate restaurants, done out of hours so you never lose a service.",
      "post-construction":
        "After-builders cleans for the constant stream of mill conversions and new-build apartments, removing plaster dust and paint splatter.",
    },
    serviceSeo: {
      "deep-cleaning": {
        title: "Deep Cleaning Manchester | Fixed-Price Deep Cleans | D DEEP",
        description:
          "Deep cleaning in Manchester from a Manchester-based team at 48a Gill Street, M9. Fixed prices, DBS-checked cleaners, same-week slots across M1-M21. Free quote in minutes.",
        keywords:
          "deep cleaning Manchester, deep clean Manchester, professional deep cleaning Manchester, deep cleaning services Manchester, same day deep cleaning Manchester, end of tenancy deep clean Manchester, commercial deep cleaning Manchester, deep cleaning Ancoats, deep cleaning Northern Quarter, deep cleaning Levenshulme, deep cleaning Withington",
        h1: "Deep Cleaning Manchester"
      },
    },
    dynamicSections: {
      story:
        "Manchester terraces are not like anywhere else in the UK. The Levenshulme and Withington stock is mostly 1890s-1910s red-brick with original sash windows, high ceilings and cast-iron fireplaces — beautiful, but every one of those windows has 100+ years of coal-smoke and road grime baked into the frame, and the skirting is deep enough that a normal mop never touches it. Northern Quarter mill apartments are the opposite problem: converted in the last 20 years, but with exposed brick, steel columns and original timber floors that trap fine builder's dust for years after handover. Ancoats and New Islington new-builds look pristine until you notice the M4 hard water has already started clouding the shower glass. We clean all three properly because we live here.",
      process:
        "Every Manchester deep clean is a fixed-price, two-person job with a written checklist agreed before we start. We arrive with the kit for the specific job — descaler for M-postcode hard water, HEPA extraction for mill-conversion dust, heavy-degreaser for Fallowfield and Withington student kitchens, and detail brushes for Victorian sash windows and deep skirting. Typical Manchester properties take 4-7 hours for a full deep clean; a one-bed Ancoats apartment is usually 3-4 hours, a four-bed Withington terrace is 6-8. No hourly surprises.",
      areas:
        "We work the full local spread: the city centre and Northern Quarter (M1-M4), Ancoats and New Islington (M4), Hulme and Moss Side (M15/M14), Fallowfield and Withington (M14/M20), Levenshulme (M19), Chorlton (M21), Didsbury (M20), and the M11-M13 corridor out through Openshaw and Gorton — plus Moston (M40), Harpurhey (M9), Cheetham Hill (M8), Middleton (M24) and out to Oldham. City-centre and Northern Quarter jobs are usually weekday-daytime for offices and early-evening for apartments; family homes in Chorlton and Didsbury tend to book weekday mornings; student lets around Fallowfield and Withington cluster around term start, end of tenancy and the summer changeover window.",
      reviews:
        "Manchester customers book us because we turn up when we say we will, quote a fixed price up front, and know the difference between an Ancoats new-build and a Levenshulme terrace without being told. DBS-checked, fully insured, and based at 48a Gill Street, M9 — not a call centre in another city.",
    },
    faqs: [
      {
        question: "How much does deep cleaning in Manchester cost?",
        answer:
          "Deep cleaning in Manchester is priced per job, not per hour. A one-bed Ancoats or Northern Quarter apartment is typically £180-£260; a two-bed Withington or Levenshulme terrace is £260-£360; a four-bed Fallowfield student house is £380-£520. You get a fixed written quote before we start — the price does not move if the job takes longer than expected.",
      },
      {
        question: "Can you do same day deep cleaning in Manchester?",
        answer:
          "Often yes, subject to slots. Because our team is based at 48a Gill Street, M9, we can usually reach any M-postcode within 30 minutes. Call before 10am and we can frequently fit a same-day deep clean in the city centre, Ancoats, Northern Quarter, Hulme or Fallowfield.",
      },
      {
        question: "Do you offer end of tenancy deep cleans in Manchester?",
        answer:
          "Yes — end of tenancy deep cleans are one of our most-booked Manchester jobs. We follow a landlord and letting-agent checklist that covers oven interior, extractor, inside cupboards, limescale descaling, skirting, internal windows and grout. Accepted by agents across Fallowfield, Withington, Hulme, Rusholme, Levenshulme and the city centre.",
      },
      {
        question: "Do you provide commercial deep cleaning in Manchester?",
        answer:
          "Yes. We deep clean Northern Quarter bars, Deansgate restaurants, Spinningfields offices, Ancoats co-working spaces and retail units, usually out of hours so you do not lose a service day. Commercial deep cleans are quoted per site after a short walkthrough.",
      },
      {
        question: "Do you clean apartments in the city centre with concierge access?",
        answer:
          "Yes. We are used to M1-M4 concierge buildings — we coordinate access in advance, carry the right insurance paperwork for building management, and can work around lift-booking restrictions. Northern Quarter mill apartments with mezzanine floors and exposed brick are a standard job for us.",
      },
      {
        question: "Can you clean student houses in Fallowfield and Withington?",
        answer:
          "Yes — Fallowfield and Withington student terraces are a big part of what we do. We handle the end-of-year grease film on kitchen units and hobs, the mould that builds up in shared bathrooms over winter, and the summer changeover clean before the next intake. Book early for the June-September window.",
      },
      {
        question: "How quickly can you get to a local postcode?",
        answer:
          "We are based at 48a Gill Street, M9, so most M-postcodes are within 30 minutes. M1-M4 city centre and Ancoats, M14/M20 Fallowfield and Withington, M19 Levenshulme, M21 Chorlton and M9/M8/M40 north Manchester are all routine same-week or same-day jobs.",
      },
      {
        question: "Do you offer end-of-tenancy cleaning here, and will it pass a landlord inspection?",
        answer:
          "Yes. Our end-of-tenancy clean follows the checklist most Manchester letting agents and landlords use, and we will re-attend free within 72 hours if an agent flags anything we missed on the agreed list. We have done this for hundreds of Fallowfield, Withington and city-centre tenancies.",
      },
      {
        question: "What is included in a deep clean, and how is it different from a regular clean?",
        answer:
          "A Manchester deep clean includes everything a regular clean does plus the jobs a regular clean skips: oven interior, extractor hood and filter, inside cupboards and wardrobes, limescale descaling of shower glass, taps and kettles, grout scrubbing, skirting boards, internal windows, door frames, behind radiators and furniture, and the tops of high cupboards. In a Levenshulme or Withington Victorian terrace that also means the original sash window frames and deep skirting; in an Ancoats new-build it means full hard-water descaling.",
      },
      {
        question: "Do you clean offices and commercial spaces in Manchester city centre?",
        answer:
          "Yes — Spinningfields offices, Northern Quarter studios, Ancoats co-working spaces and Deansgate retail. We work evenings and weekends so your team is not disrupted, and we can set up a recurring commercial deep-clean schedule.",
      },
      {
        question: "Are your cleaners DBS-checked and insured?",
        answer:
          "Every D DEEP cleaner is DBS-checked, fully insured and directly employed — not subcontracted. We can provide DBS certificates and insurance documents on request, which most Manchester concierge buildings and letting agents ask for.",
      },
      {
        question: "Can you do same-day or emergency cleans locally?",
        answer:
          "Often yes. Emergency deep cleans — sudden move-out, pre-inspection, post-party, flood or spill — are usually possible same-day across the city centre, Ancoats, Northern Quarter, Hulme, Fallowfield and Withington. Call us and we will tell you honestly what is available.",
      },
      {
        question: "How much does cleaning cost here, and do you charge by the hour or by the job?",
        answer:
          "We quote by the job, not by the hour. That means the price you are given is the price you pay, even if the property is dirtier than expected. Hourly cleaning is available for regular domestic cleans, but deep cleans and end-of-tenancy cleans are always fixed-price.",
      },
      {
        question: "Which local areas do you cover?",
        answer:
          "We cover the whole of Greater Manchester: city centre and Northern Quarter (M1-M4), Ancoats and New Islington (M4), Hulme and Moss Side (M15/M14), Fallowfield and Withington (M14/M20), Levenshulme (M19), Chorlton (M21), Didsbury (M20), Openshaw and Gorton (M11-M13), Moston (M40), Harpurhey (M9), Cheetham Hill (M8), Middleton (M24) and out to Oldham.",
      },
      {
        question: "What happens if I am not happy with the clean?",
        answer:
          "Tell us within 72 hours and we will come back and re-clean the affected areas at no cost. We are Manchester-based, so a re-visit is a short drive, not a complaint ticket. Our reputation in the city depends on getting it right.",
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
    dynamicSections: {
      story:
        "Manchester is a city of reinvention, and its housing stock shows it. The red-brick mills of Ancoats and the Northern Quarter have become loft apartments with original iron columns and floor-to-ceiling windows; a mile out, the Victorian terraces of Levenshulme, Withington and Chorlton still have their original coving, sash windows and coal-fire hearths. We clean across that whole spread — concierge blocks in M1-M4, student lets off the Oxford Road corridor, and family semis out towards Didsbury and Chorlton. It's the same vetted, insured team whichever postcode you're in, but the job changes: a glass-fronted Northern Quarter apartment needs different care from a 1900s terrace in Levenshulme with hard-water limescale and original plaster.",
      process:
        "Every Manchester clean starts with a short walkthrough — in person for larger jobs, or a video survey for standard domestic cleans — so we quote against what's actually there rather than a generic size band. For city-centre apartment blocks in M1-M4 we book concierge access and check parking rules before the visit so nothing stalls on the day. Regular clients get the same cleaner each visit where possible; deep cleans and end-of-tenancy jobs are two-person teams with a written checklist covering limescale, oven interiors, skirting, and inside-window glass. Student changeovers around Fallowfield and Withington are scheduled to the academic calendar, with a fixed turnaround slot between tenancies.",
      areas:
        "We work the full Manchester spread: the City Centre and Northern Quarter (M1-M4), Ancoats and New Islington (M4), Hulme and Moss Side (M15), Fallowfield and Rusholme (M14), Withington (M20), Levenshulme (M19), Chorlton (M21), and Didsbury (M20). City-centre and Northern Quarter jobs are usually weekday-daytime for offices and early-evening for apartments; the residential streets in Didsbury, Chorlton and Levenshulme are mostly weekday mornings and Saturday slots. If you're on the border with Salford or Trafford we'll still quote — just tell us the postcode when you enquire.",
      reviews:
        "Manchester clients tend to mention two things: reliability in the city-centre high-rises (where a missed slot means a wasted concierge booking) and how much the deep clean actually shifts on older Ancoats and Levenshulme terraces. Landlords around the Oxford Road corridor use us for the summer changeover because the checklist is written down and the deposit-standard clean is consistent flat to flat. We don't cherry-pick postcodes — a Levenshulme terrace gets the same team and the same checklist as a Northern Quarter penthouse.",
    },
  },

  'salford-quays': {
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
    dynamicSections: {
      story:
        "Salford is not one place but several stitched together by the Ship Canal. On the Quays, glass towers at MediaCityUK rise where the Victorian docks used to load cotton; ten minutes inland, Ordsall's red-brick terraces and the Peel Park campus feel like a different century. We clean across that whole spread — the concierge high-rises at Salford Quays, the student lets off Frederick Road, and the family semis out towards Worsley and Boothstown. It's the same vetted, insured team whichever postcode you're in, but the job itself changes: a Quays apartment with floor-to-ceiling glass needs different care from a 1930s terrace in Monton with original coving and a coal-fire hearth.",
      process:
        "Every Salford clean starts with a short walkthrough — in person for larger jobs, or a video survey for standard domestic cleans — so we can quote against what's actually there rather than a generic size band. For Quays and MediaCityUK apartments we book lift access and check concierge rules before the visit so nothing stalls on the day. Regular clients get the same cleaner each visit where possible; deep cleans and end-of-tenancy jobs are two-person teams with a written checklist covering limescale, oven interiors, skirting, and inside-window glass. Student changeovers around Peel Park are scheduled to the academic calendar, with a fixed turnaround slot between tenancies.",
      areas:
        "We work the full Salford spread: Salford Quays and MediaCityUK (M50), Ordsall and Pendleton (M5/M6), Eccles and Monton (M30), Swinton and Pendlebury (M27), Walkden and Boothstown (M28), Worsley (M28), and Broughton (M7). The Quays and MediaCityUK jobs are usually weekday-daytime for offices and early-evening for apartments; the residential streets in Worsley, Monton and Swinton are mostly weekday mornings and Saturday slots. If you're on the border with Trafford or Manchester we'll still quote — just tell us the postcode when you enquire.",
      reviews:
        "Salford clients tend to mention two things: reliability on the Quays high-rises (where a missed slot means a wasted concierge booking) and how much the deep clean actually shifts on older Ordsall and Pendleton terraces. Landlords around the University of Salford use us for the summer changeover because the checklist is written down and the deposit-standard clean is consistent flat to flat. We don't cherry-pick postcodes — a Boothstown semi gets the same team and the same checklist as a MediaCityUK penthouse.",
    },
  },
  'trafford-park': {
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
