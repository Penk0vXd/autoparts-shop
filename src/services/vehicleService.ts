import { VehicleMake, VehicleModel, VehicleEngine } from '@/types/vehicle'

/**
 * Vehicle Service
 * 
 * Service layer for fetching vehicle data. Currently uses mock data
 * but designed to be easily replaced with real API calls.
 */

// Mock data for vehicle makes
const mockMakes: VehicleMake[] = [
  {
    id: '1',
    name: 'BMW',
    slug: 'bmw',
    logo_url: '/logos/bmw.png',
    country: 'Germany',
    is_active: true
  },
  {
    id: '2',
    name: 'Mercedes-Benz',
    slug: 'mercedes-benz',
    logo_url: '/logos/mercedes-benz.png',
    country: 'Germany',
    is_active: true
  },
  {
    id: '3',
    name: 'Audi',
    slug: 'audi',
    logo_url: '/logos/audi.png',
    country: 'Germany',
    is_active: true
  },
  {
    id: '4',
    name: 'Volkswagen',
    slug: 'volkswagen',
    logo_url: undefined,
    country: 'Germany',
    is_active: true
  },
  {
    id: '5',
    name: 'Opel',
    slug: 'opel',
    logo_url: '/logos/opel.png',
    country: 'Germany',
    is_active: true
  },
  {
    id: '6',
    name: 'Ford',
    slug: 'ford',
    logo_url: undefined,
    country: 'USA',
    is_active: true
  },
  {
    id: '7',
    name: 'Renault',
    slug: 'renault',
    logo_url: '/logos/renault.png',
    country: 'France',
    is_active: true
  },
  {
    id: '8',
    name: 'Peugeot',
    slug: 'peugeot',
    logo_url: '/logos/peugeot.png',
    country: 'France',
    is_active: true
  },
  {
    id: '9',
    name: 'Citroën',
    slug: 'citroen',
    logo_url: undefined,
    country: 'France',
    is_active: true
  },
  {
    id: '10',
    name: 'Skoda',
    slug: 'skoda',
    logo_url: undefined,
    country: 'Czech Republic',
    is_active: true
  },
  {
    id: '11',
    name: 'Fiat',
    slug: 'fiat',
    logo_url: undefined,
    country: 'Italy',
    is_active: true
  },
  {
    id: '12',
    name: 'Toyota',
    slug: 'toyota',
    logo_url: undefined,
    country: 'Japan',
    is_active: true
  },
  {
    id: '13',
    name: 'Honda',
    slug: 'honda',
    logo_url: undefined,
    country: 'Japan',
    is_active: true
  },
  {
    id: '14',
    name: 'Nissan',
    slug: 'nissan',
    logo_url: '/logos/nissan.png',
    country: 'Japan',
    is_active: true
  },
  {
    id: '15',
    name: 'Hyundai',
    slug: 'hyundai',
    logo_url: '/logos/hyundai.png',
    country: 'South Korea',
    is_active: true
  },
  {
    id: '16',
    name: 'Kia',
    slug: 'kia',
    logo_url: '/logos/kia.png',
    country: 'South Korea',
    is_active: true
  },
  {
    id: '17',
    name: 'Seat',
    slug: 'seat',
    logo_url: '/logos/seat.png',
    country: 'Spain',
    is_active: true
  },
  {
    id: '18',
    name: 'Volvo',
    slug: 'volvo',
    logo_url: '/logos/volvo.png',
    country: 'Sweden',
    is_active: true
  },
  {
    id: '19',
    name: 'Dacia',
    slug: 'dacia',
    logo_url: '/logos/dacia.png',
    country: 'Romania',
    is_active: true
  },
  {
    id: '20',
    name: 'Alfa Romeo',
    slug: 'alfa-romeo',
    logo_url: '/logos/alfa-romeo.png',
    country: 'Italy',
    is_active: true
  }
]

// Mock data for vehicle models
const mockModels: Record<string, VehicleModel[]> = {
  '1': [ // BMW
    {
      id: '1-1',
      make_id: '1',
      name: '3 Series',
      slug: '3-series',
      generation: 'F30',
      year_start: 2012,
      year_end: 2019,
      is_active: true
    },
    {
      id: '1-2',
      make_id: '1',
      name: '5 Series',
      slug: '5-series',
      generation: 'F10',
      year_start: 2010,
      year_end: 2017,
      is_active: true
    },
    {
      id: '1-3',
      make_id: '1',
      name: 'X3',
      slug: 'x3',
      generation: 'F25',
      year_start: 2010,
      year_end: 2017,
      is_active: true
    },
    {
      id: '1-4',
      make_id: '1',
      name: 'X5',
      slug: 'x5',
      generation: 'F15',
      year_start: 2013,
      year_end: 2018,
      is_active: true
    }
  ],
  '2': [ // Mercedes-Benz
    {
      id: '2-1',
      make_id: '2',
      name: 'C-Class',
      slug: 'c-class',
      generation: 'W205',
      year_start: 2014,
      year_end: 2021,
      is_active: true
    },
    {
      id: '2-2',
      make_id: '2',
      name: 'E-Class',
      slug: 'e-class',
      generation: 'W213',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '2-3',
      make_id: '2',
      name: 'GLC',
      slug: 'glc',
      generation: 'X253',
      year_start: 2015,
      year_end: 2022,
      is_active: true
    }
  ],
  '3': [ // Audi
    {
      id: '3-1',
      make_id: '3',
      name: 'A4',
      slug: 'a4',
      generation: 'B9',
      year_start: 2015,
      year_end: 2023,
      is_active: true
    },
    {
      id: '3-2',
      make_id: '3',
      name: 'A6',
      slug: 'a6',
      generation: 'C7',
      year_start: 2011,
      year_end: 2018,
      is_active: true
    },
    {
      id: '3-3',
      make_id: '3',
      name: 'Q5',
      slug: 'q5',
      generation: 'FY',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    }
  ],
  '4': [ // Volkswagen
    {
      id: '4-1',
      make_id: '4',
      name: 'Golf',
      slug: 'golf',
      generation: 'VII',
      year_start: 2012,
      year_end: 2020,
      is_active: true
    },
    {
      id: '4-2',
      make_id: '4',
      name: 'Passat',
      slug: 'passat',
      generation: 'B8',
      year_start: 2014,
      year_end: 2022,
      is_active: true
    },
    {
      id: '4-3',
      make_id: '4',
      name: 'Tiguan',
      slug: 'tiguan',
      generation: 'II',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    }
  ],
  '5': [ // Opel
    {
      id: '5-1',
      make_id: '5',
      name: 'Astra',
      slug: 'astra',
      generation: 'K',
      year_start: 2015,
      year_end: 2022,
      is_active: true
    },
    {
      id: '5-2',
      make_id: '5',
      name: 'Insignia',
      slug: 'insignia',
      generation: 'B',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '5-3',
      make_id: '5',
      name: 'Corsa',
      slug: 'corsa',
      generation: 'F',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '5-4',
      make_id: '5',
      name: 'Crossland',
      slug: 'crossland',
      generation: 'I',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    }
  ],
  '6': [ // Ford
    {
      id: '6-1',
      make_id: '6',
      name: 'Focus',
      slug: 'focus',
      generation: 'IV',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '6-2',
      make_id: '6',
      name: 'Fiesta',
      slug: 'fiesta',
      generation: 'VII',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '6-3',
      make_id: '6',
      name: 'Kuga',
      slug: 'kuga',
      generation: 'III',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '6-4',
      make_id: '6',
      name: 'Mustang',
      slug: 'mustang',
      generation: 'VI',
      year_start: 2014,
      year_end: 2023,
      is_active: true
    },
    {
      id: '6-5',
      make_id: '6',
      name: 'Transit',
      slug: 'transit',
      generation: 'IV',
      year_start: 2013,
      year_end: 2023,
      is_active: true
    }
  ],
  '7': [ // Renault
    {
      id: '7-1',
      make_id: '7',
      name: 'Clio',
      slug: 'clio',
      generation: 'V',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '7-2',
      make_id: '7',
      name: 'Megane',
      slug: 'megane',
      generation: 'IV',
      year_start: 2015,
      year_end: 2023,
      is_active: true
    },
    {
      id: '7-3',
      make_id: '7',
      name: 'Captur',
      slug: 'captur',
      generation: 'II',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '7-4',
      make_id: '7',
      name: 'Kadjar',
      slug: 'kadjar',
      generation: 'I',
      year_start: 2015,
      year_end: 2022,
      is_active: true
    },
    {
      id: '7-5',
      make_id: '7',
      name: 'Talisman',
      slug: 'talisman',
      generation: 'I',
      year_start: 2015,
      year_end: 2022,
      is_active: true
    }
  ],
  '8': [ // Peugeot
    {
      id: '8-1',
      make_id: '8',
      name: '208',
      slug: '208',
      generation: 'II',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '8-2',
      make_id: '8',
      name: '308',
      slug: '308',
      generation: 'III',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    },
    {
      id: '8-3',
      make_id: '8',
      name: '3008',
      slug: '3008',
      generation: 'II',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '8-4',
      make_id: '8',
      name: '5008',
      slug: '5008',
      generation: 'II',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '8-5',
      make_id: '8',
      name: '508',
      slug: '508',
      generation: 'II',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    }
  ],
  '9': [ // Citroën
    {
      id: '9-1',
      make_id: '9',
      name: 'C3',
      slug: 'c3',
      generation: 'III',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '9-2',
      make_id: '9',
      name: 'C4',
      slug: 'c4',
      generation: 'III',
      year_start: 2020,
      year_end: 2023,
      is_active: true
    },
    {
      id: '9-3',
      make_id: '9',
      name: 'C5 Aircross',
      slug: 'c5-aircross',
      generation: 'I',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '9-4',
      make_id: '9',
      name: 'Berlingo',
      slug: 'berlingo',
      generation: 'III',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '9-5',
      make_id: '9',
      name: 'SpaceTourer',
      slug: 'spacetourer',
      generation: 'I',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    }
  ],
  '10': [ // Skoda
    {
      id: '10-1',
      make_id: '10',
      name: 'Octavia',
      slug: 'octavia',
      generation: 'IV',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '10-2',
      make_id: '10',
      name: 'Superb',
      slug: 'superb',
      generation: 'III',
      year_start: 2015,
      year_end: 2023,
      is_active: true
    },
    {
      id: '10-3',
      make_id: '10',
      name: 'Fabia',
      slug: 'fabia',
      generation: 'IV',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    },
    {
      id: '10-4',
      make_id: '10',
      name: 'Kodiaq',
      slug: 'kodiaq',
      generation: 'I',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '10-5',
      make_id: '10',
      name: 'Karoq',
      slug: 'karoq',
      generation: 'I',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    }
  ],
  '11': [ // Fiat
    {
      id: '11-1',
      make_id: '11',
      name: 'Punto',
      slug: 'punto',
      generation: 'III',
      year_start: 2005,
      year_end: 2018,
      is_active: true
    },
    {
      id: '11-2',
      make_id: '11',
      name: '500',
      slug: '500',
      generation: 'II',
      year_start: 2007,
      year_end: 2020,
      is_active: true
    },
    {
      id: '11-3',
      make_id: '11',
      name: 'Panda',
      slug: 'panda',
      generation: 'III',
      year_start: 2011,
      year_end: 2023,
      is_active: true
    },
    {
      id: '11-4',
      make_id: '11',
      name: 'Tipo',
      slug: 'tipo',
      generation: 'III',
      year_start: 2015,
      year_end: 2023,
      is_active: true
    },
    {
      id: '11-5',
      make_id: '11',
      name: 'Ducato',
      slug: 'ducato',
      generation: 'IV',
      year_start: 2014,
      year_end: 2023,
      is_active: true
    }
  ],
  '12': [ // Toyota
    {
      id: '12-1',
      make_id: '12',
      name: 'Corolla',
      slug: 'corolla',
      generation: 'XII',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '12-2',
      make_id: '12',
      name: 'Camry',
      slug: 'camry',
      generation: 'VIII',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '12-3',
      make_id: '12',
      name: 'RAV4',
      slug: 'rav4',
      generation: 'V',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '12-4',
      make_id: '12',
      name: 'Prius',
      slug: 'prius',
      generation: 'IV',
      year_start: 2015,
      year_end: 2023,
      is_active: true
    },
    {
      id: '12-5',
      make_id: '12',
      name: 'Highlander',
      slug: 'highlander',
      generation: 'IV',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '12-6',
      make_id: '12',
      name: 'Yaris',
      slug: 'yaris',
      generation: 'IV',
      year_start: 2020,
      year_end: 2023,
      is_active: true
    }
  ],
  '13': [ // Honda
    {
      id: '13-1',
      make_id: '13',
      name: 'Civic',
      slug: 'civic',
      generation: 'XI',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    },
    {
      id: '13-2',
      make_id: '13',
      name: 'Accord',
      slug: 'accord',
      generation: 'X',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '13-3',
      make_id: '13',
      name: 'CR-V',
      slug: 'cr-v',
      generation: 'V',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '13-4',
      make_id: '13',
      name: 'Pilot',
      slug: 'pilot',
      generation: 'III',
      year_start: 2015,
      year_end: 2023,
      is_active: true
    },
    {
      id: '13-5',
      make_id: '13',
      name: 'HR-V',
      slug: 'hr-v',
      generation: 'II',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    },
    {
      id: '13-6',
      make_id: '13',
      name: 'Jazz',
      slug: 'jazz',
      generation: 'IV',
      year_start: 2020,
      year_end: 2023,
      is_active: true
    }
  ],
  '14': [ // Nissan
    {
      id: '14-1',
      make_id: '14',
      name: 'Qashqai',
      slug: 'qashqai',
      generation: 'III',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    },
    {
      id: '14-2',
      make_id: '14',
      name: 'X-Trail',
      slug: 'x-trail',
      generation: 'IV',
      year_start: 2022,
      year_end: 2023,
      is_active: true
    },
    {
      id: '14-3',
      make_id: '14',
      name: 'Juke',
      slug: 'juke',
      generation: 'II',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '14-4',
      make_id: '14',
      name: 'Micra',
      slug: 'micra',
      generation: 'V',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '14-5',
      make_id: '14',
      name: 'Leaf',
      slug: 'leaf',
      generation: 'II',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '14-6',
      make_id: '14',
      name: 'Navara',
      slug: 'navara',
      generation: 'III',
      year_start: 2014,
      year_end: 2023,
      is_active: true
    }
  ],
  '15': [ // Hyundai
    {
      id: '15-1',
      make_id: '15',
      name: 'i10',
      slug: 'i10',
      generation: 'III',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '15-2',
      make_id: '15',
      name: 'i20',
      slug: 'i20',
      generation: 'III',
      year_start: 2020,
      year_end: 2023,
      is_active: true
    },
    {
      id: '15-3',
      make_id: '15',
      name: 'i30',
      slug: 'i30',
      generation: 'III',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '15-4',
      make_id: '15',
      name: 'Tucson',
      slug: 'tucson',
      generation: 'IV',
      year_start: 2020,
      year_end: 2023,
      is_active: true
    },
    {
      id: '15-5',
      make_id: '15',
      name: 'Santa Fe',
      slug: 'santa-fe',
      generation: 'IV',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '15-6',
      make_id: '15',
      name: 'Kona',
      slug: 'kona',
      generation: 'I',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    }
  ],
  '16': [ // Kia
    {
      id: '16-1',
      make_id: '16',
      name: 'Picanto',
      slug: 'picanto',
      generation: 'III',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '16-2',
      make_id: '16',
      name: 'Rio',
      slug: 'rio',
      generation: 'IV',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '16-3',
      make_id: '16',
      name: 'Ceed',
      slug: 'ceed',
      generation: 'III',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '16-4',
      make_id: '16',
      name: 'Sportage',
      slug: 'sportage',
      generation: 'V',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    },
    {
      id: '16-5',
      make_id: '16',
      name: 'Sorento',
      slug: 'sorento',
      generation: 'IV',
      year_start: 2020,
      year_end: 2023,
      is_active: true
    },
    {
      id: '16-6',
      make_id: '16',
      name: 'Stinger',
      slug: 'stinger',
      generation: 'I',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    }
  ],
  '17': [ // Seat
    {
      id: '17-1',
      make_id: '17',
      name: 'Ibiza',
      slug: 'ibiza',
      generation: 'V',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '17-2',
      make_id: '17',
      name: 'Leon',
      slug: 'leon',
      generation: 'IV',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '17-3',
      make_id: '17',
      name: 'Arona',
      slug: 'arona',
      generation: 'I',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '17-4',
      make_id: '17',
      name: 'Ateca',
      slug: 'ateca',
      generation: 'I',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '17-5',
      make_id: '17',
      name: 'Tarraco',
      slug: 'tarraco',
      generation: 'I',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    }
  ],
  '18': [ // Volvo
    {
      id: '18-1',
      make_id: '18',
      name: 'XC40',
      slug: 'xc40',
      generation: 'I',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '18-2',
      make_id: '18',
      name: 'XC60',
      slug: 'xc60',
      generation: 'II',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '18-3',
      make_id: '18',
      name: 'XC90',
      slug: 'xc90',
      generation: 'II',
      year_start: 2014,
      year_end: 2023,
      is_active: true
    },
    {
      id: '18-4',
      make_id: '18',
      name: 'S60',
      slug: 's60',
      generation: 'III',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '18-5',
      make_id: '18',
      name: 'S90',
      slug: 's90',
      generation: 'II',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '18-6',
      make_id: '18',
      name: 'V60',
      slug: 'v60',
      generation: 'II',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    }
  ],
  '19': [ // Dacia
    {
      id: '19-1',
      make_id: '19',
      name: 'Sandero',
      slug: 'sandero',
      generation: 'III',
      year_start: 2020,
      year_end: 2023,
      is_active: true
    },
    {
      id: '19-2',
      make_id: '19',
      name: 'Duster',
      slug: 'duster',
      generation: 'II',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '19-3',
      make_id: '19',
      name: 'Logan',
      slug: 'logan',
      generation: 'III',
      year_start: 2020,
      year_end: 2023,
      is_active: true
    },
    {
      id: '19-4',
      make_id: '19',
      name: 'Lodgy',
      slug: 'lodgy',
      generation: 'I',
      year_start: 2012,
      year_end: 2022,
      is_active: true
    },
    {
      id: '19-5',
      make_id: '19',
      name: 'Spring',
      slug: 'spring',
      generation: 'I',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    }
  ],
  '20': [ // Alfa Romeo
    {
      id: '20-1',
      make_id: '20',
      name: 'Giulia',
      slug: 'giulia',
      generation: 'II',
      year_start: 2015,
      year_end: 2023,
      is_active: true
    },
    {
      id: '20-2',
      make_id: '20',
      name: 'Stelvio',
      slug: 'stelvio',
      generation: 'I',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '20-3',
      make_id: '20',
      name: 'Giulietta',
      slug: 'giulietta',
      generation: 'I',
      year_start: 2010,
      year_end: 2020,
      is_active: true
    },
    {
      id: '20-4',
      make_id: '20',
      name: 'Tonale',
      slug: 'tonale',
      generation: 'I',
      year_start: 2022,
      year_end: 2023,
      is_active: true
    },
    {
      id: '20-5',
      make_id: '20',
      name: 'MiTo',
      slug: 'mito',
      generation: 'I',
      year_start: 2008,
      year_end: 2018,
      is_active: true
    }
  ]
}

// Mock data for vehicle engines
const mockEngines: Record<string, VehicleEngine[]> = {
  '1-1': [ // BMW 3 Series
    {
      id: '1-1-1',
      model_id: '1-1',
      code: 'N20B20',
      name: '320i',
      displacement: 2.0,
      power: 184,
      fuel: 'gasoline',
      year_start: 2012,
      year_end: 2016,
      is_active: true
    },
    {
      id: '1-1-2',
      model_id: '1-1',
      code: 'N47D20',
      name: '318d',
      displacement: 2.0,
      power: 143,
      fuel: 'diesel',
      year_start: 2012,
      year_end: 2015,
      is_active: true
    },
    {
      id: '1-1-3',
      model_id: '1-1',
      code: 'B47D20',
      name: '320d',
      displacement: 2.0,
      power: 190,
      fuel: 'diesel',
      year_start: 2014,
      year_end: 2019,
      is_active: true
    }
  ],
  '2-1': [ // Mercedes C-Class
    {
      id: '2-1-1',
      model_id: '2-1',
      code: 'M274',
      name: 'C200',
      displacement: 2.0,
      power: 184,
      fuel: 'gasoline',
      year_start: 2014,
      year_end: 2018,
      is_active: true
    },
    {
      id: '2-1-2',
      model_id: '2-1',
      code: 'OM651',
      name: 'C220d',
      displacement: 2.1,
      power: 170,
      fuel: 'diesel',
      year_start: 2014,
      year_end: 2018,
      is_active: true
    }
  ],
  '3-1': [ // Audi A4
    {
      id: '3-1-1',
      model_id: '3-1',
      code: 'CVNA',
      name: '2.0 TFSI',
      displacement: 2.0,
      power: 190,
      fuel: 'gasoline',
      year_start: 2015,
      year_end: 2019,
      is_active: true
    },
    {
      id: '3-1-2',
      model_id: '3-1',
      code: 'CUNA',
      name: '2.0 TDI',
      displacement: 2.0,
      power: 150,
      fuel: 'diesel',
      year_start: 2015,
      year_end: 2019,
      is_active: true
    }
  ],
  '4-1': [ // VW Golf
    {
      id: '4-1-1',
      model_id: '4-1',
      code: 'CHHA',
      name: '1.4 TSI',
      displacement: 1.4,
      power: 125,
      fuel: 'gasoline',
      year_start: 2012,
      year_end: 2016,
      is_active: true
    },
    {
      id: '4-1-2',
      model_id: '4-1',
      code: 'CUNA',
      name: '2.0 TDI',
      displacement: 2.0,
      power: 150,
      fuel: 'diesel',
      year_start: 2012,
      year_end: 2017,
      is_active: true
    }
  ],
  '6-1': [ // Ford Focus
    {
      id: '6-1-1',
      model_id: '6-1',
      code: 'GTDI',
      name: '1.0 EcoBoost',
      displacement: 1.0,
      power: 100,
      fuel: 'gasoline',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '6-1-2',
      model_id: '6-1',
      code: 'GTDI',
      name: '1.5 EcoBoost',
      displacement: 1.5,
      power: 150,
      fuel: 'gasoline',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '6-1-3',
      model_id: '6-1',
      code: 'TDCI',
      name: '1.5 TDCi',
      displacement: 1.5,
      power: 120,
      fuel: 'diesel',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    }
  ],
  '6-2': [ // Ford Fiesta
    {
      id: '6-2-1',
      model_id: '6-2',
      code: 'GTDI',
      name: '1.0 EcoBoost',
      displacement: 1.0,
      power: 100,
      fuel: 'gasoline',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '6-2-2',
      model_id: '6-2',
      code: 'GTDI',
      name: '1.1 Ti-VCT',
      displacement: 1.1,
      power: 75,
      fuel: 'gasoline',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    }
  ],
  '7-1': [ // Renault Clio
    {
      id: '7-1-1',
      model_id: '7-1',
      code: 'TCe',
      name: '1.0 TCe',
      displacement: 1.0,
      power: 100,
      fuel: 'gasoline',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '7-1-2',
      model_id: '7-1',
      code: 'SCe',
      name: '1.0 SCe',
      displacement: 1.0,
      power: 75,
      fuel: 'gasoline',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '7-1-3',
      model_id: '7-1',
      code: 'dCi',
      name: '1.5 dCi',
      displacement: 1.5,
      power: 85,
      fuel: 'diesel',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    }
  ],
  '8-1': [ // Peugeot 208
    {
      id: '8-1-1',
      model_id: '8-1',
      code: 'PureTech',
      name: '1.2 PureTech',
      displacement: 1.2,
      power: 100,
      fuel: 'gasoline',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '8-1-2',
      model_id: '8-1',
      code: 'BlueHDi',
      name: '1.5 BlueHDi',
      displacement: 1.5,
      power: 100,
      fuel: 'diesel',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '8-1-3',
      model_id: '8-1',
      code: 'Electric',
      name: 'e-208',
      displacement: 0.0,
      power: 136,
      fuel: 'electric',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    }
  ],
  '10-1': [ // Skoda Octavia
    {
      id: '10-1-1',
      model_id: '10-1',
      code: 'TSI',
      name: '1.0 TSI',
      displacement: 1.0,
      power: 110,
      fuel: 'gasoline',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '10-1-2',
      model_id: '10-1',
      code: 'TSI',
      name: '1.5 TSI',
      displacement: 1.5,
      power: 150,
      fuel: 'gasoline',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '10-1-3',
      model_id: '10-1',
      code: 'TDI',
      name: '2.0 TDI',
      displacement: 2.0,
      power: 150,
      fuel: 'diesel',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    }
  ],
  '12-1': [ // Toyota Corolla
    {
      id: '12-1-1',
      model_id: '12-1',
      code: 'M20A',
      name: '2.0 Hybrid',
      displacement: 2.0,
      power: 122,
      fuel: 'hybrid',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    },
    {
      id: '12-1-2',
      model_id: '12-1',
      code: 'M20A',
      name: '2.0 VVT-i',
      displacement: 2.0,
      power: 175,
      fuel: 'gasoline',
      year_start: 2019,
      year_end: 2023,
      is_active: true
    }
  ],
  '12-3': [ // Toyota RAV4
    {
      id: '12-3-1',
      model_id: '12-3',
      code: 'M20A',
      name: '2.0 VVT-i',
      displacement: 2.0,
      power: 175,
      fuel: 'gasoline',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '12-3-2',
      model_id: '12-3',
      code: 'A25A',
      name: '2.5 Hybrid',
      displacement: 2.5,
      power: 218,
      fuel: 'hybrid',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    }
  ],
  '13-1': [ // Honda Civic
    {
      id: '13-1-1',
      model_id: '13-1',
      code: 'L15B',
      name: '1.5 VTEC Turbo',
      displacement: 1.5,
      power: 182,
      fuel: 'gasoline',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    },
    {
      id: '13-1-2',
      model_id: '13-1',
      code: 'K20C',
      name: '2.0 VTEC',
      displacement: 2.0,
      power: 158,
      fuel: 'gasoline',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    }
  ],
  '13-3': [ // Honda CR-V
    {
      id: '13-3-1',
      model_id: '13-3',
      code: 'L15B',
      name: '1.5 VTEC Turbo',
      displacement: 1.5,
      power: 193,
      fuel: 'gasoline',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '13-3-2',
      model_id: '13-3',
      code: 'LFA',
      name: '2.0 i-MMD Hybrid',
      displacement: 2.0,
      power: 184,
      fuel: 'hybrid',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    }
  ],
  '14-1': [ // Nissan Qashqai
    {
      id: '14-1-1',
      model_id: '14-1',
      code: 'HR12',
      name: '1.3 DIG-T',
      displacement: 1.3,
      power: 140,
      fuel: 'gasoline',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    },
    {
      id: '14-1-2',
      model_id: '14-1',
      code: 'HR12',
      name: '1.3 DIG-T',
      displacement: 1.3,
      power: 158,
      fuel: 'gasoline',
      year_start: 2021,
      year_end: 2023,
      is_active: true
    }
  ],
  '15-3': [ // Hyundai i30
    {
      id: '15-3-1',
      model_id: '15-3',
      code: 'G4FG',
      name: '1.0 T-GDI',
      displacement: 1.0,
      power: 120,
      fuel: 'gasoline',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '15-3-2',
      model_id: '15-3',
      code: 'G4FJ',
      name: '1.5 T-GDI',
      displacement: 1.5,
      power: 160,
      fuel: 'gasoline',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    },
    {
      id: '15-3-3',
      model_id: '15-3',
      code: 'D4FB',
      name: '1.6 CRDi',
      displacement: 1.6,
      power: 136,
      fuel: 'diesel',
      year_start: 2016,
      year_end: 2023,
      is_active: true
    }
  ],
  '16-3': [ // Kia Ceed
    {
      id: '16-3-1',
      model_id: '16-3',
      code: 'G4FG',
      name: '1.0 T-GDI',
      displacement: 1.0,
      power: 120,
      fuel: 'gasoline',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '16-3-2',
      model_id: '16-3',
      code: 'G4FJ',
      name: '1.4 T-GDI',
      displacement: 1.4,
      power: 140,
      fuel: 'gasoline',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    },
    {
      id: '16-3-3',
      model_id: '16-3',
      code: 'D4FB',
      name: '1.6 CRDi',
      displacement: 1.6,
      power: 136,
      fuel: 'diesel',
      year_start: 2018,
      year_end: 2023,
      is_active: true
    }
  ],
  '18-1': [ // Volvo XC40
    {
      id: '18-1-1',
      model_id: '18-1',
      code: 'B3',
      name: 'T3',
      displacement: 1.5,
      power: 163,
      fuel: 'gasoline',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '18-1-2',
      model_id: '18-1',
      code: 'B4',
      name: 'T4',
      displacement: 2.0,
      power: 197,
      fuel: 'gasoline',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '18-1-3',
      model_id: '18-1',
      code: 'D3',
      name: 'D3',
      displacement: 2.0,
      power: 150,
      fuel: 'diesel',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    }
  ],
  '19-2': [ // Dacia Duster
    {
      id: '19-2-1',
      model_id: '19-2',
      code: 'SCe',
      name: '1.0 SCe',
      displacement: 1.0,
      power: 100,
      fuel: 'gasoline',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '19-2-2',
      model_id: '19-2',
      code: 'TCe',
      name: '1.3 TCe',
      displacement: 1.3,
      power: 130,
      fuel: 'gasoline',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    },
    {
      id: '19-2-3',
      model_id: '19-2',
      code: 'dCi',
      name: '1.5 dCi',
      displacement: 1.5,
      power: 115,
      fuel: 'diesel',
      year_start: 2017,
      year_end: 2023,
      is_active: true
    }
  ],
  '20-1': [ // Alfa Romeo Giulia
    {
      id: '20-1-1',
      model_id: '20-1',
      code: 'GME',
      name: '2.0 Turbo',
      displacement: 2.0,
      power: 200,
      fuel: 'gasoline',
      year_start: 2015,
      year_end: 2023,
      is_active: true
    },
    {
      id: '20-1-2',
      model_id: '20-1',
      code: 'GME',
      name: '2.0 Turbo',
      displacement: 2.0,
      power: 280,
      fuel: 'gasoline',
      year_start: 2015,
      year_end: 2023,
      is_active: true
    },
    {
      id: '20-1-3',
      model_id: '20-1',
      code: 'MultiJet',
      name: '2.2 JTD',
      displacement: 2.2,
      power: 190,
      fuel: 'diesel',
      year_start: 2015,
      year_end: 2023,
      is_active: true
    }
  ]
}

/**
 * Simulate API delay for realistic UX
 */
const simulateDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Get all available vehicle makes
 */
export async function getVehicleMakes(): Promise<VehicleMake[]> {
  await simulateDelay(300)
  
  // In production, this would be:
  // const response = await fetch('/api/vehicles/makes')
  // return response.json()
  
  return mockMakes.filter(make => make.is_active)
}

/**
 * Get vehicle models for a specific make
 */
export async function getVehicleModels(makeId: string): Promise<VehicleModel[]> {
  await simulateDelay(400)
  
  // In production, this would be:
  // const response = await fetch(`/api/vehicles/makes/${makeId}/models`)
  // return response.json()
  
  return mockModels[makeId] || []
}

/**
 * Get available years for a specific model
 */
export async function getVehicleYears(modelId: string): Promise<number[]> {
  await simulateDelay(300)
  
  // In production, this would be:
  // const response = await fetch(`/api/vehicles/models/${modelId}/years`)
  // return response.json()
  
  const model = Object.values(mockModels)
    .flat()
    .find(m => m.id === modelId)
  
  if (!model) return []
  
  const years: number[] = []
  const startYear = model.year_start
  const endYear = model.year_end || new Date().getFullYear()
  
  for (let year = startYear; year <= endYear; year++) {
    years.push(year)
  }
  
  return years.reverse() // Most recent first
}

/**
 * Get available engines for a specific model and year
 */
export async function getVehicleEngines(modelId: string, year: number): Promise<VehicleEngine[]> {
  await simulateDelay(400)
  
  // In production, this would be:
  // const response = await fetch(`/api/vehicles/models/${modelId}/engines?year=${year}`)
  // return response.json()
  
  const engines = mockEngines[modelId] || []
  
  // Filter engines by year availability
  return engines.filter(engine => {
    return year >= engine.year_start && 
           year <= (engine.year_end || new Date().getFullYear())
  })
}

/**
 * Search vehicles by VIN (placeholder for VIN decoder integration)
 */
export async function searchVehicleByVIN(vin: string): Promise<any> {
  await simulateDelay(800)
  
  // In production, this would integrate with a VIN decoder service:
  // const response = await fetch(`/api/vehicles/decode-vin/${vin}`)
  // return response.json()
  
  // Mock response for demonstration
  return {
    vin,
    make: 'BMW',
    model: '3 Series',
    year: 2015,
    engine: '320d',
    bodyType: 'Sedan',
    doors: 4,
    fuel: 'diesel',
    displacement: 2.0,
    power: 190
  }
}

/**
 * Get vehicle compatibility for a product
 */
export async function getVehicleCompatibility(productId: string): Promise<any> {
  await simulateDelay(200)
  
  // In production, this would be:
  // const response = await fetch(`/api/products/${productId}/compatibility`)
  // return response.json()
  
  // Mock compatibility data
  return {
    makes: ['BMW', 'Mercedes-Benz', 'Audi'],
    models: ['3 Series', 'C-Class', 'A4'],
    years: ['2012-2019', '2014-2021', '2015-2023'],
    engines: ['320i', '318d', '320d', 'C200', 'C220d', '2.0 TFSI', '2.0 TDI']
  }
} 