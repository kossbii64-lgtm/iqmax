import type {
  FaqItem,
  IngredientItem,
  PaymentMethod,
  PolicyKey,
  ProductPackage,
  ShippingRegion,
  SupportPillar,
  TestimonialItem,
} from '../types/store';

export const SHIPPING_RATES: Record<ShippingRegion, Record<PaymentMethod, number>> = {
  semenanjung: {
    online_transfer: 8,
    cod: 10,
  },
  sabah_sarawak: {
    online_transfer: 10,
    cod: 17,
  },
};

export const STORE_CONFIG = {
  brandName: 'YouEdu',
  productName: 'IQMAX+',
  tagline: 'Focus Better. Learn Better. Perform Better.',
  currencyCode: 'RM',
  storageKey: 'youedu_iqmax_cart_v3',
  preferencesStorageKey: 'youedu_iqmax_shipping_prefs_v2',
  demoUsersKey: 'youedu_iqmax_demo_users_v1',
  demoSessionKey: 'youedu_iqmax_demo_session_v1',
  demoOrdersKey: 'youedu_iqmax_demo_orders_v1',
  demoOrdersSeededKey: 'youedu_iqmax_demo_seeded_v1',
  bankTransferPlaceholder: {
    bankName: '[Bank Name Placeholder — Demo Only]',
    accountHolder: '[YouEdu IQMAX+ Demo Account — Placeholder]',
    accountNumber: '[XXXX-XXXX-XXXX — Placeholder]',
    referenceHint: 'Simulated Bank Transfer for Academic Presentation (No Real Payment).',
  },
  contact: {
    whatsappNumberDisplay: '+60 XX-XXXX XXXX',
    whatsappUrlPlaceholder: '#contact',
    emailPlaceholder: 'hello@youedu-placeholder.example',
    locationPlaceholder: 'Malaysia · Academic Demo Storefront',
    hoursPlaceholder: 'Mon – Fri · 9:00 AM – 6:00 PM (Placeholder)',
  },
  disclaimer:
    'IQMAX+ is a food-grade chewable nutritional supplement, not a medicine. It is not intended to diagnose, treat, cure, or prevent any disease, and does not guarantee increased IQ scores or instant academic results. Individuals who are pregnant, breastfeeding, taking medication, or managing medical conditions should consult a qualified healthcare professional before use.',
};

export const PRODUCT_PACKAGES: ProductPackage[] = [
  {
    id: 'package-1',
    code: 'PACKAGE 1',
    name: 'Starter Pack',
    subtitle: '1 bottle IQMAX+ · 30 chewable tablets',
    paidBottles: 1,
    freeBottles: 0,
    totalBottles: 1,
    tabletsPerBottle: 30,
    totalTablets: 30,
    estimatedSupplyDays: 15,
    unitPrice: 59,
    badgeText: 'TRIAL PACK',
    imageSrc: '/images/iqmax-bottle-only.png',
    imageAlt: 'YouEdu IQMAX+ Package 1 featuring 1 original bottle of 30 chewable tablets',
    audienceNote:
      'Ideal first-time trial for one individual (15-day daily routine at 2 tablets per day).',
    highlights: [
      '1 × IQMAX+ Bottle (30 chewable tablets · 400mg)',
      'Sugar-free Mixfruit berry flavour with Isomalt & Stevia',
      'Gut × Mind daily nutrition for ages 2+ to adults',
    ],
  },
  {
    id: 'package-2',
    code: 'PACKAGE 2',
    name: 'Most Popular Pack',
    subtitle: '2 bottles + 1 FREE bottle · Total: 3 bottles',
    paidBottles: 2,
    freeBottles: 1,
    totalBottles: 3,
    tabletsPerBottle: 30,
    totalTablets: 90,
    estimatedSupplyDays: 45,
    unitPrice: 100,
    compareAtPrice: 177,
    badgeText: 'MOST POPULAR',
    freeBadgeText: '+ 1 FREE BOTTLE',
    imageSrc: '/images/iqmax-pkg-2.png',
    imageAlt: 'YouEdu IQMAX+ Package 2 displaying 2 bottles plus 1 free bottle (3 bottles total)',
    audienceNote:
      'Customer favourite for continuous focus & learning routines or two siblings sharing.',
    highlights: [
      '2 Bottles + 1 FREE Bottle = 3 Bottles Total (90 tablets)',
      'Saves RM 77 compared to single-bottle pricing',
      'Approx. 45 days consistent daily intake for 1 user',
    ],
    featured: true,
  },
  {
    id: 'package-3',
    code: 'PACKAGE 3',
    name: 'Family Value Pack',
    subtitle: '3 bottles + 2 FREE bottles · Total: 5 bottles',
    paidBottles: 3,
    freeBottles: 2,
    totalBottles: 5,
    tabletsPerBottle: 30,
    totalTablets: 150,
    estimatedSupplyDays: 75,
    unitPrice: 150,
    compareAtPrice: 295,
    badgeText: 'BEST VALUE',
    freeBadgeText: '+ 2 FREE BOTTLES',
    imageSrc: '/images/iqmax-pkg-3.png',
    imageAlt: 'YouEdu IQMAX+ Package 3 displaying 3 purchased bottles plus 2 free bottles (5 bottles total)',
    audienceNote:
      'Maximum value pack for parents, families, students, and extended 75-day supply.',
    highlights: [
      '3 Bottles + 2 FREE Bottles = 5 Bottles Total (150 tablets)',
      'Lowest cost per bottle at RM 30.00 per bottle',
      'Saves RM 145 compared to single-bottle pricing',
    ],
  },
];

export const SUPPORT_PILLARS: SupportPillar[] = [
  {
    id: 'focus-mental',
    indexLabel: '01',
    title: 'Focus & Mental Performance Support',
    summary:
      'Formulated with Magnesium L-Threonate, Centella Asiatica Extract, and B-vitamins to support everyday mental clarity, attention during study or work, and normal cognitive function.',
    keyNutrients: 'Magnesium L-Threonate · Centella Asiatica · B3, B9, B12',
  },
  {
    id: 'calmness-mind',
    indexLabel: '02',
    title: 'Calmness & Mind Support',
    summary:
      'Combines Magnesium L-Theanine with traditional botanical Centella Asiatica to support a calm, composed mindset during busy school schedules and demanding workdays without drowsiness.',
    keyNutrients: 'Magnesium L-Theanine · Centella Asiatica Extract',
  },
  {
    id: 'gut-digestive',
    indexLabel: '03',
    title: 'Gut & Digestive Support',
    summary:
      'Brings together live probiotic cultures with prebiotic dietary fibers (Inulin and Fructo-Oligosaccharide) to nourish beneficial gut flora as part of the Gut × Mind nutritional approach.',
    keyNutrients: 'Probiotic · Inulin · Fructo-Oligosaccharide (FOS)',
  },
  {
    id: 'daily-nutrition',
    indexLabel: '04',
    title: 'Daily Nutritional Support',
    summary:
      'Delivers essential micronutrients including Vitamins B3, B9, B12, and D3 alongside natural mixed berry powders in an easy-to-enjoy sugar-free chewable tablet.',
    keyNutrients: 'Vitamins B3, B9, B12, D3 · Mixed Fruit Powder',
  },
];

export const INGREDIENTS: IngredientItem[] = [
  {
    id: 'magnesium-l-threonate',
    name: 'Magnesium L-Threonate',
    category: 'Cognitive & Calm',
    description:
      'A specialised form of magnesium paired with L-threonate, included to support everyday mineral intake for nervous system function and mental clarity.',
    iconKey: 'magnesium-threonate',
  },
  {
    id: 'magnesium-l-theanine',
    name: 'Magnesium L-Theanine',
    category: 'Cognitive & Calm',
    description:
      'Combines calming amino acid L-Theanine with magnesium to help support relaxed alertness and composure throughout learning or work.',
    iconKey: 'l-theanine',
  },
  {
    id: 'centella-asiatica',
    name: 'Centella Asiatica Extract',
    category: 'Cognitive & Calm',
    description:
      'Botanical extract (commonly known as Pegaga) traditionally included in nutritional formulations to support focus and daily vitality.',
    iconKey: 'centella',
  },
  {
    id: 'probiotic',
    name: 'Probiotic',
    category: 'Gut & Pre-Probiotic',
    description:
      'Beneficial microorganisms incorporated to support balanced intestinal microflora and daily digestive comfort.',
    iconKey: 'probiotic',
  },
  {
    id: 'inulin',
    name: 'Inulin',
    category: 'Gut & Pre-Probiotic',
    description:
      'A natural soluble prebiotic fiber that serves as nourishment for beneficial gut bacteria and supports digestive regularity.',
    iconKey: 'inulin',
  },
  {
    id: 'fos',
    name: 'Fructo-Oligosaccharide (FOS)',
    category: 'Gut & Pre-Probiotic',
    description:
      'Plant-derived prebiotic oligosaccharides working alongside Inulin and probiotics to complement a healthy gut environment.',
    iconKey: 'fos',
  },
  {
    id: 'vitamins-b-d3',
    name: 'Vitamin B3, B9, B12 & D3',
    category: 'Vitamins & Minerals',
    description:
      'Essential micronutrients supporting daily energy-yielding metabolism, normal nervous system function, and general wellness.',
    iconKey: 'vitamins',
  },
  {
    id: 'mixed-fruit-powder',
    name: 'Mixed Fruit Powder',
    category: 'Natural Fruit & Base',
    description:
      'A natural blend of Blackberry, Raspberry, Blueberry, and Elderberry offering berry flavour and botanical richness.',
    iconKey: 'berries',
  },
  {
    id: 'isomalt',
    name: 'Isomalt',
    category: 'Natural Fruit & Base',
    description:
      'Sugar-free carbohydrate base providing crisp chewable texture and mild sweetness without refined table sugar.',
    iconKey: 'isomalt',
  },
  {
    id: 'stevia',
    name: 'Stevia',
    category: 'Natural Fruit & Base',
    description:
      'Plant-derived natural sweetener used to balance the Mixfruit berry taste for enjoyable daily family intake.',
    iconKey: 'stevia',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testimoni-kak-iza',
    customerName: 'Kak Iza',
    headline: 'Result Exam Meningkat & Repeat Pakej 3',
    segmentLabel: 'Project Reference Material · SK Sungai Ranjau',
    packageUsed: 'Package 2 → Repeat Package 3',
    quote:
      '"Alhamdulillah result peperiksaan anak ada peningkatan — BM 98%, Sains 88%, Matematik 93%. Lepas habis botol ni akak nak repeat order Pakej 3 pula."',
    imageSrc: '/images/testimonials/testimoni-1.jpg',
    imageAlt: 'YouEdu IQMAX+ parent testimonial from Kak Iza showing exam marks and WhatsApp message',
    contextNote:
      'Individual customer feedback from uploaded official YouEdu IQMAX+ PDF materials.',
  },
  {
    id: 'testimoni-kak-zakiah',
    customerName: 'Kak Zakiah',
    headline: 'Lebih Fokus & Semangat Mengulang Kaji',
    segmentLabel: 'Project Reference Material · Tingkatan 3 Parent',
    packageUsed: 'IQMAX+ Daily Routine',
    quote:
      '"Dulu susah nak fokus dan belajar cepat lupa. Sejak ikhtiar dengan IQ MAX+, nampak anak makin semangat belajar, lebih fokus dan rajin ulang kaji."',
    imageSrc: '/images/testimonials/testimoni-2.jpg',
    imageAlt: 'YouEdu IQMAX+ parent testimonial from Kak Zakiah showing mid-year exam slip and WhatsApp message',
    contextNote:
      'Individual customer feedback from uploaded official YouEdu IQMAX+ PDF materials.',
  },
  {
    id: 'testimoni-kak-anis',
    customerName: 'Kak Anis',
    headline: 'Anak Johan Hafazan Al-Quran',
    segmentLabel: 'Project Reference Material · Keedsflix Huffaz Challenge',
    packageUsed: 'Consistent 2-Week Supplement Routine',
    quote:
      '"Tak sangka anak dapat Johan hafazan. Selepas konsisten amalkan IQ MAX+, nampak dia lebih tenang, rajin ulang hafazan dan lebih bersemangat."',
    imageSrc: '/images/testimonials/testimoni-3.jpg',
    imageAlt: 'YouEdu IQMAX+ customer testimonial from Kak Anis with Johan Huffaz Challenge certificate and WhatsApp feedback',
    contextNote:
      'Individual customer feedback from uploaded official YouEdu IQMAX+ PDF materials.',
  },
];

export const PRODUCT_USAGE_SPECS = {
  productName: 'IQMAX+',
  format: 'Chewable tablet (400mg · Mixfruit flavour)',
  quantityPerBox: '30 tablets per bottle/box',
  dosage: '1 tablet, 2 times daily',
  timing: 'After breakfast and after dinner',
  method: 'Chew or crush completely before swallowing',
  suitability: 'Children aged 2 years and above through adults',
  supervision: 'Young children should be supervised by an adult when chewing or taking crushed tablets',
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-what-is',
    question: 'What is IQMAX+?',
    answer:
      'YouEdu IQMAX+ is a Mixfruit-flavoured chewable nutritional supplement (400mg per tablet, 30 tablets per bottle). It combines prebiotics (Inulin & FOS), probiotics, Magnesium L-Threonate, Magnesium L-Theanine, Centella Asiatica Extract, essential vitamins (B3, B9, B12, D3), and mixed berry fruit powders to support daily focus, calmness, and gut wellness.',
  },
  {
    id: 'faq-suitable-for',
    question: 'Who is IQMAX+ suitable for?',
    answer:
      'IQMAX+ is suitable for children aged 2 years and above, school and university students, working adults, and families seeking convenient daily nutritional support. Young children should always be supervised by an adult.',
  },
  {
    id: 'faq-how-to-consume',
    question: 'How do I consume IQMAX+?',
    answer:
      'Take 1 tablet, 2 times daily — once after breakfast and once after dinner. Chew or crush the tablet completely before swallowing.',
  },
  {
    id: 'faq-tablets-per-box',
    question: 'How many tablets are in one bottle/box?',
    answer:
      'Each bottle/box of YouEdu IQMAX+ contains 30 chewable tablets (400mg each). Following 2 tablets daily, 1 bottle lasts 15 days; Package 2 (3 bottles total) lasts ~45 days; Package 3 (5 bottles total) lasts ~75 days for one person.',
  },
  {
    id: 'faq-pre-vs-pro',
    question: 'What is the difference between prebiotic and probiotic?',
    answer:
      'Probiotics are beneficial live microorganisms that support balanced intestinal microflora. Prebiotics (Inulin and Fructo-Oligosaccharide) are dietary fibers that nourish those beneficial bacteria. IQMAX+ combines both to complement the Gut × Mind nutritional link.',
  },
  {
    id: 'faq-shipping-payment',
    question: 'What are the delivery fees and payment methods?',
    answer:
      'Online Bank Transfer shipping is RM8 (Peninsular Malaysia) and RM10 (Sabah / Sarawak). Cash on Delivery (COD) is available at RM10 (Peninsular Malaysia) and RM17 (Sabah / Sarawak), charged once per order.',
  },
  {
    id: 'faq-pregnancy',
    question: 'Can pregnant or breastfeeding women or people on medication take IQMAX+?',
    answer:
      'If you are pregnant, breastfeeding, or taking prescription medication or other vitamin supplements, consult your doctor or qualified healthcare professional before starting IQMAX+.',
  },
  {
    id: 'faq-guarantee-iq',
    question: 'Does IQMAX+ guarantee higher IQ or exam marks?',
    answer:
      'No. IQMAX+ is a daily nutritional food supplement designed to complement focus, calmness, and gut wellness alongside balanced meals, adequate sleep, and consistent study habits. Individual experiences vary.',
  },
];

export const LEGAL_POLICIES: Record<
  PolicyKey,
  { title: string; updatedAt: string; sections: Array<{ heading: string; body: string }> }
> = {
  privacy: {
    title: 'Demo Privacy Notice',
    updatedAt: 'YouEdu IQMAX+ Academic Mobile App Demo Prototype',
    sections: [
      {
        heading: '1. Local Browser Simulation Only',
        body: 'This academic demonstration prototype runs strictly in your browser using localStorage. No external database, cloud authentication server, or real payment gateway is connected.',
      },
      {
        heading: '2. Demo Account & Order Storage',
        body: 'Profile details, demo login sessions, shopping cart items, and simulated DEMO orders are stored locally on this device so you can test the full mobile shopping experience.',
      },
    ],
  },
  terms: {
    title: 'Terms & Supplement Notice',
    updatedAt: 'YouEdu IQMAX+ Academic Mobile App Demo Prototype',
    sections: [
      {
        heading: '1. Academic Prototype Scope',
        body: 'All checkout confirmations, bank transfer receipts, and order statuses are marked as DEMO and are presented solely for academic lecturer evaluation.',
      },
      {
        heading: '2. Supplement Usage Notice',
        body: 'IQMAX+ is a food-grade chewable nutritional supplement and is not intended to diagnose, treat, cure, or prevent any disease. Recommended intake: 1 tablet twice daily.',
      },
      {
        heading: '3. Package Offers',
        body: 'Package 1: 1 bottle (RM59); Package 2: 2 bottles + 1 FREE = 3 bottles (RM100); Package 3: 3 bottles + 2 FREE = 5 bottles (RM150).',
      },
    ],
  },
  shipping: {
    title: 'Shipping & Delivery Guide (DEMO)',
    updatedAt: 'Peninsular Malaysia, Sabah & Sarawak',
    sections: [
      {
        heading: '1. Shipping Fee Schedule (Per Order)',
        body: 'Peninsular Malaysia: RM8.00 via Online Bank Transfer or RM10.00 via Cash on Delivery (COD). Sabah / Sarawak: RM10.00 via Online Bank Transfer or RM17.00 via Cash on Delivery (COD). Shipping is charged once per order regardless of bottle quantity.',
      },
    ],
  },
  refund: {
    title: 'Refund & Demo Order Policy',
    updatedAt: 'Academic Demonstration Guidelines',
    sections: [
      {
        heading: '1. Simulated Orders',
        body: 'Because all transactions in this prototype are simulated locally without real charges, no real financial settlement or physical courier dispatch occurs.',
      },
    ],
  },
};

export const MALAYSIAN_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Kuala Lumpur',
  'Labuan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Putrajaya',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
];
