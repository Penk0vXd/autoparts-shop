import { NextRequest } from 'next/server'
import { searchProducts } from '@/services/searchService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '8')

    if (!query?.trim()) {
      return Response.json(
        { data: [], query: '', count: 0 },
        { 
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          }
        }
      )
    }

    const data = await searchProducts(query, limit)
    
    return Response.json(
      { 
        data,
        query: query.trim(),
        count: data.length 
      },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    )
  } catch (error) {
    console.error('Search API error:', error)
    return Response.json(
      { error: 'Failed to search products' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    )
  }
} 