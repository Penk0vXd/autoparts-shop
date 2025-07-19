import { NextResponse } from 'next/server'
import { NHTSAModelsResponse, CarModel } from '@/types/nhtsa'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // 30 seconds timeout

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const makeName = searchParams.get('make')
    
    if (!makeName) {
      return NextResponse.json({
        success: false,
        error: 'Make name is required'
      }, { status: 400 })
    }

    const encodedMakeName = encodeURIComponent(makeName.trim())
    
    // Add timeout to prevent hanging builds
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodedMakeName}?format=json`, {
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

    const data: NHTSAModelsResponse = await response.json()

    if (!data.Results || data.Results.length === 0) {
      // Return empty result instead of throwing error
      return NextResponse.json({
        success: true,
        data: [],
        message: `No models found for make: ${makeName}`
      })
    }

    // Transform NHTSA data to our format and sort alphabetically
    const models: CarModel[] = data.Results
      .filter(model => model.Model_Name && model.Model_Name.trim()) // Filter out empty names
      .map(model => ({
        id: model.Model_ID.toString(),
        name: model.Model_Name.trim(),
        makeId: model.Make_ID.toString(),
        originalId: model.Model_ID
      }))
      // Remove duplicates based on model name (NHTSA sometimes returns duplicates)
      .filter((model, index, self) => 
        index === self.findIndex(m => m.name === model.name)
      )
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({
      success: true,
      data: models
    })
  } catch (error) {
    console.error('Error fetching models:', error)
    
    // Return fallback empty data with error message
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Unable to fetch vehicle models at this time',
      error: error instanceof Error ? error.message : 'Failed to fetch models'
    })
  }
} 