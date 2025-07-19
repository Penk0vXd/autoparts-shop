import { NextResponse } from 'next/server'
import { NHTSAMakesResponse, CarMake } from '@/types/nhtsa'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // 30 seconds timeout

export async function GET() {
  try {
    // Add timeout to prevent hanging builds
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`NHTSA API error: ${response.status}`)
    }

    const data: NHTSAMakesResponse = await response.json()

    if (!data.Results || data.Results.length === 0) {
      // Return empty result instead of throwing error
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No vehicle makes found'
      })
    }

    // Transform NHTSA data to our format and sort alphabetically
    const makes: CarMake[] = data.Results
      .filter(make => make.Make_Name && make.Make_Name.trim()) // Filter out empty names
      .map(make => ({
        id: make.Make_ID.toString(),
        name: make.Make_Name.trim(),
        originalId: make.Make_ID
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({
      success: true,
      data: makes
    })
  } catch (error) {
    console.error('Error fetching makes:', error)
    
    // Return fallback data instead of failing
    const fallbackMakes: CarMake[] = [
      { id: '440', name: 'ASTON MARTIN', originalId: 440 },
      { id: '441', name: 'TESLA', originalId: 441 },
      { id: '448', name: 'TOYOTA', originalId: 448 },
      { id: '449', name: 'MERCEDES-BENZ', originalId: 449 },
      { id: '452', name: 'BMW', originalId: 452 },
      { id: '460', name: 'FORD', originalId: 460 },
      { id: '467', name: 'CHEVROLET', originalId: 467 },
      { id: '474', name: 'HONDA', originalId: 474 },
      { id: '482', name: 'VOLKSWAGEN', originalId: 482 },
      { id: '585', name: 'VOLVO', originalId: 485 },
    ]
    
    return NextResponse.json({
      success: true,
      data: fallbackMakes,
      message: 'Using cached vehicle makes data',
      error: error instanceof Error ? error.message : 'Failed to fetch from NHTSA'
    })
  }
} 