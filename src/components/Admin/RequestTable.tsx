'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'

// 🏛️ Supabase client for realtime subscriptions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Request {
  id: string
  name: string
  phone: string
  email: string | null
  brand: string | null
  model: string | null
  year: string | null
  engine: string | null
  part_text: string
  status: 'new' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

interface RequestTableProps {
  initialRequests: Request[]
}

export function RequestTable({ initialRequests }: RequestTableProps) {
  const [requests, setRequests] = useState<Request[]>(initialRequests)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // 🔄 Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('public:requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRequests(prev => [payload.new as Request, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setRequests(prev => 
              prev.map(req => req.id === payload.new.id ? payload.new as Request : req)
            )
          } else if (payload.eventType === 'DELETE') {
            setRequests(prev => prev.filter(req => req.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // 🔍 Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !request.name.toLowerCase().includes(query) &&
          !request.phone.toLowerCase().includes(query) &&
          !request.part_text.toLowerCase().includes(query) &&
          !(request.email?.toLowerCase().includes(query)) &&
          !(request.brand?.toLowerCase().includes(query)) &&
          !(request.model?.toLowerCase().includes(query))
        ) {
          return false
        }
      }

      // Status filter
      if (statusFilter !== 'all' && request.status !== statusFilter) {
        return false
      }

      // Date filters
      if (dateFrom && new Date(request.created_at) < new Date(dateFrom)) {
        return false
      }
      if (dateTo && new Date(request.created_at) > new Date(dateTo + 'T23:59:59')) {
        return false
      }

      return true
    })
  }, [requests, searchQuery, statusFilter, dateFrom, dateTo])

  // 📝 Update request status
  const updateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await fetch(`/api/request?id=${id}&status=${status}`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        console.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // 🧹 Clear filters
  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  // 📊 Get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* 🔍 Filters */}
      <div className="p-6 border-b bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Търсене..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">Всички статуси</option>
            <option value="new">Нови</option>
            <option value="accepted">Приети</option>
            <option value="rejected">Отказани</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />

          {/* Date To */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Показани: <span className="font-semibold">{filteredRequests.length}</span> от {requests.length} заявки
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Изчисти филтрите
          </button>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Клиент</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Контакт</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Автомобил</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Статус</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Дата</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr
                key={request.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedRequest(request)}
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{request.name}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline block">
                      {request.phone}
                    </a>
                    {request.email && (
                      <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline block">
                        {request.email}
                      </a>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600">
                    {[request.brand, request.model, request.year].filter(Boolean).join(' ') || 'Не е посочен'}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(request.status)}`}>
                    {request.status === 'new' ? 'Нова' : request.status === 'accepted' ? 'Приета' : 'Отказана'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(request.created_at).toLocaleDateString('bg-BG')}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {request.status === 'new' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateStatus(request.id, 'accepted')
                          }}
                          className="text-green-600 hover:text-green-700"
                          title="Приеми"
                        >
                          ✅
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateStatus(request.id, 'rejected')
                          }}
                          className="text-red-600 hover:text-red-700"
                          title="Откажи"
                        >
                          ❌
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Няма намерени заявки
          </div>
        )}
      </div>

      {/* 📄 Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Детайли за заявката</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Име</label>
                  <div className="p-2 bg-gray-50 rounded">{selectedRequest.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <div className="p-2 bg-gray-50 rounded">
                    <a href={`tel:${selectedRequest.phone}`} className="text-blue-600 hover:underline">
                      {selectedRequest.phone}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имейл</label>
                  <div className="p-2 bg-gray-50 rounded">
                    {selectedRequest.email ? (
                      <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline">
                        {selectedRequest.email}
                      </a>
                    ) : (
                      'Не е посочен'
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusStyle(selectedRequest.status)}`}>
                    {selectedRequest.status === 'new' ? 'Нова' : selectedRequest.status === 'accepted' ? 'Приета' : 'Отказана'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Автомобил</label>
                <div className="p-2 bg-gray-50 rounded">
                  {[selectedRequest.brand, selectedRequest.model, selectedRequest.year, selectedRequest.engine]
                    .filter(Boolean).join(' ') || 'Не е посочен'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание на частта</label>
                <div className="p-3 bg-gray-50 rounded min-h-[100px] whitespace-pre-wrap">
                  {selectedRequest.part_text}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Създадена:</strong> {new Date(selectedRequest.created_at).toLocaleString('bg-BG')}
                </div>
                <div>
                  <strong>Обновена:</strong> {new Date(selectedRequest.updated_at).toLocaleString('bg-BG')}
                </div>
              </div>

              {/* Status Update Buttons */}
              {selectedRequest.status === 'new' && (
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      updateStatus(selectedRequest.id, 'accepted')
                      setSelectedRequest(null)
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✅ Приеми заявката
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedRequest.id, 'rejected')
                      setSelectedRequest(null)
                    }}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    ❌ Откажи заявката
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}