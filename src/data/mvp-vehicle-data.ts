/**
 * MVP Vehicle Selector Static Data
 * 
 * Static JSON data for Bulgarian auto parts store vehicle selection.
 * Contains popular car makes, models, and years relevant to Bulgarian market.
 */

export interface MVPVehicleMake {
  id: string
  name: string
  logo?: string
  popularity: number // 1-10 scale for default sorting
}

export interface MVPVehicleModel {
  id: string
  name: string
  makeId: string
  years: number[]
  popularity: number // 1-10 scale for default sorting
}

export interface MVPVehicleData {
  makes: MVPVehicleMake[]
  models: MVPVehicleModel[]
}

/**
 * Bulgarian Market Vehicle Data
 * Popular car makes and models in Bulgaria with years 2000-2024
 */
export const MVP_VEHICLE_DATA: MVPVehicleData = {
  makes: [
    // Top German brands (very popular in Bulgaria)
    { id: 'bmw', name: 'BMW', logo: '/logos/bmw.png', popularity: 10 },
    { id: 'mercedes-benz', name: 'Mercedes-Benz', logo: '/logos/mercedes-benz.png', popularity: 10 },
    { id: 'audi', name: 'Audi', logo: '/logos/audi.png', popularity: 9 },
    { id: 'volkswagen', name: 'Volkswagen', logo: '/logos/volkswagen.png', popularity: 10 },
    { id: 'opel', name: 'Opel', logo: '/logos/opel.png', popularity: 9 },
    
    // Popular Japanese brands
    { id: 'toyota', name: 'Toyota', logo: '/logos/toyota.png', popularity: 9 },
    { id: 'honda', name: 'Honda', logo: '/logos/honda.png', popularity: 8 },
    { id: 'nissan', name: 'Nissan', logo: '/logos/nissan.png', popularity: 8 },
    { id: 'mazda', name: 'Mazda', logo: '/logos/mazda.png', popularity: 7 },
    { id: 'mitsubishi', name: 'Mitsubishi', logo: '/logos/mitsubishi.png', popularity: 7 },
    { id: 'subaru', name: 'Subaru', logo: '/logos/subaru.png', popularity: 6 },
    
    // Popular French brands
    { id: 'renault', name: 'Renault', logo: '/logos/renault.png', popularity: 9 },
    { id: 'peugeot', name: 'Peugeot', logo: '/logos/peugeot.png', popularity: 8 },
    { id: 'citroen', name: 'Citroën', logo: '/logos/citroen.png', popularity: 7 },
    { id: 'dacia', name: 'Dacia', logo: '/logos/dacia.png', popularity: 10 }, // Very popular in Bulgaria
    
    // Popular Italian brands
    { id: 'fiat', name: 'Fiat', logo: '/logos/fiat.png', popularity: 8 },
    { id: 'alfa-romeo', name: 'Alfa Romeo', logo: '/logos/alfa-romeo.png', popularity: 6 },
    
    // Popular Korean brands
    { id: 'hyundai', name: 'Hyundai', logo: '/logos/hyundai.png', popularity: 8 },
    { id: 'kia', name: 'KIA', logo: '/logos/kia.png', popularity: 8 },
    
    // Popular American brands
    { id: 'chevrolet', name: 'Chevrolet', logo: '/logos/chevrolet.png', popularity: 7 },
    { id: 'ford', name: 'Ford', logo: '/logos/ford.png', popularity: 8 },
    
    // Popular Czech/Slovak brands
    { id: 'skoda', name: 'Škoda', logo: '/logos/skoda.png', popularity: 9 },
    
    // Popular Swedish brands
    { id: 'volvo', name: 'Volvo', logo: '/logos/volvo.png', popularity: 7 },
    
    // Russian brands (historically popular)
    { id: 'lada', name: 'Lada', logo: '/logos/lada.png', popularity: 6 },
    
    // Luxury brands
    { id: 'lexus', name: 'Lexus', logo: '/logos/lexus.png', popularity: 6 },
    { id: 'infiniti', name: 'Infiniti', logo: '/logos/infiniti.png', popularity: 5 },
    { id: 'acura', name: 'Acura', logo: '/logos/acura.png', popularity: 5 },
    
    // Sports/Premium brands
    { id: 'porsche', name: 'Porsche', logo: '/logos/porsche.png', popularity: 5 },
    { id: 'jaguar', name: 'Jaguar', logo: '/logos/jaguar.png', popularity: 4 },
    { id: 'maserati', name: 'Maserati', logo: '/logos/maserati.png', popularity: 3 },
    { id: 'ferrari', name: 'Ferrari', logo: '/logos/ferrari.png', popularity: 2 },
    { id: 'lamborghini', name: 'Lamborghini', logo: '/logos/lamborghini.png', popularity: 2 },
    
    // Electric/Modern brands
    { id: 'tesla', name: 'Tesla', logo: '/logos/tesla.png', popularity: 6 },
    { id: 'byd', name: 'BYD', logo: '/logos/byd.png', popularity: 4 },
    
    // Other popular
    { id: 'jeep', name: 'Jeep', logo: '/logos/jeep.png', popularity: 6 },
    { id: 'land-rover', name: 'Land Rover', logo: '/logos/land-rover.png', popularity: 5 },
    { id: 'mini', name: 'MINI', logo: '/logos/mini.png', popularity: 6 },
    { id: 'smart', name: 'Smart', logo: '/logos/smart.png', popularity: 5 }
  ],

  models: [
    // BMW Models
    { id: 'bmw-1-series', name: '1 Series', makeId: 'bmw', years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'bmw-3-series', name: '3 Series', makeId: 'bmw', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 10 },
    { id: 'bmw-5-series', name: '5 Series', makeId: 'bmw', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'bmw-7-series', name: '7 Series', makeId: 'bmw', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'bmw-x3', name: 'X3', makeId: 'bmw', years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'bmw-x5', name: 'X5', makeId: 'bmw', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'bmw-x1', name: 'X1', makeId: 'bmw', years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },

    // Mercedes-Benz Models
    { id: 'mercedes-a-class', name: 'A-Class', makeId: 'mercedes-benz', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'mercedes-c-class', name: 'C-Class', makeId: 'mercedes-benz', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 10 },
    { id: 'mercedes-e-class', name: 'E-Class', makeId: 'mercedes-benz', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'mercedes-s-class', name: 'S-Class', makeId: 'mercedes-benz', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'mercedes-gle', name: 'GLE', makeId: 'mercedes-benz', years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },
    { id: 'mercedes-glc', name: 'GLC', makeId: 'mercedes-benz', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },

    // Audi Models
    { id: 'audi-a3', name: 'A3', makeId: 'audi', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'audi-a4', name: 'A4', makeId: 'audi', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 10 },
    { id: 'audi-a6', name: 'A6', makeId: 'audi', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'audi-q3', name: 'Q3', makeId: 'audi', years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'audi-q5', name: 'Q5', makeId: 'audi', years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },

    // Volkswagen Models
    { id: 'volkswagen-golf', name: 'Golf', makeId: 'volkswagen', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 10 },
    { id: 'volkswagen-passat', name: 'Passat', makeId: 'volkswagen', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'volkswagen-polo', name: 'Polo', makeId: 'volkswagen', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'volkswagen-jetta', name: 'Jetta', makeId: 'volkswagen', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'volkswagen-tiguan', name: 'Tiguan', makeId: 'volkswagen', years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },

    // Opel Models
    { id: 'opel-astra', name: 'Astra', makeId: 'opel', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 10 },
    { id: 'opel-corsa', name: 'Corsa', makeId: 'opel', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'opel-vectra', name: 'Vectra', makeId: 'opel', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009], popularity: 8 },
    { id: 'opel-insignia', name: 'Insignia', makeId: 'opel', years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'opel-mokka', name: 'Mokka', makeId: 'opel', years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },

    // Toyota Models
    { id: 'toyota-corolla', name: 'Corolla', makeId: 'toyota', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 10 },
    { id: 'toyota-camry', name: 'Camry', makeId: 'toyota', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'toyota-yaris', name: 'Yaris', makeId: 'toyota', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'toyota-rav4', name: 'RAV4', makeId: 'toyota', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'toyota-avensis', name: 'Avensis', makeId: 'toyota', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018], popularity: 8 },

    // Renault Models
    { id: 'renault-clio', name: 'Clio', makeId: 'renault', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 10 },
    { id: 'renault-megane', name: 'Mégane', makeId: 'renault', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'renault-laguna', name: 'Laguna', makeId: 'renault', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015], popularity: 7 },
    { id: 'renault-scenic', name: 'Scénic', makeId: 'renault', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022], popularity: 8 },
    { id: 'renault-captur', name: 'Captur', makeId: 'renault', years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },

    // Dacia Models (Very popular in Bulgaria)
    { id: 'dacia-logan', name: 'Logan', makeId: 'dacia', years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 10 },
    { id: 'dacia-sandero', name: 'Sandero', makeId: 'dacia', years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 10 },
    { id: 'dacia-duster', name: 'Duster', makeId: 'dacia', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'dacia-lodgy', name: 'Lodgy', makeId: 'dacia', years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022], popularity: 7 },

    // Skoda Models
    { id: 'skoda-octavia', name: 'Octavia', makeId: 'skoda', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 10 },
    { id: 'skoda-fabia', name: 'Fabia', makeId: 'skoda', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'skoda-superb', name: 'Superb', makeId: 'skoda', years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'skoda-kodiaq', name: 'Kodiaq', makeId: 'skoda', years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },

    // Ford Models
    { id: 'ford-focus', name: 'Focus', makeId: 'ford', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 9 },
    { id: 'ford-fiesta', name: 'Fiesta', makeId: 'ford', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022], popularity: 8 },
    { id: 'ford-mondeo', name: 'Mondeo', makeId: 'ford', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022], popularity: 8 },
    { id: 'ford-kuga', name: 'Kuga', makeId: 'ford', years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },

    // Hyundai Models
    { id: 'hyundai-i30', name: 'i30', makeId: 'hyundai', years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'hyundai-i20', name: 'i20', makeId: 'hyundai', years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'hyundai-tucson', name: 'Tucson', makeId: 'hyundai', years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'hyundai-santa-fe', name: 'Santa Fe', makeId: 'hyundai', years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },

    // KIA Models
    { id: 'kia-rio', name: 'Rio', makeId: 'kia', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'kia-ceed', name: 'Ceed', makeId: 'kia', years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'kia-sportage', name: 'Sportage', makeId: 'kia', years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'kia-sorento', name: 'Sorento', makeId: 'kia', years: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },

    // Peugeot Models
    { id: 'peugeot-206', name: '206', makeId: 'peugeot', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012], popularity: 8 },
    { id: 'peugeot-207', name: '207', makeId: 'peugeot', years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014], popularity: 8 },
    { id: 'peugeot-208', name: '208', makeId: 'peugeot', years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'peugeot-307', name: '307', makeId: 'peugeot', years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009], popularity: 7 },
    { id: 'peugeot-308', name: '308', makeId: 'peugeot', years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },

    // Fiat Models
    { id: 'fiat-punto', name: 'Punto', makeId: 'fiat', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018], popularity: 8 },
    { id: 'fiat-panda', name: 'Panda', makeId: 'fiat', years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },
    { id: 'fiat-500', name: '500', makeId: 'fiat', years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'fiat-bravo', name: 'Bravo', makeId: 'fiat', years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019], popularity: 6 },

    // Honda Models
    { id: 'honda-civic', name: 'Civic', makeId: 'honda', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'honda-accord', name: 'Accord', makeId: 'honda', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },
    { id: 'honda-cr-v', name: 'CR-V', makeId: 'honda', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'honda-jazz', name: 'Jazz', makeId: 'honda', years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },

    // Nissan Models
    { id: 'nissan-micra', name: 'Micra', makeId: 'nissan', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'nissan-almera', name: 'Almera', makeId: 'nissan', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012], popularity: 7 },
    { id: 'nissan-qashqai', name: 'Qashqai', makeId: 'nissan', years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'nissan-x-trail', name: 'X-Trail', makeId: 'nissan', years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },

    // Mazda Models
    { id: 'mazda-3', name: '3', makeId: 'mazda', years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'mazda-6', name: '6', makeId: 'mazda', years: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },
    { id: 'mazda-cx-5', name: 'CX-5', makeId: 'mazda', years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },
    { id: 'mazda-2', name: '2', makeId: 'mazda', years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },

    // Mitsubishi Models
    { id: 'mitsubishi-lancer', name: 'Lancer', makeId: 'mitsubishi', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017], popularity: 7 },
    { id: 'mitsubishi-outlander', name: 'Outlander', makeId: 'mitsubishi', years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },
    { id: 'mitsubishi-asx', name: 'ASX', makeId: 'mitsubishi', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'mitsubishi-colt', name: 'Colt', makeId: 'mitsubishi', years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013], popularity: 6 },

    // Citroen Models
    { id: 'citroen-c3', name: 'C3', makeId: 'citroen', years: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },
    { id: 'citroen-c4', name: 'C4', makeId: 'citroen', years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },
    { id: 'citroen-c5', name: 'C5', makeId: 'citroen', years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017], popularity: 6 },
    { id: 'citroen-xsara', name: 'Xsara', makeId: 'citroen', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006], popularity: 6 },

    // Volvo Models
    { id: 'volvo-s60', name: 'S60', makeId: 'volvo', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'volvo-s80', name: 'S80', makeId: 'volvo', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016], popularity: 6 },
    { id: 'volvo-v70', name: 'V70', makeId: 'volvo', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016], popularity: 6 },
    { id: 'volvo-xc90', name: 'XC90', makeId: 'volvo', years: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },

    // Tesla Models
    { id: 'tesla-model-3', name: 'Model 3', makeId: 'tesla', years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 8 },
    { id: 'tesla-model-s', name: 'Model S', makeId: 'tesla', years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'tesla-model-x', name: 'Model X', makeId: 'tesla', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 5 },
    { id: 'tesla-model-y', name: 'Model Y', makeId: 'tesla', years: [2020, 2021, 2022, 2023, 2024], popularity: 7 },

    // Lada Models
    { id: 'lada-kalina', name: 'Kalina', makeId: 'lada', years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018], popularity: 6 },
    { id: 'lada-priora', name: 'Priora', makeId: 'lada', years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018], popularity: 6 },
    { id: 'lada-granta', name: 'Granta', makeId: 'lada', years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'lada-vesta', name: 'Vesta', makeId: 'lada', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },

    // Chevrolet Models
    { id: 'chevrolet-aveo', name: 'Aveo', makeId: 'chevrolet', years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022], popularity: 7 },
    { id: 'chevrolet-cruze', name: 'Cruze', makeId: 'chevrolet', years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 7 },
    { id: 'chevrolet-captiva', name: 'Captiva', makeId: 'chevrolet', years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'chevrolet-spark', name: 'Spark', makeId: 'chevrolet', years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022], popularity: 6 },

    // Subaru Models
    { id: 'subaru-impreza', name: 'Impreza', makeId: 'subaru', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'subaru-forester', name: 'Forester', makeId: 'subaru', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'subaru-outback', name: 'Outback', makeId: 'subaru', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'subaru-legacy', name: 'Legacy', makeId: 'subaru', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 5 },

    // Lexus Models
    { id: 'lexus-is', name: 'IS', makeId: 'lexus', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'lexus-es', name: 'ES', makeId: 'lexus', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'lexus-rx', name: 'RX', makeId: 'lexus', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'lexus-nx', name: 'NX', makeId: 'lexus', years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },

    // Alfa Romeo Models
    { id: 'alfa-romeo-156', name: '156', makeId: 'alfa-romeo', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007], popularity: 6 },
    { id: 'alfa-romeo-159', name: '159', makeId: 'alfa-romeo', years: [2005, 2006, 2007, 2008, 2009, 2010, 2011], popularity: 6 },
    { id: 'alfa-romeo-giulietta', name: 'Giulietta', makeId: 'alfa-romeo', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020], popularity: 6 },
    { id: 'alfa-romeo-mito', name: 'MiTo', makeId: 'alfa-romeo', years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018], popularity: 6 },

    // Porsche Models
    { id: 'porsche-911', name: '911', makeId: 'porsche', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 5 },
    { id: 'porsche-cayenne', name: 'Cayenne', makeId: 'porsche', years: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 5 },
    { id: 'porsche-macan', name: 'Macan', makeId: 'porsche', years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 5 },
    { id: 'porsche-panamera', name: 'Panamera', makeId: 'porsche', years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 4 },

    // Jaguar Models
    { id: 'jaguar-xf', name: 'XF', makeId: 'jaguar', years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 4 },
    { id: 'jaguar-xe', name: 'XE', makeId: 'jaguar', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 4 },
    { id: 'jaguar-f-pace', name: 'F-PACE', makeId: 'jaguar', years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 4 },
    { id: 'jaguar-e-pace', name: 'E-PACE', makeId: 'jaguar', years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 4 },

    // MINI Models
    { id: 'mini-cooper', name: 'Cooper', makeId: 'mini', years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'mini-countryman', name: 'Countryman', makeId: 'mini', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'mini-clubman', name: 'Clubman', makeId: 'mini', years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 5 },
    { id: 'mini-convertible', name: 'Convertible', makeId: 'mini', years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 5 },

    // Jeep Models
    { id: 'jeep-grand-cherokee', name: 'Grand Cherokee', makeId: 'jeep', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'jeep-wrangler', name: 'Wrangler', makeId: 'jeep', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'jeep-cherokee', name: 'Cherokee', makeId: 'jeep', years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },
    { id: 'jeep-compass', name: 'Compass', makeId: 'jeep', years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 6 },

    // BYD Models
    { id: 'byd-han', name: 'Han', makeId: 'byd', years: [2020, 2021, 2022, 2023, 2024], popularity: 4 },
    { id: 'byd-tang', name: 'Tang', makeId: 'byd', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 4 },
    { id: 'byd-song', name: 'Song', makeId: 'byd', years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 4 },
    { id: 'byd-yuan', name: 'Yuan', makeId: 'byd', years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], popularity: 4 }
  ]
} 