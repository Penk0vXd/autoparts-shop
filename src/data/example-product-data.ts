/**
 * Example Product Data for Bulgarian Automotive Parts Store
 * 
 * Comprehensive sample data for testing and development of the Product Card component.
 * Includes realistic automotive parts data with Bulgarian market specifics.
 */

import { ProductCardData } from '@/types/product-card'

export const EXAMPLE_PRODUCT_DATA: ProductCardData[] = [
  {
    id: 'brake-pads-bmw-001',
    name: 'Накладки за спирачки BMW 3 серия',
    slug: 'brake-pads-bmw-3-series',
    description: 'Висококачествени накладки за спирачки за BMW 3 серия. Отлично сцепление, дълготрайност и надеждност. Сертифицирани по европейски стандарти.',
    shortDescription: 'Висококачествени накладки за спирачки за BMW 3 серия с отлично сцепление.',
    price: {
      current: 129.99,
      original: 159.99,
      currency: 'BGN',
      currencySymbol: 'лв.',
      isOnSale: true,
      discountPercent: 19,
      installments: [
        {
          months: 3,
          monthlyPayment: 43.33,
          totalAmount: 129.99,
          interestRate: 0,
          provider: 'Тест Финанс'
        }
      ],
      vatIncluded: true,
      minOrderQuantity: 1,
      maxOrderQuantity: 10
    },
    images: [
      {
        id: 'brake-pads-001-1',
        url: '/images/products/brake-pads-bmw-001-1.jpg',
        alt: 'Накладки за спирачки BMW 3 серия - основно изображение',
        title: 'Накладки за спирачки BMW 3 серия',
        width: 800,
        height: 600,
        isPrimary: true,
        priority: true,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      },
      {
        id: 'brake-pads-001-2',
        url: '/images/products/brake-pads-bmw-001-2.jpg',
        alt: 'Накладки за спирачки BMW 3 серия - детайл',
        title: 'Детайл на накладките за спирачки',
        width: 800,
        height: 600,
        isPrimary: false,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
    ],
    availability: {
      status: 'in_stock',
      quantity: 15,
      inStockText: 'В наличност',
      outOfStockText: 'Изчерпан',
      deliveryTime: '1-2 работни дни',
      location: 'София',
      supplier: 'Авто Централ ЕООД'
    },
    compatibility: {
      vehicles: [
        {
          make: 'BMW',
          model: '3 Series',
          yearFrom: 2015,
          yearTo: 2020,
          engine: '2.0L',
          variant: 'F30',
          bodyType: 'Седан'
        },
        {
          make: 'BMW',
          model: '3 Series',
          yearFrom: 2015,
          yearTo: 2020,
          engine: '2.0L',
          variant: 'F31',
          bodyType: 'Комби'
        }
      ],
      universalFit: false,
      compatibilityNote: 'Проверете VIN номера за точна съвместимост',
      displayText: 'Подходящо за BMW 3 Series 2015-2020',
      shortDisplayText: 'BMW 3 Series 2015-2020',
      checkRequired: true
    },
    brand: {
      id: 'bosch',
      name: 'Bosch',
      logo: '/logos/parts/bosch.svg',
      country: 'Германия',
      website: 'https://www.bosch.com',
      isOriginal: true,
      isAftermarket: false,
      qualityRating: 5,
      description: 'Водещ производител на автомобилни части'
    },
    category: {
      id: 'brake-system',
      name: 'Спирачна система',
      slug: 'brake-system',
      path: 'parts/brake-system',
      level: 2,
      description: 'Части за спирачната система',
      icon: 'brake-icon'
    },
    specifications: [
      {
        name: 'Материал',
        value: 'Керамика',
        isImportant: true,
        displayOrder: 1
      },
      {
        name: 'Дебелина',
        value: '17.5 мм',
        unit: 'мм',
        isImportant: true,
        displayOrder: 2
      },
      {
        name: 'Тегло',
        value: '1.2 кг',
        unit: 'кг',
        isImportant: false,
        displayOrder: 3
      }
    ],
    tags: ['BMW', 'спирачки', 'накладки', 'керамика', 'Bosch'],
    sku: 'BP-BMW-001',
    partNumber: '0 986 494 768',
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    rating: {
      average: 4.7,
      count: 23,
      distribution: {
        5: 15,
        4: 6,
        3: 2,
        2: 0,
        1: 0
      }
    },
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'oil-filter-mercedes-002',
    name: 'Маслен филтър Mercedes-Benz C-Class',
    slug: 'oil-filter-mercedes-c-class',
    description: 'Оригинален маслен филтър за Mercedes-Benz C-Class. Осигурява отлична филтрация на маслото и дълъг живот на двигателя.',
    shortDescription: 'Оригинален маслен филтър за Mercedes-Benz C-Class с отлична филтрация.',
    price: {
      current: 45.90,
      currency: 'BGN',
      currencySymbol: 'лв.',
      isOnSale: false,
      vatIncluded: true,
      minOrderQuantity: 1,
      maxOrderQuantity: 20
    },
    images: [
      {
        id: 'oil-filter-002-1',
        url: '/images/products/oil-filter-mercedes-002-1.jpg',
        alt: 'Маслен филтър Mercedes-Benz C-Class - основно изображение',
        title: 'Маслен филтър Mercedes-Benz C-Class',
        width: 800,
        height: 600,
        isPrimary: true,
        priority: true,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
    ],
    availability: {
      status: 'in_stock',
      quantity: 8,
      inStockText: 'В наличност',
      outOfStockText: 'Изчерпан',
      deliveryTime: '2-3 работни дни',
      location: 'Пловдив',
      supplier: 'Мерцедес Авто Център'
    },
    compatibility: {
      vehicles: [
        {
          make: 'Mercedes-Benz',
          model: 'C-Class',
          yearFrom: 2014,
          yearTo: 2021,
          engine: '2.2L CDI',
          variant: 'W205',
          bodyType: 'Седан'
        }
      ],
      universalFit: false,
      displayText: 'Подходящо за Mercedes-Benz C-Class 2014-2021',
      shortDisplayText: 'Mercedes C-Class 2014-2021',
      checkRequired: true
    },
    brand: {
      id: 'mann-filter',
      name: 'MANN-FILTER',
      logo: '/logos/parts/mann-filter.svg',
      country: 'Германия',
      isOriginal: true,
      isAftermarket: false,
      qualityRating: 5
    },
    category: {
      id: 'filters',
      name: 'Филтри',
      slug: 'filters',
      path: 'parts/filters',
      level: 2,
      description: 'Филтри за автомобили'
    },
    specifications: [
      {
        name: 'Тип',
        value: 'Маслен филтър',
        isImportant: true,
        displayOrder: 1
      },
      {
        name: 'Диаметър',
        value: '93 мм',
        unit: 'мм',
        isImportant: true,
        displayOrder: 2
      }
    ],
    tags: ['Mercedes-Benz', 'маслен филтър', 'C-Class', 'MANN-FILTER'],
    sku: 'OF-MB-002',
    partNumber: 'W 712/75',
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    rating: {
      average: 4.9,
      count: 12,
      distribution: {
        5: 11,
        4: 1,
        3: 0,
        2: 0,
        1: 0
      }
    },
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: 'spark-plugs-audi-003',
    name: 'Запалителни свещи Audi A4',
    slug: 'spark-plugs-audi-a4',
    description: 'Комплект запалителни свещи за Audi A4. Подобряват работата на двигателя и намаляват разхода на гориво.',
    shortDescription: 'Комплект запалителни свещи за Audi A4 за подобрена работа на двигателя.',
    price: {
      current: 89.99,
      original: 99.99,
      currency: 'BGN',
      currencySymbol: 'лв.',
      isOnSale: true,
      discountPercent: 10,
      vatIncluded: true,
      minOrderQuantity: 1,
      maxOrderQuantity: 5
    },
    images: [
      {
        id: 'spark-plugs-003-1',
        url: '/images/products/spark-plugs-audi-003-1.jpg',
        alt: 'Запалителни свещи Audi A4 - основно изображение',
        title: 'Запалителни свещи Audi A4',
        width: 800,
        height: 600,
        isPrimary: true,
        priority: true,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
    ],
    availability: {
      status: 'in_stock',
      quantity: 25,
      inStockText: 'В наличност',
      outOfStockText: 'Изчерпан',
      deliveryTime: '1-2 работни дни',
      location: 'Варна',
      supplier: 'Ауди Център Варна'
    },
    compatibility: {
      vehicles: [
        {
          make: 'Audi',
          model: 'A4',
          yearFrom: 2016,
          yearTo: 2023,
          engine: '2.0L TFSI',
          variant: 'B9',
          bodyType: 'Седан'
        }
      ],
      universalFit: false,
      displayText: 'Подходящо за Audi A4 2016-2023',
      shortDisplayText: 'Audi A4 2016-2023',
      checkRequired: true
    },
    brand: {
      id: 'ngk',
      name: 'NGK',
      logo: '/logos/parts/ngk.svg',
      country: 'Япония',
      isOriginal: true,
      isAftermarket: false,
      qualityRating: 5
    },
    category: {
      id: 'ignition-system',
      name: 'Запалителна система',
      slug: 'ignition-system',
      path: 'parts/ignition-system',
      level: 2,
      description: 'Части за запалителната система'
    },
    specifications: [
      {
        name: 'Тип',
        value: 'Иридиева',
        isImportant: true,
        displayOrder: 1
      },
      {
        name: 'Разстояние',
        value: '0.8 мм',
        unit: 'мм',
        isImportant: true,
        displayOrder: 2
      }
    ],
    tags: ['Audi', 'запалителни свещи', 'A4', 'NGK', 'иридий'],
    sku: 'SP-AUDI-003',
    partNumber: 'ILFR6T11',
    isNew: true,
    isFeatured: true,
    isOnSale: true,
    rating: {
      average: 4.8,
      count: 18,
      distribution: {
        5: 14,
        4: 3,
        3: 1,
        2: 0,
        1: 0
      }
    },
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-22T09:20:00Z'
  },
  {
    id: 'air-filter-volkswagen-004',
    name: 'Въздушен филтър Volkswagen Golf',
    slug: 'air-filter-volkswagen-golf',
    description: 'Висококачествен въздушен филтър за Volkswagen Golf. Осигурява чист въздух за двигателя и подобрява производителността.',
    shortDescription: 'Висококачествен въздушен филтър за Volkswagen Golf за чист въздух.',
    price: {
      current: 32.50,
      currency: 'BGN',
      currencySymbol: 'лв.',
      isOnSale: false,
      vatIncluded: true,
      minOrderQuantity: 1,
      maxOrderQuantity: 15
    },
    images: [
      {
        id: 'air-filter-004-1',
        url: '/images/products/air-filter-volkswagen-004-1.jpg',
        alt: 'Въздушен филтър Volkswagen Golf - основно изображение',
        title: 'Въздушен филтър Volkswagen Golf',
        width: 800,
        height: 600,
        isPrimary: true,
        priority: true,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
    ],
    availability: {
      status: 'in_stock',
      quantity: 32,
      inStockText: 'В наличност',
      outOfStockText: 'Изчерпан',
      deliveryTime: '1-2 работни дни',
      location: 'София',
      supplier: 'ВВ Авто Център'
    },
    compatibility: {
      vehicles: [
        {
          make: 'Volkswagen',
          model: 'Golf',
          yearFrom: 2013,
          yearTo: 2020,
          engine: '1.4L TSI',
          variant: 'Mk7',
          bodyType: 'Хечбек'
        }
      ],
      universalFit: false,
      displayText: 'Подходящо за Volkswagen Golf 2013-2020',
      shortDisplayText: 'VW Golf 2013-2020',
      checkRequired: true
    },
    brand: {
      id: 'mahle',
      name: 'MAHLE',
      logo: '/logos/parts/mahle.svg',
      country: 'Германия',
      isOriginal: true,
      isAftermarket: false,
      qualityRating: 5
    },
    category: {
      id: 'filters',
      name: 'Филтри',
      slug: 'filters',
      path: 'parts/filters',
      level: 2,
      description: 'Филтри за автомобили'
    },
    specifications: [
      {
        name: 'Материал',
        value: 'Хартия',
        isImportant: true,
        displayOrder: 1
      },
      {
        name: 'Форма',
        value: 'Панелен',
        isImportant: true,
        displayOrder: 2
      }
    ],
    tags: ['Volkswagen', 'въздушен филтър', 'Golf', 'MAHLE'],
    sku: 'AF-VW-004',
    partNumber: 'LX 3477',
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    rating: {
      average: 4.6,
      count: 8,
      distribution: {
        5: 5,
        4: 2,
        3: 1,
        2: 0,
        1: 0
      }
    },
    createdAt: '2024-01-08T14:20:00Z',
    updatedAt: '2024-01-16T12:10:00Z'
  },
  {
    id: 'shock-absorber-opel-005',
    name: 'Амортисьор Opel Astra',
    slug: 'shock-absorber-opel-astra',
    description: 'Преден амортисьор за Opel Astra. Осигурява комфорт при шофиране и стабилност на автомобила.',
    shortDescription: 'Преден амортисьор за Opel Astra за комфорт и стабилност.',
    price: {
      current: 185.00,
      original: 210.00,
      currency: 'BGN',
      currencySymbol: 'лв.',
      isOnSale: true,
      discountPercent: 12,
      installments: [
        {
          months: 6,
          monthlyPayment: 30.83,
          totalAmount: 185.00,
          interestRate: 0,
          provider: 'Авто Кредит'
        }
      ],
      vatIncluded: true,
      minOrderQuantity: 1,
      maxOrderQuantity: 4
    },
    images: [
      {
        id: 'shock-absorber-005-1',
        url: '/images/products/shock-absorber-opel-005-1.jpg',
        alt: 'Амортисьор Opel Astra - основно изображение',
        title: 'Амортисьор Opel Astra',
        width: 800,
        height: 600,
        isPrimary: true,
        priority: true,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
    ],
    availability: {
      status: 'in_stock',
      quantity: 6,
      inStockText: 'В наличност',
      outOfStockText: 'Изчерпан',
      deliveryTime: '3-4 работни дни',
      location: 'Бургас',
      supplier: 'Опел Сервиз Бургас'
    },
    compatibility: {
      vehicles: [
        {
          make: 'Opel',
          model: 'Astra',
          yearFrom: 2009,
          yearTo: 2015,
          engine: '1.6L',
          variant: 'J',
          bodyType: 'Хечбек'
        }
      ],
      universalFit: false,
      displayText: 'Подходящо за Opel Astra 2009-2015',
      shortDisplayText: 'Opel Astra 2009-2015',
      checkRequired: true
    },
    brand: {
      id: 'monroe',
      name: 'Monroe',
      logo: '/logos/parts/monroe.svg',
      country: 'Белгия',
      isOriginal: false,
      isAftermarket: true,
      qualityRating: 4
    },
    category: {
      id: 'suspension',
      name: 'Окачване',
      slug: 'suspension',
      path: 'parts/suspension',
      level: 2,
      description: 'Части за окачването'
    },
    specifications: [
      {
        name: 'Тип',
        value: 'Газов',
        isImportant: true,
        displayOrder: 1
      },
      {
        name: 'Дължина',
        value: '545 мм',
        unit: 'мм',
        isImportant: true,
        displayOrder: 2
      }
    ],
    tags: ['Opel', 'амортисьор', 'Astra', 'Monroe', 'окачване'],
    sku: 'SA-OPEL-005',
    partNumber: 'G8003',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    rating: {
      average: 4.4,
      count: 15,
      distribution: {
        5: 7,
        4: 5,
        3: 2,
        2: 1,
        1: 0
      }
    },
    createdAt: '2024-01-05T10:45:00Z',
    updatedAt: '2024-01-19T15:30:00Z'
  },
  {
    id: 'battery-toyota-006',
    name: 'Акумулатор Toyota Corolla',
    slug: 'battery-toyota-corolla',
    description: 'Висококачествен акумулатор за Toyota Corolla. Надеждно стартиране при всякакви условия.',
    shortDescription: 'Висококачествен акумулатор за Toyota Corolla за надеждно стартиране.',
    price: {
      current: 245.00,
      currency: 'BGN',
      currencySymbol: 'лв.',
      isOnSale: false,
      installments: [
        {
          months: 12,
          monthlyPayment: 20.42,
          totalAmount: 245.00,
          interestRate: 0,
          provider: 'Авто Финанс'
        }
      ],
      vatIncluded: true,
      minOrderQuantity: 1,
      maxOrderQuantity: 3
    },
    images: [
      {
        id: 'battery-006-1',
        url: '/images/products/battery-toyota-006-1.jpg',
        alt: 'Акумулатор Toyota Corolla - основно изображение',
        title: 'Акумулатор Toyota Corolla',
        width: 800,
        height: 600,
        isPrimary: true,
        priority: true,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
    ],
    availability: {
      status: 'in_stock',
      quantity: 4,
      inStockText: 'В наличност',
      outOfStockText: 'Изчерпан',
      deliveryTime: '1-2 работни дни',
      location: 'София',
      supplier: 'Тойота Център София'
    },
    compatibility: {
      vehicles: [
        {
          make: 'Toyota',
          model: 'Corolla',
          yearFrom: 2014,
          yearTo: 2022,
          engine: '1.6L',
          variant: 'E170',
          bodyType: 'Седан'
        }
      ],
      universalFit: false,
      displayText: 'Подходящо за Toyota Corolla 2014-2022',
      shortDisplayText: 'Toyota Corolla 2014-2022',
      checkRequired: true
    },
    brand: {
      id: 'varta',
      name: 'Varta',
      logo: '/logos/parts/varta.svg',
      country: 'Германия',
      isOriginal: true,
      isAftermarket: false,
      qualityRating: 5
    },
    category: {
      id: 'electrical',
      name: 'Електрическа система',
      slug: 'electrical',
      path: 'parts/electrical',
      level: 2,
      description: 'Части за електрическата система'
    },
    specifications: [
      {
        name: 'Капацитет',
        value: '60 Ah',
        unit: 'Ah',
        isImportant: true,
        displayOrder: 1
      },
      {
        name: 'Студен ток',
        value: '540 A',
        unit: 'A',
        isImportant: true,
        displayOrder: 2
      }
    ],
    tags: ['Toyota', 'акумулатор', 'Corolla', 'Varta', 'електрическа система'],
    sku: 'BAT-TOY-006',
    partNumber: 'B32',
    isNew: false,
    isFeatured: true,
    isOnSale: false,
    rating: {
      average: 4.9,
      count: 31,
      distribution: {
        5: 28,
        4: 2,
        3: 1,
        2: 0,
        1: 0
      }
    },
    createdAt: '2024-01-03T16:00:00Z',
    updatedAt: '2024-01-21T11:45:00Z'
  },
  {
    id: 'universal-wiper-007',
    name: 'Универсални чистачки',
    slug: 'universal-wiper-blades',
    description: 'Универсални чистачки за предно стъкло. Подходящи за повечето автомобили.',
    shortDescription: 'Универсални чистачки за предно стъкло за повечето автомобили.',
    price: {
      current: 28.90,
      currency: 'BGN',
      currencySymbol: 'лв.',
      isOnSale: false,
      vatIncluded: true,
      minOrderQuantity: 1,
      maxOrderQuantity: 20
    },
    images: [
      {
        id: 'wiper-007-1',
        url: '/images/products/universal-wiper-007-1.jpg',
        alt: 'Универсални чистачки - основно изображение',
        title: 'Универсални чистачки',
        width: 800,
        height: 600,
        isPrimary: true,
        priority: true,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
    ],
    availability: {
      status: 'in_stock',
      quantity: 50,
      inStockText: 'В наличност',
      outOfStockText: 'Изчерпан',
      deliveryTime: '1-2 работни дни',
      location: 'София',
      supplier: 'Универсални Части ЕООД'
    },
    compatibility: {
      vehicles: [],
      universalFit: true,
      displayText: 'Универсални - подходящи за повечето автомобили',
      shortDisplayText: 'Универсални',
      checkRequired: false
    },
    brand: {
      id: 'champion',
      name: 'Champion',
      logo: '/logos/parts/champion.svg',
      country: 'Франция',
      isOriginal: false,
      isAftermarket: true,
      qualityRating: 4
    },
    category: {
      id: 'maintenance',
      name: 'Поддръжка',
      slug: 'maintenance',
      path: 'parts/maintenance',
      level: 2,
      description: 'Части за поддръжка'
    },
    specifications: [
      {
        name: 'Дължина',
        value: '60 см',
        unit: 'см',
        isImportant: true,
        displayOrder: 1
      },
      {
        name: 'Тип',
        value: 'Универсален',
        isImportant: true,
        displayOrder: 2
      }
    ],
    tags: ['универсални', 'чистачки', 'Champion', 'стъкло'],
    sku: 'WIP-UNI-007',
    partNumber: 'C6060',
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    rating: {
      average: 4.2,
      count: 45,
      distribution: {
        5: 20,
        4: 18,
        3: 5,
        2: 2,
        1: 0
      }
    },
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-17T09:30:00Z'
  },
  {
    id: 'out-of-stock-008',
    name: 'Clutch Kit Ford Focus',
    slug: 'clutch-kit-ford-focus',
    description: 'Комплект съединител за Ford Focus. Включва диск, корпус и лагер.',
    shortDescription: 'Комплект съединител за Ford Focus с диск, корпус и лагер.',
    price: {
      current: 320.00,
      currency: 'BGN',
      currencySymbol: 'лв.',
      isOnSale: false,
      vatIncluded: true,
      minOrderQuantity: 1,
      maxOrderQuantity: 2
    },
    images: [
      {
        id: 'clutch-008-1',
        url: '/images/products/clutch-kit-ford-008-1.jpg',
        alt: 'Комплект съединител Ford Focus - основно изображение',
        title: 'Комплект съединител Ford Focus',
        width: 800,
        height: 600,
        isPrimary: true,
        priority: true,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
    ],
    availability: {
      status: 'out_of_stock',
      quantity: 0,
      inStockText: 'В наличност',
      outOfStockText: 'Изчерпан',
      preOrderText: 'Предварителна поръчка',
      deliveryTime: '5-7 работни дни',
      location: 'София',
      supplier: 'Форд Център'
    },
    compatibility: {
      vehicles: [
        {
          make: 'Ford',
          model: 'Focus',
          yearFrom: 2011,
          yearTo: 2018,
          engine: '1.6L',
          variant: 'Mk3',
          bodyType: 'Хечбек'
        }
      ],
      universalFit: false,
      displayText: 'Подходящо за Ford Focus 2011-2018',
      shortDisplayText: 'Ford Focus 2011-2018',
      checkRequired: true
    },
    brand: {
      id: 'sachs',
      name: 'Sachs',
      logo: '/logos/parts/sachs.svg',
      country: 'Германия',
      isOriginal: true,
      isAftermarket: false,
      qualityRating: 5
    },
    category: {
      id: 'transmission',
      name: 'Трансмисия',
      slug: 'transmission',
      path: 'parts/transmission',
      level: 2,
      description: 'Части за трансмисията'
    },
    specifications: [
      {
        name: 'Диаметър',
        value: '215 мм',
        unit: 'мм',
        isImportant: true,
        displayOrder: 1
      },
      {
        name: 'Тип',
        value: 'Комплект',
        isImportant: true,
        displayOrder: 2
      }
    ],
    tags: ['Ford', 'съединител', 'Focus', 'Sachs', 'трансмисия'],
    sku: 'CK-FORD-008',
    partNumber: '3000 951 801',
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    rating: {
      average: 4.8,
      count: 5,
      distribution: {
        5: 4,
        4: 1,
        3: 0,
        2: 0,
        1: 0
      }
    },
    createdAt: '2023-12-28T08:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  }
]

/**
 * Product Grid Configuration
 */
export const PRODUCT_GRID_CONFIG = {
  columns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    xl: 4
  },
  gap: {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
    xl: '2rem'
  },
  containerMaxWidth: '1200px',
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    xl: 1280
  }
}

/**
 * Helper function to get products by availability status
 */
export const getProductsByAvailability = (status: string) => {
  return EXAMPLE_PRODUCT_DATA.filter(product => product.availability.status === status)
}

/**
 * Helper function to get products by brand
 */
export const getProductsByBrand = (brandId: string) => {
  return EXAMPLE_PRODUCT_DATA.filter(product => product.brand.id === brandId)
}

/**
 * Helper function to get products by category
 */
export const getProductsByCategory = (categoryId: string) => {
  return EXAMPLE_PRODUCT_DATA.filter(product => product.category.id === categoryId)
}

/**
 * Helper function to get featured products
 */
export const getFeaturedProducts = () => {
  return EXAMPLE_PRODUCT_DATA.filter(product => product.isFeatured)
}

/**
 * Helper function to get products on sale
 */
export const getProductsOnSale = () => {
  return EXAMPLE_PRODUCT_DATA.filter(product => product.isOnSale)
}

/**
 * Helper function to get new products
 */
export const getNewProducts = () => {
  return EXAMPLE_PRODUCT_DATA.filter(product => product.isNew)
}

/**
 * Helper function to get products by vehicle compatibility
 */
export const getProductsByVehicle = (make: string, model: string, year: number) => {
  return EXAMPLE_PRODUCT_DATA.filter(product => {
    if (product.compatibility.universalFit) {
      return true
    }
    return product.compatibility.vehicles.some(vehicle => 
      vehicle.make === make && 
      vehicle.model === model && 
      year >= vehicle.yearFrom && 
      year <= vehicle.yearTo
    )
  })
}

/**
 * Helper function to sort products by price
 */
export const sortProductsByPrice = (products: typeof EXAMPLE_PRODUCT_DATA, ascending: boolean = true) => {
  return [...products].sort((a, b) => {
    return ascending ? a.price.current - b.price.current : b.price.current - a.price.current
  })
}

/**
 * Helper function to sort products by rating
 */
export const sortProductsByRating = (products: typeof EXAMPLE_PRODUCT_DATA, ascending: boolean = false) => {
  return [...products].sort((a, b) => {
    const ratingA = a.rating?.average || 0
    const ratingB = b.rating?.average || 0
    return ascending ? ratingA - ratingB : ratingB - ratingA
  })
}

/**
 * Helper function to filter products by price range
 */
export const filterProductsByPriceRange = (products: typeof EXAMPLE_PRODUCT_DATA, min: number, max: number) => {
  return products.filter(product => product.price.current >= min && product.price.current <= max)
}

/**
 * Helper function to search products by name or description
 */
export const searchProducts = (products: typeof EXAMPLE_PRODUCT_DATA, query: string) => {
  const searchTerm = query.toLowerCase().trim()
  if (!searchTerm) return products
  
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description?.toLowerCase().includes(searchTerm) ||
    product.shortDescription?.toLowerCase().includes(searchTerm) ||
    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    product.brand.name.toLowerCase().includes(searchTerm) ||
    product.category.name.toLowerCase().includes(searchTerm)
  )
} 