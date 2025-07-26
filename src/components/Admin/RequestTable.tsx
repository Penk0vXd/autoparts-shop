'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'

// 📋 Request type definition
interface Request {
  id: string
  name: string
  phone: string
  email?: string
  brand?: string
  model?: string
  year?: string
  engine?: string
  part_text: string
  status: 'new' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

interface RequestTableProps {
  initialRequests: Request[]
}

// 🏛️ Supabase clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

export function RequestTable({ initialRequests }: RequestTableProps) {
  const [requests, setRequests] = useState<Request[]>(initialRequests)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  
  // 🔍 Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'accepted' | 'rejected'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // 📡 Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('admin_requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'requests'
        },
        (payload) => {
          const newRequest = payload.new as Request
          setRequests(prev => {
            // Avoid duplicates
            if (prev.find(r => r.id === newRequest.id)) return prev
            return [newRequest, ...prev]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'requests'
        },
        (payload) => {
          const updatedRequest = payload.new as Request
          setRequests(prev =>
            prev.map(r => r.id === updatedRequest.id ? updatedRequest : r)
          )
          // Update selected request if open
          if (selectedRequest?.id === updatedRequest.id) {
            setSelectedRequest(updatedRequest)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedRequest])

  // 🔍 Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableText = [
          request.name,
          request.phone,
          request.email,
          request.brand,
          request.model,
          request.part_text
        ].join(' ').toLowerCase()
        
        if (!searchableText.includes(query)) return false
      }

      // Status filter
      if (statusFilter !== 'all' && request.status !== statusFilter) {
        return false
      }

      // Date range filter
      if (dateFrom) {
        const requestDate = new Date(request.created_at)
        const fromDate = new Date(dateFrom)
        if (requestDate < fromDate) return false
      }

      if (dateTo) {
        const requestDate = new Date(request.created_at)
        const toDate = new Date(dateTo + 'T23:59:59')
        if (requestDate > toDate) return false
      }

      return true
    })
  }, [requests, searchQuery, statusFilter, dateFrom, dateTo])

  // 🔄 Update request status
  const updateStatus = async (requestId: string, newStatus: Request['status']) => {
    setIsUpdating(requestId)
    
    try {
      const { error } = await supabaseAdmin
        .from('requests')
        .update({ status: newStatus })
        .eq('id', requestId)

      if (error) {
        console.error('Status update failed:', error)
        alert('Грешка при актуализиране на статуса')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Грешка при актуализиране на статуса')
    } finally {
      setIsUpdating(null)
    }
  }

  // 🎨 Status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Нова'
      case 'accepted':
        return 'Приета'
      case 'rejected':
        return 'Отказана'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* 🔍 Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Филтри</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Търсене
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Име, телефон, част..."
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Всички</option>
              <option value="new">Нови</option>
              <option value="accepted">Приети</option>
              <option value="rejected">Отказани</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              От дата
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              До дата
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Показани: <strong>{filteredRequests.length}</strong> от {requests.length} заявки
          </div>
          
          {/* Clear Filters */}
          {(searchQuery || statusFilter !== 'all' || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
                setDateFrom('')
                setDateTo('')
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Изчисти филтри
            </button>
          )}
        </div>
      </div>

      {/* 📊 Data Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Автомобил
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Част
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {request.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        <a
                          href={`tel:${request.phone}`}
                          className="hover:text-red-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {request.phone}
                        </a>
                      </div>
                      {request.email && (
                        <div className="text-sm text-gray-500">
                          <a
                            href={`mailto:${request.email}`}
                            className="hover:text-red-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {request.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {[request.brand, request.model, request.year, request.engine]
                      .filter(Boolean)
                      .join(' ') || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {request.part_text}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.created_at).toLocaleDateString('bg-BG', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {(['accepted', 'rejected'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={(e) => {
                            e.stopPropagation()
                            updateStatus(request.id, status)
                          }}
                          disabled={isUpdating === request.id || request.status === status}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            request.status === status
                              ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                              : status === 'accepted'
                              ? 'border-green-600 text-green-600 hover:bg-green-50'
                              : 'border-red-600 text-red-600 hover:bg-red-50'
                          }`}
                        >
                          {isUpdating === request.id ? '...' : 
                           status === 'accepted' ? '✅' : '❌'}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchQuery || statusFilter !== 'all' || dateFrom || dateTo
                ? 'Няма заявки, отговарящи на филтрите'
                : 'Няма заявки за показване'
              }
            </div>
          </div>
        )}
      </div>

      {/* 📋 Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Детайли за заявка
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Management */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Статус</h4>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusStyle(selectedRequest.status)}`}>
                    {getStatusText(selectedRequest.status)}
                  </span>
                  <div className="flex space-x-2">
                    {(['new', 'accepted', 'rejected'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedRequest.id, status)}
                        disabled={isUpdating === selectedRequest.id || selectedRequest.status === status}
                        className={`px-3 py-1 text-sm rounded border transition-colors ${
                          selectedRequest.status === status
                            ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'border-red-600 text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {isUpdating === selectedRequest.id ? '...' : getStatusText(status)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Клиент</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Име:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedRequest.name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Телефон:</span>
                    <a
                      href={`tel:${selectedRequest.phone}`}
                      className="ml-2 text-sm text-red-600 hover:text-red-700"
                    >
                      {selectedRequest.phone}
                    </a>
                  </div>
                  {selectedRequest.email && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Имейл:</span>
                      <a
                        href={`mailto:${selectedRequest.email}`}
                        className="ml-2 text-sm text-red-600 hover:text-red-700"
                      >
                        {selectedRequest.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Автомобил</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Марка:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedRequest.brand || '—'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Модел:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedRequest.model || '—'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Година:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedRequest.year || '—'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Двигател:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedRequest.engine || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Part Description */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Описание на частта</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedRequest.part_text}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Информация</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Създадена:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {new Date(selectedRequest.created_at).toLocaleString('bg-BG')}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Последна промяна:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {new Date(selectedRequest.updated_at).toLocaleString('bg-BG')}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">ID:</span>
                    <span className="ml-2 text-sm text-gray-500 font-mono">{selectedRequest.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 