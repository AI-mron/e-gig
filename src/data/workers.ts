import type { Worker } from '../types';

export const WORKERS: Worker[] = [
  // --- TV Technicians (Kilimani / Nairobi) ---
  {
    id: 'daniel-mwangi',
    name: 'Daniel Mwangi',
    category: 'tv_repair',
    title: 'TV & appliance technician',
    avatar: '/images/daniel-mwangi.jpg',
    rating: 4.8,
    reviewCount: 24,
    similarJobs: 12,
    location: 'Kilimani, Nairobi',
    serviceAreas: ['Kilimani', 'Nairobi', 'Westlands', 'Lavington', 'Kileleshwa'],
    diagnosticRate: 800,
    skills: ['Samsung TV repairs', 'LG TV diagnostics', 'Power board diagnostics', 'Display repair', 'Wall mounting'],
    bio: 'I repair TVs, home theatre systems and common home appliances across Nairobi. I focus on clear diagnosis, honest advice and quality workmanship.',
    experienceYears: 4,
    languages: ['English', 'Swahili'],
    isAvailableTomorrowAfternoon: true,
    isAvailableSaturday: true,
    fictionalRecommendation: {
      recommender: 'Grace',
      avatar: '/images/grace.jpg',
      text: 'Daniel helped me fix my Samsung TV. He was on time, explained the problem clearly and did a great job.',
      relationship: 'Friend in Kilimani'
    },
    sampleWorkHistory: [
      {
        title: "Samsung 55' TV repair (backlight & power)",
        location: 'Westlands, Nairobi',
        date: 'Mar 2024',
        category: 'TV Repair'
      },
      {
        title: 'LG TV – no display (diagnosis & board repair)',
        location: 'Kilimani, Nairobi',
        date: 'Feb 2024',
        category: 'TV Repair'
      },
      {
        title: 'Sony Bravia home theatre audio diagnostic',
        location: 'Lavington, Nairobi',
        date: 'Jan 2024',
        category: 'Audio/Video'
      }
    ],
    identityCheckedDemo: true
  },
  {
    id: 'amina-otieno',
    name: 'Amina Otieno',
    category: 'tv_repair',
    title: 'Electronics & TV specialist',
    avatar: '/images/amina-otieno.jpg',
    rating: 4.7,
    reviewCount: 18,
    similarJobs: 9,
    location: 'Nairobi',
    serviceAreas: ['Kilimani', 'Nairobi', 'CBD', 'Kileleshwa', 'Ngong Road'],
    diagnosticRate: 600,
    skills: ['TV display & power faults', 'Circuit diagnostics', 'Smart TV setup', 'Audio systems'],
    bio: 'Specialised electronic diagnostics with rapid component-level fault finding on all major LCD, LED, and Smart TV brands. Committed to transparent pricing.',
    experienceYears: 3,
    languages: ['English', 'Swahili', 'Luo'],
    isAvailableTomorrowAfternoon: true,
    isAvailableSaturday: true,
    fictionalRecommendation: null,
    sampleWorkHistory: [
      {
        title: 'Hisense 50\' power board diagnosis',
        location: 'Kilimani, Nairobi',
        date: 'Mar 2024',
        category: 'TV Repair'
      },
      {
        title: 'TCL LED screen flicker troubleshooting',
        location: 'Nairobi CBD',
        date: 'Feb 2024',
        category: 'TV Repair'
      }
    ],
    identityCheckedDemo: true
  },
  {
    id: 'brian-kamau',
    name: 'Brian Kamau',
    category: 'tv_repair',
    title: 'Senior Electronics Engineer',
    avatar: '/images/brian-kamau.jpg',
    rating: 4.9,
    reviewCount: 31,
    similarJobs: 16,
    location: 'Kilimani, Nairobi',
    serviceAreas: ['Kilimani', 'Nairobi', 'Karen'],
    diagnosticRate: 1000,
    skills: ['TV and home electronics', 'Mainboard micro-soldering', 'OLED / QLED diagnostics'],
    bio: 'Over 6 years repairing high-end smart televisions, audio systems, and micro-electronics in Kilimani. Fully equipped workshop and mobile diagnostic kit.',
    experienceYears: 6,
    languages: ['English', 'Swahili'],
    isAvailableTomorrowAfternoon: false, // EXPLICIT REQUIREMENT: Must not appear as available tomorrow afternoon!
    isAvailableSaturday: true,
    fictionalRecommendation: null,
    sampleWorkHistory: [
      {
        title: 'Sony 65\' 4K OLED motherboard repair',
        location: 'Kilimani, Nairobi',
        date: 'Apr 2024',
        category: 'TV Repair'
      }
    ],
    identityCheckedDemo: true
  },

  // --- Harvesting Workers (Nakuru) ---
  {
    id: 'james-kiplangat',
    name: 'James Kiplangat',
    category: 'harvesting',
    title: 'Lead Harvester & Crew Coordinator',
    avatar: '/images/james-kiplangat.jpg',
    rating: 4.8,
    reviewCount: 26,
    similarJobs: 18,
    location: 'Nakuru',
    serviceAreas: ['Nakuru', 'Njoro', 'Rongai', 'Subukia'],
    dailyRate: 1400,
    canLeadCrew: true,
    skills: ['Crew coordination', 'Maize & wheat harvesting', 'Quality sorting', 'Safety leadership'],
    bio: 'Experienced farm crew leader based in Nakuru. Specialises in organizing reliable harvesting teams, supervising field pace, and ensuring careful crop handling.',
    experienceYears: 7,
    languages: ['English', 'Swahili', 'Kalenjin'],
    isAvailableTomorrowAfternoon: true,
    isAvailableSaturday: true,
    fictionalRecommendation: {
      recommender: 'Peter',
      text: 'James coordinated our maize harvest last season smoothly and kept the team focused throughout the day.',
      relationship: 'Farm Owner in Njoro'
    },
    sampleWorkHistory: [
      {
        title: '15-acre maize harvesting crew lead',
        location: 'Njoro, Nakuru',
        date: 'Oct 2024',
        category: 'Harvesting'
      },
      {
        title: 'Horticultural vegetable harvesting & crating',
        location: 'Subukia, Nakuru',
        date: 'Sep 2024',
        category: 'Harvesting'
      }
    ],
    identityCheckedDemo: true
  },
  {
    id: 'mary-wanjiku',
    name: 'Mary Wanjiku',
    category: 'harvesting',
    title: 'Experienced Harvester',
    avatar: '/images/mary-wanjiku.jpg',
    rating: 4.7,
    reviewCount: 19,
    similarJobs: 14,
    location: 'Nakuru',
    serviceAreas: ['Nakuru', 'Bahati', 'Lanet'],
    dailyRate: 1200,
    canLeadCrew: false,
    skills: ['Vegetable harvesting', 'Post-harvest grading', 'Potato picking', 'Crop sorting'],
    bio: 'Fast, meticulous harvester with extensive experience in commercial potato, tomato, and maize collection across Nakuru farms.',
    experienceYears: 4,
    languages: ['English', 'Swahili', 'Kikuyu'],
    isAvailableTomorrowAfternoon: true,
    isAvailableSaturday: true,
    fictionalRecommendation: null,
    sampleWorkHistory: [
      {
        title: 'Potato harvesting & bagging (10 tons)',
        location: 'Bahati, Nakuru',
        date: 'Aug 2024',
        category: 'Harvesting'
      }
    ],
    identityCheckedDemo: true
  },
  {
    id: 'peter-otieno',
    name: 'Peter Otieno',
    category: 'harvesting',
    title: 'Field Worker & Harvester',
    avatar: '/images/peter-otieno.jpg',
    rating: 4.6,
    reviewCount: 16,
    similarJobs: 11,
    location: 'Nakuru',
    serviceAreas: ['Nakuru', 'Rongai', 'Kiamunyi'],
    dailyRate: 1200,
    canLeadCrew: false,
    skills: ['Cereal harvesting', 'Bagging & loading', 'Field clearing', 'Pest inspection'],
    bio: 'Dedicated agricultural worker known for high endurance, punctuality, and excellent teamwork during intensive harvest seasons.',
    experienceYears: 3,
    languages: ['English', 'Swahili', 'Luo'],
    isAvailableTomorrowAfternoon: true,
    isAvailableSaturday: true,
    fictionalRecommendation: null,
    sampleWorkHistory: [
      {
        title: 'Wheat harvesting & stooking',
        location: 'Rongai, Nakuru',
        date: 'Sep 2024',
        category: 'Harvesting'
      }
    ],
    identityCheckedDemo: true
  },
  {
    id: 'ruth-achieng',
    name: 'Ruth Achieng',
    category: 'harvesting',
    title: 'Skilled Field Harvester',
    avatar: '/images/ruth-achieng.jpg',
    rating: 4.9,
    reviewCount: 21,
    similarJobs: 17,
    location: 'Nakuru',
    serviceAreas: ['Nakuru', 'Njoro', 'Kaptembwa'],
    dailyRate: 1200,
    canLeadCrew: false,
    skills: ['Delicate crop picking', 'Beans & peas harvesting', 'Sorting & packaging', 'Quality control'],
    bio: 'Consistently top-rated for gentle crop handling and rapid harvesting rates. Experienced in greenhouse vegetables and open field legumes.',
    experienceYears: 5,
    languages: ['English', 'Swahili'],
    isAvailableTomorrowAfternoon: true,
    isAvailableSaturday: true,
    fictionalRecommendation: null,
    sampleWorkHistory: [
      {
        title: 'French beans harvest for export',
        location: 'Njoro, Nakuru',
        date: 'Oct 2024',
        category: 'Harvesting'
      }
    ],
    identityCheckedDemo: true
  },
  {
    id: 'samuel-mutua',
    name: 'Samuel Mutua',
    category: 'harvesting',
    title: 'Agricultural Harvester',
    avatar: '/images/samuel-mutua.jpg',
    rating: 4.5,
    reviewCount: 11,
    similarJobs: 8,
    location: 'Nakuru',
    serviceAreas: ['Nakuru', 'Lanet', 'Pipeline'],
    dailyRate: 1100,
    canLeadCrew: false,
    skills: ['General farm labour', 'Maize desucking & harvesting', 'Field transport assist'],
    bio: 'Energetic farm hand offering strong physical stamina and reliability for full-day field harvesting contracts.',
    experienceYears: 2,
    languages: ['Swahili', 'Kamba'],
    isAvailableTomorrowAfternoon: true,
    isAvailableSaturday: true,
    fictionalRecommendation: null,
    sampleWorkHistory: [
      {
        title: 'Maize harvest & transport staging',
        location: 'Lanet, Nakuru',
        date: 'Aug 2024',
        category: 'Harvesting'
      }
    ],
    identityCheckedDemo: true
  },
  {
    id: 'faith-njeri',
    name: 'Faith Njeri',
    category: 'harvesting',
    title: 'Crew Lead & Agricultural Harvester',
    avatar: '/images/faith-njeri.jpg',
    rating: 4.8,
    reviewCount: 22,
    similarJobs: 15,
    location: 'Nakuru',
    serviceAreas: ['Nakuru', 'Subukia', 'Bahati'],
    dailyRate: 1300,
    canLeadCrew: true,
    skills: ['Crew supervision', 'Horticultural harvesting', 'Record keeping', 'Field safety'],
    bio: 'Experienced farm coordinator who manages field crews effectively. Excellent communication, team pacing, and post-harvest produce care.',
    experienceYears: 6,
    languages: ['English', 'Swahili', 'Kikuyu'],
    isAvailableTomorrowAfternoon: true,
    isAvailableSaturday: true,
    fictionalRecommendation: null,
    sampleWorkHistory: [
      {
        title: 'Cabbage and kales harvest team lead',
        location: 'Bahati, Nakuru',
        date: 'Sep 2024',
        category: 'Harvesting'
      }
    ],
    identityCheckedDemo: true
  },
  {
    id: 'david-maina',
    name: 'David Maina',
    category: 'harvesting',
    title: 'Farm Labourer',
    avatar: '/images/david-maina.jpg',
    rating: 4.6,
    reviewCount: 14,
    similarJobs: 9,
    location: 'Nakuru',
    serviceAreas: ['Nakuru', 'Kiamunyi'],
    dailyRate: 1000,
    canLeadCrew: false,
    skills: ['Crop picking', 'Weeding & harvesting', 'General farm support'],
    bio: 'Dependable farm hand skilled in seasonal harvesting across Nakuru farms.',
    experienceYears: 3,
    languages: ['Swahili', 'Kikuyu'],
    isAvailableTomorrowAfternoon: true,
    isAvailableSaturday: false, // EXPLICIT REQUIREMENT: Unavailable in the example Saturday slot! Must not appear as available.
    fictionalRecommendation: null,
    sampleWorkHistory: [
      {
        title: 'Sweet potato harvest assist',
        location: 'Kiamunyi, Nakuru',
        date: 'Jul 2024',
        category: 'Harvesting'
      }
    ],
    identityCheckedDemo: true
  }
];
