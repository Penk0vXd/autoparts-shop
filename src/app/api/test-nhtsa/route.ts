import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing NHTSA API...')
    
    const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('NHTSA API Response:', data)

    return NextResponse.json({
      success: true,
      message: 'NHTSA API is working',
      data: {
        count: data.Count,
        sampleMakes: data.Results.slice(0, 5), // First 5 makes
        totalMakes: data.Results.length
      }
    })

  } catch (error) {
    console.error('NHTSA API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch from NHTSA API'
    }, { status: 500 })
  }
} 