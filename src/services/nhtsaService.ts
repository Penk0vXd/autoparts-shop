import { 
  NHTSAMakesResponse, 
  NHTSAModelsResponse, 
  CarMake, 
  CarModel 
} from '@/types/nhtsa'

/**
 * NHTSA vPIC API Service
 * 
 * Service layer for fetching vehicle data from the National Highway Traffic Safety Administration
 * Vehicle Product Information Catalog API. Handles API calls, data transformation, and error handling.
 */

const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles'

/**
 * Fetch all vehicle makes from NHTSA API via Next.js API route
 * This avoids CORS issues by using server-side fetch
 */
export async function getNHTSAMakes(): Promise<CarMake[]> {
  try {
    const response = await fetch('/api/nhtsa/makes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add caching for better performance
      cache: 'force-cache',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch makes')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching NHTSA makes:', error)
    throw new Error('Failed to fetch vehicle makes. Please try again.')
  }
}

/**
 * Fetch vehicle models for a specific make from NHTSA API via Next.js API route
 * This avoids CORS issues by using server-side fetch
 */
export async function getNHTSAModels(makeName: string): Promise<CarModel[]> {
  try {
    if (!makeName || !makeName.trim()) {
      throw new Error('Make name is required')
    }

    // Encode the make name for URL safety
    const encodedMakeName = encodeURIComponent(makeName.trim())
    
    const response = await fetch(`/api/nhtsa/models?make=${encodedMakeName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for 1 hour since models don't change frequently
      cache: 'force-cache',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || `Failed to fetch models for ${makeName}`)
    }

    return result.data
  } catch (error) {
    console.error('Error fetching NHTSA models:', error)
    throw new Error(`Failed to fetch vehicle models for ${makeName}. Please try again.`)
  }
}

/**
 * Generate a range of years for vehicle selection
 * Since NHTSA doesn't provide a specific year endpoint for all vehicles,
 * we'll generate a reasonable range based on automotive industry standards
 */
export function generateYearRange(startYear?: number, endYear?: number): number[] {
  const currentYear = new Date().getFullYear()
  const start = startYear || 1990 // Default to 1990 as reasonable start
  const end = endYear || currentYear + 1 // Include next year for upcoming models

  const years: number[] = []
  for (let year = end; year >= start; year--) {
    years.push(year)
  }

  return years
}

/**
 * Validate make name against common patterns
 */
export function validateMakeName(makeName: string): boolean {
  if (!makeName || typeof makeName !== 'string') {
    return false
  }

  const trimmed = makeName.trim()
  return trimmed.length > 0 && trimmed.length <= 50
}

/**
 * Get a specific make by ID from the makes list
 */
export async function getMakeById(makeId: string): Promise<CarMake | null> {
  try {
    const makes = await getNHTSAMakes()
    return makes.find(make => make.id === makeId) || null
  } catch (error) {
    console.error('Error getting make by ID:', error)
    return null
  }
}

/**
 * Search makes by name (case-insensitive)
 */
export async function searchMakesByName(searchTerm: string): Promise<CarMake[]> {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return []
    }

    const makes = await getNHTSAMakes()
    const lowerSearchTerm = searchTerm.trim().toLowerCase()
    
    return makes.filter(make => 
      make.name.toLowerCase().includes(lowerSearchTerm)
    )
  } catch (error) {
    console.error('Error searching makes:', error)
    return []
  }
} 