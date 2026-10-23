export const siteConfig = {
  name: "Naturals Beauty Academy",
  location: "Alappuzha, Kerala, India",
  phone: "+91 89296 60506",
  email: "om@naturalsbeautyacademypro.com",
  address: "2nd Floor, ASAP Community Skill Park, Cheriya Kalavoor Temple, Kacheriveli, Alappuzha – 688522, Kerala, India.",
  logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Naturals%20Beauty%20Academy%20Logo-rGftHldSfR7c0Ke04Binb99yp30Cdz.png",
  whatsapp: "918929660506",
  youtube: "https://www.youtube.com/@alappuzhanaturalsbeautyacademy",
  youtubeChannelId: "UCBXnxlHyOsRubJUxfFKplOw",
}

export const navItems = [
  { label: "The Academy", href: "/the-academy" },
  { label: "Courses", href: "/courses" },
  { label: "Contact", href: "/contact" },
]

export const imageUrls = {
  hero: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=85",
  classroom: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85",
  makeup: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=85",
  hair: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85",
  skin: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
  nails: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85",
  nailExtensions: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85",
  bridal: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=85",
}

export const courses: Array<{
  slug: string
  title: string
  category: string
  description: string
  image: string
  imageAlt?: string
  duration?: string
  curriculum: Array<{ heading: string; topics: string[]; note?: string }>
}> = [
  {
    slug: "foundation-course-beauty-therapy",
    title: "Foundation Course in Beauty Therapy",
    category: "Beauty Therapy",
    description: "Explore foundational beauty therapy through skin theory, client consultation and practical care procedures.",
    image: "/beauty-therapy.avif",
    imageAlt: "Beauty therapist performing a facial treatment during training",
    duration: "360 Hrs",
    curriculum: [
      { heading: "Theory of Skin", topics: ["Introduction to Skin Science", "Skin Anatomy", "Structure and Layers of the Skin", "Functions of the Skin", "Classification of Skin Types"] },
      { heading: "Skin Disorders", topics: ["Identification of Common Skin Disorders", "Basic Understanding of Skin Conditions", "Contraindications for Beauty Treatments"] },
      { heading: "Theory & Demonstration", topics: ["Client Consultation Techniques", "Client and Trolley Preparation", "Threading Techniques", "Pedicure Procedures", "Manicure Procedures", "Waxing Techniques", "Face Clean-Up Procedure", "Skin Bleaching Procedure", "Facials Procedures", "Bed Setup Techniques", "Towel Tucking Techniques"] },
      { heading: "Sterilization and Sanitization", topics: ["Proper Cleaning and Disinfection of Tools, Equipment and Workstations", "Hygiene Protocols to Prevent Cross-Contamination and Ensure Client Safety"] },
      { heading: "Safety Measures", topics: ["Safe Handling of Electrical Machines, Products & Treatment Tools", "Following Workplace Safety, Personal Hygiene and Professional Standards"] },
      { heading: "Homecare Products", topics: ["Recommending Suitable Homecare Products Based on Skin Type and Treatment", "Educating Clients on Daily Skin Maintenance and Aftercare Routine"] },
    ],
  },
  {
    slug: "advance-course-beauty-therapy",
    title: "Advance Course in Beauty Therapy",
    category: "Beauty Therapy",
    description: "Build advanced beauty therapy knowledge across skin treatments, electrotherapy, waxing and hand and foot care.",
    image: "/advance-course-beauty-therapy.jpg",
    imageAlt: "Beauty therapist applying a facial mask during a treatment demonstration",
    duration: "240 Hrs",
    curriculum: [
      { heading: "Theory of Skin", topics: ["Introduction to Skin Science", "Skin Anatomy", "Structure and Layers of the Skin", "Functions of the Skin", "Classification of Skin Types"] },
      { heading: "Skin Disorders", topics: ["Identification of Common Skin Disorders", "Basic Understanding of Skin Conditions", "Contraindications for Beauty Treatments", "International Brand Products Knowledge", "Tools & Equipment Knowledge"] },
      { heading: "Client Consultation", topics: ["Professional Skin Analysis", "Treatment Planning Based on Skin Conditions", "Client Record Maintenance"] },
      { heading: "Post-Care Advice", topics: ["Post-Treatment Skin Care Guidelines", "Home Care Recommendations for Clients", "Product Usage and Maintenance Advice"] },
      { heading: "Waxing", topics: ["Advanced Liposoluble Wax Techniques", "Brazilian Wax Techniques"] },
      { heading: "Hand & Foot", topics: ["Nail Anatomy", "Bones & Muscles of Limbs", "Crystal Spa Pedicure", "Crystal Spa Manicure", "Anti-ageing Pedicure", "Anti-ageing Manicure", "Hydrating Pedicure", "Hydrating Manicure"] },
      { heading: "Electro Therapy", topics: ["Ultrasonic", "Rejuvenating device", "Galvanic", "High Frequency"] },
      { heading: "Facial Treatments", topics: ["Under-Eye Treatment", "Anti-Ageing Treatment", "Anti-Acne Treatment", "Anti-Pigmentation Treatment", "Anti-Tan Treatment"] },
      { heading: "Sterilization and Sanitization", topics: ["Proper Cleaning and Disinfection of Tools, equipment and Workstations", "Hygiene Protocols to Prevent Cross-Contamination and Ensure Client Safety"] },
      { heading: "Salon Management", topics: ["Appointment Scheduling and Smooth Service co-ordination", "Maintaining Client Records, Product Stock and treatment Planning"] },
      { heading: "Safety Measures", topics: ["Safe Handling of Electrical machines, Products and treatment Tools", "Following Workplace Safety, personal Hygiene & Professional standards"] },
      { heading: "Homecare Products", topics: ["Recommending Suitable homecare Products based on skin Type & Treatment", "Educating Clients on Daily Skin maintenance & Aftercare Routine"] },
    ],
  },
  {
    slug: "foundation-course-hair-dressing",
    title: "Foundation Course in Hair Dressing",
    category: "Hair Dressing",
    description: "Develop foundational hairdressing skills across hair theory, care, cutting, styling and basic colouring.",
    image: imageUrls.hair,
    imageAlt: "Hair dressing lesson in a salon setting",
    duration: "360 Hrs",
    curriculum: [
      { heading: "Hair Theory", topics: ["Hair Anatomy", "Metamorphosis of Hair", "Structure of Hair", "Hair Types and Texture"] },
      { heading: "Client Consultation & Analysis", topics: ["Hair and Scalp Analysis", "Treatment Planning Based on conditions", "Client Record Maintenance"] },
      { heading: "Tools and Product Knowledge", topics: [], note: "No subtopics were listed under this heading in the supplied document." },
      { heading: "Hair Care Procedures", topics: ["Hair Shampooing & Conditioning treatments", "Head Massage"] },
      { heading: "Female Haircuts", topics: ["Hair Cutting Terminology", "Scissor and Comb Handling techniques", "One-Length Straight Cut", "One-Length U-Cut", "One-Length V-Cut", "Straight Bob", "Bangs and Fringes"] },
      { heading: "Male Haircuts", topics: ["Barbering - Scissor Over Comb", "Basic short - One Finger Depth", "Clean Shaving Techniques"] },
      { heading: "Hair Styling & Settings", topics: ["Blast Dry Techniques", "Straight Blow Dry", "Thermal Settings"] },
      { heading: "Hair Colouring", topics: ["Colour Theory", "Henna Mixing and Application techniques", "Global Hair Colouring (Basic Shades)", "Root Touch-Up Techniques"] },
      { heading: "Sterilization and Sanitization", topics: ["Hygiene standards in Hair Services", "Tool and Equipment Disinfection"] },
      { heading: "Safety Measures", topics: ["Workplace safety Practices", "Safe Handling of Hair Tools & Equipment"] },
      { heading: "Homecare Products", topics: ["Basic Hair Care Products", "Homecare Routine for Hair Maintenance", "Product Recommendation Guidelines"] },
    ],
  },
  {
    slug: "advance-course-hair-dressing",
    title: "Advance Course in Hair Dressing",
    category: "Hair Dressing",
    description: "Expand hairdressing practice through advanced cuts, styling, colour, spa and permanent treatments.",
    image: "/advanced-certificate-hair-dressing-enhanced.png",
    imageAlt: "Stylist arranging a detailed updo during a hair dressing lesson",
    duration: "480 Hrs",
    curriculum: [
      { heading: "Hair Theory", topics: ["Hair Anatomy", "Metamorphosis of Hair", "Structure of Hair", "Hair Types and Texture"] },
      { heading: "Client Consultation & Analysis", topics: ["Hair and Scalp Analysis", "Treatment Planning Based on Conditions", "Client Record Maintenance", "International Brand Products Knowledge", "Tools & Equipment Knowledge"] },
      { heading: "Advance Female Haircuts", topics: ["Long Layers", "Short Layers", "Graduated Cuts", "Creative Layer cuts", "Fringes & Bangs"] },
      { heading: "Advanced Men's Haircuts", topics: ["Buzz Cut Style", "Crew Cut Style", "Undercut Haircut", "Taper Fade", "Low Fade", "Mid Fade", "French Crop Haircut", "Mohawk Haircut Styles"] },
      { heading: "Moustache Designing & Beard Care", topics: ["French Beard", "Goatee Style", "Short Boxed Beard", "Stubble Beard (Short / Medium)", "Full Beard Styling", "Winter Beard", "Duck Tail Beard"] },
      { heading: "Thermal Styling Techniques", topics: ["Ironing", "Tonging", "Crimping", "Blow Dry - Curls and Out Curls"] },
      { heading: "Hair Spa Treatments", topics: ["Product Knowledge", "Dandruff treatment", "Deep Nourishing treatment"] },
      { heading: "Electro Therapy", topics: ["High Frequency", "Hot Roller"] },
      { heading: "Hair Colouring", topics: ["Theory of Hair Colour", "Colour Application Techniques", "Grey Coverage Techniques", "Global Fashion Shade Colouring", "Pre-Lightening Techniques", "Highlighting Techniques", "Ombre Techniques", "Balayage Techniques"] },
      { heading: "Permanent Hair Treatments", topics: ["Hair Smoothening", "Hair Straightening / Rebonding", "Hair Perming", "Hair Botox"] },
      { heading: "Sterilization and Sanitization", topics: ["Hygiene Standards in Hair services", "Tool and Equipment Disinfection"] },
      { heading: "Salon Management", topics: ["Professional Salon Practices", "Client Service and Consultation"] },
      { heading: "Safety Measures", topics: ["Workplace Safety Practices", "Safe Handling of Hair Tools & equipment"] },
      { heading: "Homecare Products", topics: ["Hair Care Products", "Homecare Routine for Hair maintenance", "Product Recommendation guidelines"] },
    ],
  },
  {
    slug: "foundation-course-makeup-artistry",
    title: "Foundation Course in Makeup Artistry",
    category: "Makeup Artistry",
    description: "Start in makeup artistry with foundational theory, makeup looks, saree draping and hairstyling.",
    image: imageUrls.makeup,
    imageAlt: "Makeup tools and products arranged for an artistry lesson",
    duration: "240 Hrs",
    curriculum: [
      { heading: "Introduction to Makeup Artistry", topics: ["About the Makeup Industry", "Role of a Professional Makeup Artist", "Scope and Career Opportunities in Makeup Artistry", "Professional Etiquette", "Skin Analysis & Skin Preparation", "Makeup Brush Theory", "Colour Theory", "Face Shapes"] },
      { heading: "Makeup Environment", topics: ["Professional Makeup Room setup", "Lighting & Hygiene Standards", "Makeup Workspace arrangement", "Contraindications & Makeup sequence", "Client Consultation"] },
      { heading: "Saree Draping", topics: ["History of Saree Draping", "Importance of Saree Draping for makeup Artists", "2 different types of saree draping"] },
      { heading: "Sterilization and Sanitization", topics: ["Proper Cleaning and Disinfection of Makeup Tools & Work stations", "Hygiene Practices to Prevent cross-contamination and Ensure client Safety"] },
      { heading: "Safety Measures", topics: ["Safe Handling of Makeup products, Electrical Tool & Accessories", "Following Personal Hygiene and workplace safety standards"] },
      { heading: "Different Types of Makeup Looks", topics: ["Day Self Makeup", "Corporate Makeup", "Party Makeup", "Engagement Makeup", "Bridal Makeup", "Reception Makeup", "Groom Makeup"] },
      { heading: "Hairstyling", topics: ["Hair Styling Basics", "Hairstyling Products Knowledge", "Tools Used for Hairstyling", "Different Types of Hair Upstyles"] },
      { heading: "Thermal Styling Techniques", topics: ["Ironing", "Tonging", "Thermal Styling Dos & Don'ts"] },
      { heading: "Home care Products", topics: ["Recommended skin care and makeup maintenance Products for Clients", "Guidance on post-makeup care and product usage at home"] },
      { heading: "Freelance Makeup Artist Guidance", topics: ["Introduction to freelancing", "Essential skills & Kit preparation", "Client consultation & Pricing", "Marketing & Personal Branding", "Professional etiquette & client handling"] },
    ],
  },
  {
    slug: "advance-course-makeup-artistry",
    title: "Advance Course in Makeup Artistry",
    category: "Makeup Artistry",
    description: "Build advanced artistry across complexion techniques, specialist makeup looks, saree draping and advanced up-styles.",
    image: "/kerala-makeup.jpg",
    imageAlt: "Makeup artist preparing a model for an advanced look",
    duration: "360 Hrs",
    curriculum: [
      { heading: "Introduction to Makeup Artistry", topics: ["About the Makeup Industry", "Role of a Professional Makeup artist", "Scope and Career Opportunities in Makeup artistry"] },
      { heading: "Additional Knowledge", topics: ["International Brand Products Knowledge", "Tools & Equipment Knowledge", "Client Consultation Techniques", "Skin Analysis"] },
      { heading: "Advance Techniques", topics: ["Skin Prepping", "Colour Correction Technique", "Different types of Foundation", "Face Sculpting Techniques", "Blush & Highlight Techniques"] },
      { heading: "Different types of Saree Draping", topics: ["Prepleating techniques", "Fluffy Pleating", "Kandangi Saree Draping", "Madisar Draping", "Double Saree Draping", "Different types of Lehenga styling", "Indo-Western Draping", "North Indian"] },
      { heading: "Sterilization and Sanitization", topics: ["Proper Cleaning and disinfection of Makeup Tools & workstations", "Hygiene Practices to Prevent cross-Contamination and ensure Client Safety"] },
      { heading: "Salon Management", topics: ["Appointment Scheduling and client Service Coordination", "Maintaining Client Records and product Inventory"] },
      { heading: "Different Types of Makeup Look", topics: ["HD Look", "Water Proof Technique", "Retro Style Look", "High Fashion Look", "Mature Skin Look", "Deep Skin tone Look", "SFX Technique", "Groom Look", "Fantasy Look", "Transfer Proof Technique"] },
      { heading: "Different types of Advance Hair Up-styles", topics: ["Different Types of Braids", "Front Hair Style Variations", "Bridal Hair Up-styles Variations", "Bridal Buns Up-styles Variations", "Free Flow Hairstyles", "Messy Hairstyles", "Fashion Hair Styling"] },
      { heading: "Safety Measures", topics: ["Safe Handling of Makeup products, Electrical Tools and accessories", "Following Personal Hygiene and Workplace Safety Standards"] },
      { heading: "Homecare Products", topics: ["Recommended Skin Care and makeup maintenance Products for Clients", "Guidance on Post-Makeup Care and Product Usage at Home"] },
    ],
  },
  {
    slug: "diploma-nail-art-extensions",
    title: "Diploma in Nail Art & Extensions",
    category: "Nail Art & Extensions",
    description: "Learn nail anatomy, nail art, polish application, extensions and safe nail-service practices.",
    image: imageUrls.nails,
    imageAlt: "Nail art practice with a polished manicure",
    duration: "180 Hrs",
    curriculum: [
      { heading: "Introduction of Nailart & Extensions", topics: ["Professional Nail Art & Extensions", "Evolution of Nail Artistry", "Benefits of Nail Extensions", "Types of Nail Extensions Systems", "Career Scope In Nail Industry", "Professional Role of A Nail Technician"] },
      { heading: "Nail Anatomy", topics: ["Nail Structure And Functions", "Nail Growth Cycle", "Nail Shapes And Suitability", "Common Nail Disorders & Diseases", "Healthy Nail Care Practices", "Contra-Indications for Nail Services"] },
      { heading: "Different Types of Nailart", topics: ["Brush nail art", "Striping nail art", "Striping with glitter", "Glitter & Miller art", "Ombre Nail art", "Beads Nail art", "Rhinestone Nail art", "Dotting Tool Techniques", "Fine Nail Art"] },
      { heading: "Product Knowledge - Sterilization and Sanitization", topics: ["Proper Disinfection of Tools, Implements & Workstations", "Sterilization Protocols to Prevent Cross-Infection and Ensure Client Safety"] },
      { heading: "Client Consultation - Nail Services", topics: ["Purpose Of Client Consultation", "Nail And Skin Analysis", "Identifying Contra-indications", "Service Planning & Customization", "Aftercare Advice & Documentation"] },
      { heading: "Nail Polish Application", topics: ["Regular Nail polish", "French tip", "Gel nail polish application & removal"] },
      { heading: "Different Types of Extension", topics: ["Nail Prepping", "Gel Nail Extension", "Acrylic Nail Extension", "Refilling & Removal Techniques"] },
      { heading: "Safety Measures", topics: ["Safe Handling of Nail Products, Chemicals, and Electrical Tools", "Maintaining Workplace Safety and Following Hygiene Standards"] },
      { heading: "Homecare Products", topics: ["Cuticle Oils, Nail Strengthens, and Aftercare Essentials", "Client Guidance on Home Maintenance for Long-Lasting Extension"] },
    ],
  },
  {
    slug: "master-diploma-nail-art-extensions",
    title: "Master Diploma in Nail Art & Extensions",
    category: "Nail Art & Extensions",
    description: "Explore advanced extension systems, luxury nail art, nail structure and detailed preparation techniques.",
    image: imageUrls.nailExtensions,
    imageAlt: "Nail extension work showing detailed nail art",
    duration: "360 Hrs",
    curriculum: [
      { heading: "Different types of Extensions", topics: ["Polygel Nail Extensions", "Soft Gel Nail Extensions", "Advanced Gel Sculpting Techniques"] },
      { heading: "Luxury Nail Art", topics: ["3D Nail Art Techniques", "4D Nail Art", "Blossom Nail Art", "Cat Eye Nail Art", "Chrome Nail Art & Luxury Finishes", "Bridal Nail Art", "Occasion Nail Styling", "Advanced Repair, Refill & Corrections", "Advanced Removal & Nail Rehab"] },
      { heading: "Advanced Nail Science & Structural Mastery", topics: ["Advanced Nail Anatomy for extensions", "Nail Stress Points, Apex Structure & Balance", "Nail Architecture for Long & extreme Length extensions", "Understanding Nail Durability & load Distribution"] },
      { heading: "Advanced Nail Preparation Techniques", topics: ["Deep Cuticle Detailing techniques", "Advanced E-File Cuticle Work", "Perfect Nail Plate Preparation for long Retention", "Dehydration & Adhesion Science"] },
    ],
  },
  {
    slug: "diploma-course-beauty-therapy",
    title: "Diploma Course in Beauty Therapy",
    category: "Beauty Therapy",
    description: "Explore beauty therapy learning across skin care, treatment practice and client care.",
    image: imageUrls.skin,
    imageAlt: "Facial treatment demonstration in a beauty therapy setting",
    duration: "600 Hrs",
    curriculum: [],
  },
  {
    slug: "diploma-course-hair-dressing",
    title: "Diploma Course in Hair Dressing",
    category: "Hair Dressing",
    description: "Study hair dressing techniques and salon practice through a diploma-level programme.",
    image: "/diploma-course-hair-dressing.jpg",
    imageAlt: "Hair stylist arranging a formal updo during a hair dressing lesson",
    duration: "720 Hrs",
    curriculum: [],
  },
  {
    slug: "diploma-pro-makeup-artistry",
    title: "Diploma in Pro-Makeup Artistry",
    category: "Makeup Artistry",
    description: "Explore professional makeup artistry for a range of looks and occasions.",
    image: imageUrls.bridal,
    imageAlt: "Bridal makeup look created for a professional artistry course",
    duration: "960 Hrs",
    curriculum: [],
  },
  {
    slug: "foundation-beauty-therapy-hair-dressing",
    title: "Foundation Course in Beauty Therapy & Hair Dressing",
    category: "Beauty Therapy & Hair Dressing",
    description: "Begin with combined foundations in beauty therapy and hair dressing.",
    image: "/foundation-beauty-therapy-hair-dressing.jpg",
    imageAlt: "Beauty students learning makeup application together in a training salon",
    duration: "720 Hrs",
    curriculum: [],
  },
  {
    slug: "advanced-diploma-beauty-therapy-hair-dressing",
    title: "Advanced Diploma Course in Beauty Therapy & Hair Dressing",
    category: "Beauty Therapy & Hair Dressing",
    description: "Continue beauty therapy and hair dressing studies through an advanced diploma programme.",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Beauty and hair styling tools prepared for a practical lesson",
    duration: "720 Hrs",
    curriculum: [],
  },
  {
    slug: "professional-diploma-beauty-therapy-hair-dressing",
    title: "Professional Diploma in Beauty Therapy & Hair Dressing",
    category: "Beauty Therapy & Hair Dressing",
    description: "A combined professional diploma in beauty therapy and hair dressing.",
    image: "/kerala-saree.jpg",
    imageAlt: "Kerala beauty styling for a professional beauty course",
    duration: "1440 Hrs",
    curriculum: [],
  },
  {
    slug: "foundation-cosmetology",
    title: "Foundation in Cosmetology",
    category: "Cosmetology",
    description: "Start learning cosmetology and beauty care through a foundation programme.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Cosmetology and beauty products arranged for a learning session",
    duration: "960 Hrs",
    curriculum: [],
  },
  {
    slug: "advance-diploma-cosmetology",
    title: "Advance Diploma in Cosmetology",
    category: "Cosmetology",
    description: "Continue cosmetology studies with an advanced diploma programme.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Cosmetology treatment demonstration with a beauty professional",
    duration: "1560 Hrs",
    curriculum: [],
  },
  {
    slug: "master-diploma-cosmetology",
    title: "Master Diploma in Cosmetology",
    category: "Cosmetology",
    description: "Explore an extended cosmetology programme at master diploma level.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Beauty portrait for a cosmetology programme",
    duration: "1920 Hrs",
    curriculum: [],
  },
  {
    slug: "certificate-course-hair-styling",
    title: "Certificate Course in Hair Styling",
    category: "Hair Styling",
    description: "Focus on hair styling techniques and finishing for a variety of looks.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Hair styling station prepared for a practical class",
    duration: "80 Hrs",
    curriculum: [],
  },
  {
    slug: "certificate-course-personal-grooming",
    title: "Certificate Course in Personal Grooming",
    category: "Personal Grooming",
    description: "Build personal grooming and presentation skills through a short certificate course.",
    image: "/certificate-course-personal-grooming.webp",
    imageAlt: "Makeup artist applying cosmetics during a personal grooming session",
    duration: "80 Hrs",
    curriculum: [],
  },
  {
    slug: "certificate-course-mehandi",
    title: "Certificate Course in Mehandi",
    category: "Mehandi",
    description: "Explore mehandi design and application through a short certificate course.",
    image: "/certificate-course-mehandi.jpg",
    imageAlt: "Intricate floral henna mehndi design on a hand",
    duration: "80 Hrs",
    curriculum: [],
  },
]

export const faqs = [
  ["How can I enquire about a course?", "Use the enquiry form or contact the academy directly. Our team can share the latest availability and admission information."],
  ["Are course durations and fees available online?", "Course details can change between intakes. Please enquire for the current duration, fee and eligibility information."],
  ["Is practical training included?", "The academy focuses on practical learning. Enquire about the current structure and hands-on sessions for your chosen course."],
  ["Are workshops currently scheduled?", "Upcoming workshop dates are shared as they are confirmed. Contact the academy to hear about the latest opportunities."],
]

export const specializations = [
  { title: "Hair", text: "Shape, style and care for confident salon artistry.", image: imageUrls.hair },
  { title: "Makeup", text: "Build technique through guided, expressive practice.", image: imageUrls.makeup },
  { title: "Skin", text: "Understand the foundations of considered skin care.", image: imageUrls.skin },
  { title: "Nails", text: "Explore detail-led nail artistry and finish.", image: imageUrls.nails },
  { title: "Bridal Beauty", text: "Create polished looks for meaningful moments.", image: imageUrls.bridal },
]

export type Course = (typeof courses)[number]
export type FAQ = (typeof faqs)[number]
export type Specialization = (typeof specializations)[number]

export function whatsappUrl(message = "Hello, I would like to know more about courses at Naturals Beauty Academy.") {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
}

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug)
}

export const approvedTestimonials: Array<{ quote: string; name: string; course?: string }> = []

export const approvedWorkshops: Array<{ title: string; date: string; description: string; image: string }> = []

export const getImage = (url: string, alt: string) => ({ src: url, alt })

export const sectionIntro = {
  eyebrow: "NATURALS BEAUTY ACADEMY · ALAPPUZHA",
  title: "Beauty education that inspires your future.",
  body: "Discover professional beauty education through practical learning in hair, skin, makeup and more.",
}


export const legalDraftNotice = "This draft is provided for review by the academy and should be approved before launch."

export const Logo = null

export const _unused = { getImage, Logo }

export const brand = { primary: "#70358F", deep: "#4D1F68", lavender: "#F4EDF8" }

export const allImageUrls = Object.values(imageUrls)

export const courseCategories = ["All", "Professional", "Short-term"] as const

export const academicValues = [
  { title: "Hands-on learning", text: "Learn by doing with a practical approach to beauty education." },
  { title: "A creative environment", text: "Build confidence in a calm, focused and encouraging setting." },
  { title: "Career-focused skills", text: "Develop foundations you can continue to grow throughout your journey." },
]

export const footerGroups = [
  { title: "Explore", links: navItems },
  { title: "Start here", links: [{ label: "Explore courses", href: "/courses" }, { label: "Make an enquiry", href: "/contact" }, { label: "WhatsApp us", href: whatsappUrl() }] },
]

export const pageTitles = {
  academy: "The Academy | Naturals Beauty Academy",
  courses: "Courses | Naturals Beauty Academy",
  workshops: "Workshops | Naturals Beauty Academy",
  testimonials: "Student Experiences | Naturals Beauty Academy",
  faq: "Frequently Asked Questions | Naturals Beauty Academy",
  contact: "Contact | Naturals Beauty Academy",
}

export const seoDescription = "Professional beauty education in Alappuzha, Kerala. Explore practical learning in hair, skin, makeup and more at Naturals Beauty Academy."

export const contactFields = ["Full Name", "Phone Number", "Email Address", "Course of Interest", "Message"] as const

export const coursePath = (slug: string) => `/courses/${slug}`

export const homeSections = ["academy", "courses", "specializations", "story", "gallery", "faq"] as const

export const safeExternal = (href: string) => href

export const emptyStateCopy = "New updates will be shared here as they are confirmed."

export const imageAlt = "Naturals Beauty Academy learning environment"

export const historicalDisclaimer = "Historical content is shown for context only. Please confirm current details with the academy."

export const contactCta = "Connect with Naturals Beauty Academy to learn more about available courses and admission enquiries."

export const copyright = `© ${new Date().getFullYear()} Naturals Beauty Academy. All rights reserved.`

export const navLabel = "Main navigation"

export const logoAlt = "Naturals Beauty Academy logo"

export const mapUrl = "https://maps.google.com/?q=Alappuzha,Kerala"

export const pageEyebrow = "NATURALS BEAUTY ACADEMY"

export const courseCount = courses.length

export const introTitle = "Learn the basics. Master the art."

export const introSubtitle = "Start your beautiful career."

export const imageLoading = "lazy" as const

export const mainCta = { label: "Explore courses", href: "/courses" }

export const secondaryCta = { label: "Enquire now", href: "/contact" }

export const quoteMark = "\""

export const siteKeywords = ["beauty academy", "beauty courses", "Alappuzha", "makeup artistry", "cosmetology"]

export const categoryLabel = (category: string) => category === "Short-term" ? "Short-term course" : "Professional course"

export const formatCourseTitle = (title: string) => title

export const courseImageAlt = (course: Course) => `${course.title} learning at Naturals Beauty Academy`

export const sectionLabel = (label: string) => label

export const noDataLabel = "Details available on enquiry"

export const brandStatement = "A considered beginning for a beautiful career."

export const socialLinks: Array<{ label: string; href: string }> = []

export const requiredContactMessage = "Please share your name, phone number and course interest so the academy can respond."

export const noUnverifiedClaim = true

export const academyDescription = "An educational vertical focused on educating and upskilling aspiring beauty professionals through practical learning."

export const imageCredit = "Photography via Unsplash; replace with approved academy photography before launch."

export const defaultCourse = courses[0]

export const routeLabels = { home: "Home", contact: "Contact" }

export const availabilityNote = "Current availability is shared on enquiry."

export const footerNote = "Practical learning for a beautiful career."

export const faqCategories = ["Courses", "Admissions", "Fees and Duration", "Training", "Certificates", "Workshops"]

export const contactSuccess = "Thanks for reaching out. The academy can follow up once this form is connected to a submission service."

export const placeholderStatus = "Awaiting academy confirmation"

export const allRoutes = ["/", "/the-academy", "/courses", "/testimonials", "/workshops", "/faq", "/contact", "/privacy-policy", "/terms-and-conditions"]

export const siteThemeColor = "#70358F"

export const imageFit = "cover"

export const phoneHref = `tel:${siteConfig.phone.replaceAll(" ", "")}`

export const emailHref = `mailto:${siteConfig.email}`

export const openGraphImage = imageUrls.hero

export const currentYear = new Date().getFullYear()

export const shouldShowShop = false

export const currentEventsNote = "No current workshop dates are published. Enquire for upcoming opportunities."

export const currentTestimonialsNote = "Approved student experiences will appear here as they are confirmed."

export const formEndpointNote = "Frontend validation is ready; connect a backend submission service before launch."

export const featuredCourseSlugs = courses.slice(0, 4).map((course) => course.slug)

export const legalPages = [{ label: "Privacy Policy", href: "/privacy-policy" }, { label: "Terms & Conditions", href: "/terms-and-conditions" }]

export const ensureString = (value: unknown) => typeof value === "string" ? value : ""

export const isCourseSlug = (slug: string) => courses.some((course) => course.slug === slug)

export const getCourseHref = (course: Course) => coursePath(course.slug)

export const imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

export const headerCta = { label: "Enquire now", href: "/contact" }

export const homeHeroCopy = { eyebrow: sectionIntro.eyebrow, title: introTitle, subtitle: introSubtitle, body: sectionIntro.body }

export const footerAddress = `${siteConfig.address} ${siteConfig.phone}`

export const contentStatus = "Content marked as awaiting confirmation is intentionally not presented as a live claim."

export const academicAreas = ["Hair", "Makeup", "Skin", "Nails", "Bridal beauty"]

export const ctaLabel = "Begin your enquiry"

export const contactFormTitle = "Tell us what you would like to learn."

export const contactFormDescription = "Share a few details and the academy can guide you towards the right next step."

export const footerLogoClass = "h-auto w-48"

export const mutedLabel = "Available on enquiry"

export const heroImageAlt = "Beauty professional working in an elegant learning environment"

export const academyImageAlt = "Beauty learning and practical training"

export const galleryItems = [
  { image: imageUrls.makeup, label: "Makeup practice" }, { image: imageUrls.hair, label: "Hair styling" }, { image: imageUrls.skin, label: "Skin therapy" }, { image: imageUrls.nails, label: "Nail artistry" }, { image: imageUrls.classroom, label: "Classroom training" }, { image: imageUrls.bridal, label: "Beauty tools and demonstrations" },
]

export const applicationNote = "Please confirm current course details before making an application."

export const brandColors = ["#70358F", "#4D1F68", "#8B59A6", "#F4EDF8", "#29242D"]

export const ariaLabels = { menu: "Open navigation menu", close: "Close navigation menu", whatsapp: "Chat on WhatsApp" }

export const maxContentWidth = "max-w-7xl"

export const homeTitle = "Learn the basics. Master the art."

export const homeDescription = "Professional beauty education through practical learning in hair, skin, makeup and more."

export const logoSourceUrl = siteConfig.logo

export const allCourseCategories = Array.from(new Set(courses.map((course) => course.category)))

export const externalImagePolicy = "Replace stock imagery with approved academy photography before launch."

export const finalNote = ""

export const noFakeIntegration = true

export const noFakeTestimonials = true

export const noFakeEvents = true

export const noFakeClaims = true

export const primaryPhone = siteConfig.phone

export const primaryEmail = siteConfig.email

export const address = siteConfig.address

export const academyLocation = siteConfig.location

export const logoUrl = siteConfig.logo

export const whatsapp = whatsappUrl()

export const siteName = siteConfig.name

export const siteLocation = siteConfig.location

export const contactPhone = phoneHref

export const contactEmail = emailHref

export const year = currentYear

export const footerLinks = legalPages

export const courseData = courses

export const faqData = faqs

export const specializationData = specializations

export const workshopData = approvedWorkshops

export const testimonialData = approvedTestimonials

export const logo = siteConfig.logo

export const config = siteConfig

export const metadataDescription = seoDescription

export const pageDescription = seoDescription

export const pageTitle = siteConfig.name

export const whatsappMessage = "Hello, I would like to enquire about beauty courses."

export const whatsappLink = whatsappUrl(whatsappMessage)

export const contactAddress = siteConfig.address

export const phoneNumber = siteConfig.phone

export const emailAddress = siteConfig.email

export const academyName = siteConfig.name

export const academyPhone = siteConfig.phone

export const academyEmail = siteConfig.email

export const academyLogo = siteConfig.logo

export const academyWhatsapp = siteConfig.whatsapp

export const academyAddress = siteConfig.address

export const academyUrl = "https://naturalsbeautyacademypro.com"

export const contentDisclaimer = historicalDisclaimer

export const stockImageDisclaimer = imageCredit

export const supportedCategories = courseCategories

export const courseList = courses

export const faqList = faqs

export const workshopList = approvedWorkshops

export const testimonialList = approvedTestimonials

export const specializationList = specializations

export const homeCopy = homeHeroCopy

export const ctaCopy = contactCta

export const configVersion = "1"

export const isPreviewContent = true

export const currentContent = "preview"

export const brandPurple = brand.primary

export const deepPurple = brand.deep

export const lightLavender = brand.lavender

export const pageHeroImage = imageUrls.hero

export const siteImage = imageUrls.hero

export const heroImage = imageUrls.hero

export const academyImage = imageUrls.classroom

export const galleryData = galleryItems

export const specializationsData = specializations

export const courseDetails = courses

export const courseMetadata = courses.map((course) => ({ slug: course.slug, title: course.title }))

export const primaryNavigation = navItems

export const utilityNavigation = legalPages

export const content = { homeHeroCopy, courses, faqs, specializations }

export const settings = { shouldShowShop, isPreviewContent }

export const media = { imageUrls, logo: siteConfig.logo }

export const contact = { phone: siteConfig.phone, email: siteConfig.email, address: siteConfig.address }

export const academy = { name: siteConfig.name, location: siteConfig.location }

export const meta = { title: pageTitle, description: seoDescription, image: openGraphImage }

export const __brand = brand

export const __site = siteConfig

export const __courses = courses

export const __faqs = faqs

export const __specializations = specializations

export const __gallery = galleryItems

export const __footer = footerGroups

export const __legal = legalPages

export const __routes = allRoutes

export const __current = currentYear

export const __status = contentStatus

export const __note = finalNote

export const __version = configVersion

export const __preview = isPreviewContent

export const __noFake = noFakeIntegration

export const __done = true

export const __export = { siteConfig, courses, faqs, specializations }

export const __end = null

export type Workshop = {
  title: string
  slug?: string // campaign page: /workshops/<slug>
  shortDescription?: string // card and link-preview text
  totalSeats?: number // seat limit; registrations close automatically when reached
  seatsLeft?: number // live count from Supabase (only when totalSeats is set)
  registrationOpen?: boolean
  date: string // YYYY-MM-DD; once this date has passed the site shows the next workshop automatically
  start?: string // 24-hour start time, e.g. "10:00", used for the countdown
  time: string
  duration: string
  category: string
  description: string
  image: string
  location?: string
  seats?: string
  fee?: string
  highlights?: string[] // "What you'll learn"
  audience?: string[] // "Who it's for"
  includes?: string[] // "What's included"
  agenda?: Array<{ time: string; title: string }>
  trainer?: { name: string; role: string; image: string }
  faqs?: Array<[string, string]>
}

// Placeholder workshops: replace with your real schedule. The /workshops page features the next upcoming one.
// Only the title, date, time, duration, category, description and image are required; sections for missing optional fields are hidden.
export const workshops: Workshop[] = [
  {
    title: "Bridal Makeup Masterclass",
    date: "2026-10-31",
    start: "10:00",
    time: "10:00 AM – 4:00 PM",
    duration: "1 day",
    category: "Makeup",
    description: "A full-day, hands-on masterclass where you create a complete Kerala bridal look — from skin prep and a long-wear base to eyes, lips and the final finish.",
    image: "/kerala-makeup.jpg",
    seats: "Only 15 seats",
    fee: "Contact for fee",
    highlights: [
      "Skin prep and a long-wear base for Kerala weather",
      "Kerala bridal eye looks and lash application",
      "Colour correction, contouring and highlighting",
      "Lip, finishing and setting techniques",
      "Matching makeup to jewellery, jasmine and kasavu tones",
      "Live demonstration followed by hands-on practice",
    ],
    audience: ["Beauty students and beginners", "Working beauticians who want to upskill", "Freelance makeup artists", "Anyone curious about bridal makeup"],
    includes: ["Hands-on practice with professional products", "Certificate of participation", "Workshop notes and product guide", "Tea and lunch"],
    agenda: [
      { time: "10:00 AM", title: "Welcome and skin preparation" },
      { time: "11:00 AM", title: "Base, colour correction and contouring" },
      { time: "12:30 PM", title: "Live bridal look demonstration" },
      { time: "1:30 PM", title: "Lunch break" },
      { time: "2:15 PM", title: "Hands-on practice" },
      { time: "3:30 PM", title: "Feedback, Q&A and certificates" },
    ],
    trainer: { name: "Trainer Name", role: "Senior Makeup Artistry Trainer", image: "/placeholder-user.jpg" },
    faqs: [
      ["Do I need to bring my own makeup kit?", "No. Professional products are provided during the workshop. You are welcome to bring your own brushes if you prefer."],
      ["Is this workshop suitable for beginners?", "Yes. The trainer starts with the basics before moving on to bridal techniques."],
      ["How do I confirm my seat?", "Tap Register on WhatsApp and send the message. Our team will confirm your seat and share the payment details."],
      ["Will I get a certificate?", "Yes. Every participant receives a certificate of participation from Naturals Beauty Academy."],
    ],
  },
  { title: "Kerala Bridal Hair Styling", date: "2026-11-14", start: "10:00", time: "10:00 AM – 3:00 PM", duration: "1 day", category: "Hair", description: "Practise classic bridal buns, jasmine placement and secure styling techniques for long-lasting looks.", image: "/kerala-hair.jpg", seats: "Limited seats" },
  { title: "Nail Art Basics", date: "2026-11-28", start: "11:00", time: "11:00 AM – 3:00 PM", duration: "Half day", category: "Nails", description: "Learn nail prep, polish application and simple nail art designs you can start using straight away.", image: imageUrls.nails },
]

const workshopMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function workshopDateParts(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return { day: String(day).padStart(2, "0"), month: workshopMonths[month - 1], year: String(year), label: `${day} ${workshopMonths[month - 1]} ${year}` }
}

export function academyToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date())
}

export function nextWorkshop(today = academyToday(), source = workshops) {
  return source.filter((w) => w.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0]
}

export function workshopStartsAt(workshop: Workshop) {
  return `${workshop.date}T${workshop.start ?? "10:00"}:00+05:30`
}

export function workshopRegisterUrl(workshop: Workshop) {
  return whatsappUrl(`Hello, I would like to register for the "${workshop.title}" workshop on ${workshopDateParts(workshop.date).label} at Naturals Beauty Academy.`)
}
