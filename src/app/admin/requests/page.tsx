import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { RequestTable } from '@/components/Admin/RequestTable'

// 🏛️ Service role client for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export default async function AdminRequestsPage() {
  // 🔐 Guard: Only allow access if admin mode is enabled  
  if (process.env.NEXT_PUBLIC_ADMIN_MODE !== 'true') {
    redirect('/')
  }

  // 📊 Fetch initial data and stats
  const [requestsResult, statsResult] = await Promise.all([
    supabaseAdmin
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),
    supabaseAdmin
      .from('request_stats')
      .select('*')
      .single()
  ])

  if (requestsResult.error) {
    console.error('Failed to fetch requests:', requestsResult.error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Грешка при зареждане
          </h1>
          <p className="text-gray-600">
            Не могат да се заредят заявките. Моля опитайте отново.
          </p>
        </div>
      </div>
    )
  }

  const requests = requestsResult.data || []
  const stats = statsResult.data || {
    total_requests: 0,
    new_requests: 0,
    accepted_requests: 0,
    rejected_requests: 0,
    today_requests: 0,
    week_requests: 0,
    month_requests: 0
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 📊 Header with Stats */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            {/* Title */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Управление на заявки
                </h1>
                <p className="mt-2 text-gray-600">
                  Преглед и управление на постъпили заявки за авточасти
                </p>
              </div>
              
              {/* CSV Export */}
              <div className="flex items-center space-x-4">
                <a
                  href="/admin/requests/export"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Експорт CSV
                </a>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.total_requests}</div>
                <div className="text-sm text-blue-600 font-medium">Общо</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.new_requests}</div>
                <div className="text-sm text-yellow-600 font-medium">Нови</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{stats.accepted_requests}</div>
                <div className="text-sm text-green-600 font-medium">Приети</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{stats.rejected_requests}</div>
                <div className="text-sm text-red-600 font-medium">Отказани</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-600">{stats.today_requests}</div>
                <div className="text-sm text-gray-600 font-medium">Днес</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-600">{stats.week_requests}</div>
                <div className="text-sm text-gray-600 font-medium">7 дни</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-600">{stats.month_requests}</div>
                <div className="text-sm text-gray-600 font-medium">30 дни</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 Main Content - Request Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RequestTable initialRequests={requests} />
      </div>
    </div>
  )
} 