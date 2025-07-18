// MVP Product Card Data type
type MVPProductCardData = any

/**
 * MVP Product Card Example Data
 * 
 * Realistic Bulgarian automotive parts data for demonstrating 
 * the MVP Product Card component with proper localization.
 * 
 * @author God of Programming
 * @version 1.0.0
 */

export const mvpProductExamples: MVPProductCardData[] = [
  {
    id: 'brake-pads-bmw-f30',
    name: 'Накладки предни спирачки BMW F30',
    slug: 'brake-pads-bmw-f30',
    image: {
      url: '/api/placeholder/300/300?text=Brake+Pads+BMW+F30',
      alt: 'Накладки предни спирачки BMW F30 - оригинални части',
      width: 300,
      height: 300,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
    },
    price: {
      current: 89.99,
      original: 119.99,
      currency: 'BGN',
      isOnSale: true,
      discountPercent: 25
    },
    availability: {
      status: 'in_stock',
      text: 'В наличност',
      deliveryTime: 'до 24 часа в София'
    },
    compatibility: {
      isCompatible: true,
      displayText: 'Подходящо за BMW 3 Series (F30) 2012-2019',
      vehicles: [{
        make: 'BMW',
        model: '3 Series (F30)',
        yearFrom: 2012,
        yearTo: 2019
      }]
    },
    brand: {
      name: 'Bosch',
      logo: '/logos/bosch.png'
    },
    isNew: false,
    isOnSale: true
  },
  {
    id: 'oil-filter-audi-a4',
    name: 'Маслен филтър Audi A4 B9',
    slug: 'oil-filter-audi-a4',
    image: {
      url: '/api/placeholder/300/300?text=Oil+Filter+Audi+A4',
      alt: 'Маслен филтър Audi A4 B9 - високо качество',
      width: 300,
      height: 300
    },
    price: {
      current: 24.90,
      currency: 'BGN',
      isOnSale: false
    },
    availability: {
      status: 'in_stock',
      text: 'В наличност',
      deliveryTime: 'до 24 часа'
    },
    compatibility: {
      isCompatible: true,
      displayText: 'Подходящо за Audi A4 (B9) 2016-2023',
      vehicles: [{
        make: 'Audi',
        model: 'A4 (B9)',
        yearFrom: 2016,
        yearTo: 2023
      }]
    },
    brand: {
      name: 'Mann Filter',
      logo: '/logos/mann-filter.png'
    },
    isNew: true,
    isOnSale: false
  },
  {
    id: 'headlight-mercedes-w213',
    name: 'Фар преден Mercedes E-Class W213',
    slug: 'headlight-mercedes-w213',
    image: {
      url: '/api/placeholder/300/300?text=Headlight+Mercedes+W213',
      alt: 'Фар преден Mercedes E-Class W213 - LED технология',
      width: 300,
      height: 300
    },
    price: {
      current: 850.00,
      original: 1250.00,
      currency: 'BGN',
      isOnSale: true,
      discountPercent: 32
    },
    availability: {
      status: 'coming_soon',
      text: 'Очаква се',
      deliveryTime: '5-7 работни дни'
    },
    compatibility: {
      isCompatible: true,
      displayText: 'Подходящо за Mercedes E-Class (W213) 2016-2020',
      vehicles: [{
        make: 'Mercedes-Benz',
        model: 'E-Class (W213)',
        yearFrom: 2016,
        yearTo: 2020
      }]
    },
    brand: {
      name: 'Hella',
      logo: '/logos/hella.png'
    },
    isNew: false,
    isOnSale: true
  },
  {
    id: 'timing-belt-vw-golf',
    name: 'Ремък за газораспределение VW Golf 7',
    slug: 'timing-belt-vw-golf',
    image: {
      url: '/api/placeholder/300/300?text=Timing+Belt+VW+Golf',
      alt: 'Ремък за газораспределение VW Golf 7 - Gates качество',
      width: 300,
      height: 300
    },
    price: {
      current: 65.50,
      currency: 'BGN',
      isOnSale: false
    },
    availability: {
      status: 'in_stock',
      text: 'В наличност',
      deliveryTime: 'до 24 часа'
    },
    compatibility: {
      isCompatible: true,
      displayText: 'Подходящо за VW Golf VII 2012-2020',
      vehicles: [{
        make: 'Volkswagen',
        model: 'Golf VII',
        yearFrom: 2012,
        yearTo: 2020
      }]
    },
    brand: {
      name: 'Gates',
      logo: '/logos/gates.png'
    },
    isNew: false,
    isOnSale: false
  },
  {
    id: 'air-filter-ford-focus',
    name: 'Въздушен филтър Ford Focus MK4',
    slug: 'air-filter-ford-focus',
    image: {
      url: '/api/placeholder/300/300?text=Air+Filter+Ford+Focus',
      alt: 'Въздушен филтър Ford Focus MK4 - оригинално качество',
      width: 300,
      height: 300
    },
    price: {
      current: 32.80,
      currency: 'BGN',
      isOnSale: false
    },
    availability: {
      status: 'in_stock',
      text: 'В наличност',
      deliveryTime: 'до 24 часа'
    },
    compatibility: {
      isCompatible: true,
      displayText: 'Подходящо за Ford Focus MK4 2018-2023',
      vehicles: [{
        make: 'Ford',
        model: 'Focus MK4',
        yearFrom: 2018,
        yearTo: 2023
      }]
    },
    brand: {
      name: 'Mahle',
      logo: '/logos/mahle.png'
    },
    isNew: true,
    isOnSale: false
  },
  {
    id: 'shock-absorber-honda-civic',
    name: 'Амортисьор преден Honda Civic Type R',
    slug: 'shock-absorber-honda-civic',
    image: {
      url: '/api/placeholder/300/300?text=Shock+Absorber+Honda+Civic',
      alt: 'Амортисьор преден Honda Civic Type R - спортна серия',
      width: 300,
      height: 300
    },
    price: {
      current: 180.00,
      currency: 'BGN',
      isOnSale: false
    },
    availability: {
      status: 'out_of_stock',
      text: 'Изчерпан',
      deliveryTime: 'по заявка'
    },
    compatibility: {
      isCompatible: true,
      displayText: 'Подходящо за Honda Civic Type R 2017-2021',
      vehicles: [{
        make: 'Honda',
        model: 'Civic Type R',
        yearFrom: 2017,
        yearTo: 2021
      }]
    },
    brand: {
      name: 'Monroe',
      logo: '/logos/monroe.png'
    },
    isNew: false,
    isOnSale: false
  },
  {
    id: 'radiator-toyota-corolla',
    name: 'Радиатор охлаждане Toyota Corolla',
    slug: 'radiator-toyota-corolla',
    image: {
      url: '/api/placeholder/300/300?text=Radiator+Toyota+Corolla',
      alt: 'Радиатор охлаждане Toyota Corolla - алуминиев',
      width: 300,
      height: 300
    },
    price: {
      current: 290.00,
      original: 350.00,
      currency: 'BGN',
      isOnSale: true,
      discountPercent: 17
    },
    availability: {
      status: 'in_stock',
      text: 'В наличност',
      deliveryTime: 'до 24 часа'
    },
    compatibility: {
      isCompatible: true,
      displayText: 'Подходящо за Toyota Corolla 2019-2023',
      vehicles: [{
        make: 'Toyota',
        model: 'Corolla',
        yearFrom: 2019,
        yearTo: 2023
      }]
    },
    brand: {
      name: 'Valeo',
      logo: '/logos/valeo.png'
    },
    isNew: true,
    isOnSale: true
  },
  {
    id: 'clutch-kit-seat-leon',
    name: 'Комплект съединител Seat Leon',
    slug: 'clutch-kit-seat-leon',
    image: {
      url: '/api/placeholder/300/300?text=Clutch+Kit+Seat+Leon',
      alt: 'Комплект съединител Seat Leon - пълен комплект',
      width: 300,
      height: 300
    },
    price: {
      current: 420.00,
      currency: 'BGN',
      isOnSale: false
    },
    availability: {
      status: 'in_stock',
      text: 'В наличност',
      deliveryTime: 'до 24 часа'
    },
    compatibility: {
      isCompatible: true,
      displayText: 'Подходящо за Seat Leon MK3 2012-2020',
      vehicles: [{
        make: 'Seat',
        model: 'Leon MK3',
        yearFrom: 2012,
        yearTo: 2020
      }]
    },
    brand: {
      name: 'Sachs',
      logo: '/logos/sachs.png'
    },
    isNew: false,
    isOnSale: false
  }
]

// Example categories for context
export const mvpProductCategories = [
  { name: 'Спирачна система', slug: 'brake-system' },
  { name: 'Филтри', slug: 'filters' },
  { name: 'Осветление', slug: 'lighting' },
  { name: 'Двигател', slug: 'engine' },
  { name: 'Окачване', slug: 'suspension' },
  { name: 'Охлаждане', slug: 'cooling' },
  { name: 'Съединител', slug: 'clutch' }
]

// Example vehicle compatibility for context
export const mvpVehicleExamples = [
  { make: 'BMW', model: '3 Series (F30)', yearFrom: 2012, yearTo: 2019 },
  { make: 'Audi', model: 'A4 (B9)', yearFrom: 2016, yearTo: 2023 },
  { make: 'Mercedes-Benz', model: 'E-Class (W213)', yearFrom: 2016, yearTo: 2020 },
  { make: 'Volkswagen', model: 'Golf VII', yearFrom: 2012, yearTo: 2020 },
  { make: 'Ford', model: 'Focus MK4', yearFrom: 2018, yearTo: 2023 },
  { make: 'Honda', model: 'Civic Type R', yearFrom: 2017, yearTo: 2021 },
  { make: 'Toyota', model: 'Corolla', yearFrom: 2019, yearTo: 2023 },
  { make: 'Seat', model: 'Leon MK3', yearFrom: 2012, yearTo: 2020 }
] 