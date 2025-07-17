import { NextResponse } from 'next/server'
import { NHTSAMakesResponse, CarMake } from '@/types/nhtsa'

export async function GET() {
  try {
    const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: NHTSAMakesResponse = await response.json()

    if (!data.Results || data.Results.length === 0) {
      throw new Error('No vehicle makes found')
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
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch makes'
    }, { status: 500 })
  }
} 