/**
 * Google Sheets Service for Order Management
 * Zero-infrastructure backend for MVP - saves orders directly to Google Sheets
 */

interface OrderData {
  customerName: string
  customerPhone: string
  customerAddress: string
  customerNotes: string
  productName: string
  productSku: string
  productPrice: number
  deliveryFee: number
  total: number
  timestamp: string
  orderNumber: string
}

interface GoogleSheetsResponse {
  success: boolean
  message: string
  orderNumber?: string
}

class GoogleSheetsService {
  private readonly SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  private readonly API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  private readonly SHEET_NAME = 'Orders'

  /**
   * Save order to Google Sheets
   * Uses Google Sheets API v4 to append new row with order data
   */
  async saveOrder(orderData: Omit<OrderData, 'timestamp' | 'orderNumber'>): Promise<GoogleSheetsResponse> {
    try {
      // Generate order number
      const orderNumber = this.generateOrderNumber()
      const timestamp = new Date().toLocaleString('bg-BG', { 
        timeZone: 'Europe/Sofia',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })

      // Prepare row data for Google Sheets
      const rowData = [
        orderNumber,
        timestamp,
        orderData.customerName,
        orderData.customerPhone,
        orderData.customerAddress,
        orderData.customerNotes || 'Няма бележки',
        orderData.productName,
        orderData.productSku,
        orderData.productPrice.toFixed(2),
        orderData.deliveryFee.toFixed(2),
        orderData.total.toFixed(2),
        'Нова поръчка', // Status
        'Наложен платеж' // Payment method
      ]

      // For MVP, we'll use a simple approach with fetch to Google Sheets API
      // In production, you might want to use a more robust solution
      const response = await this.appendToSheet(rowData)

      if (response.success) {
        return {
          success: true,
          message: 'Поръчката е успешно запазена',
          orderNumber
        }
      } else {
        throw new Error(response.message)
      }

    } catch (error) {
      console.error('Google Sheets save error:', error)
      
      // Fallback: save to localStorage for development
      this.saveToLocalStorage(orderData)
      
      return {
        success: false,
        message: 'Възникна техническа грешка при запазване на поръчката'
      }
    }
  }

  /**
   * Append row to Google Sheets using API v4
   */
  private async appendToSheet(rowData: string[]): Promise<{ success: boolean; message: string }> {
    if (!this.SHEET_ID || !this.API_KEY) {
      console.warn('Google Sheets credentials not configured, using fallback')
      return { success: false, message: 'Google Sheets not configured' }
    }

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}:append?valueInputOption=RAW&key=${this.API_KEY}`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData]
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        message: 'Данните са успешно запазени в Google Sheets'
      }

    } catch (error) {
      console.error('Google Sheets API error:', error)
      return {
        success: false,
        message: 'Грешка при свързване с Google Sheets'
      }
    }
  }

  /**
   * Generate unique order number
   */
  private generateOrderNumber(): string {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const time = now.getTime().toString().slice(-4)
    
    return `ORD-${year}${month}${day}-${time}`
  }

  /**
   * Fallback: Save to localStorage for development/testing
   */
  private saveToLocalStorage(orderData: Omit<OrderData, 'timestamp' | 'orderNumber'>): void {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const newOrder = {
        ...orderData,
        orderNumber: this.generateOrderNumber(),
        timestamp: new Date().toISOString()
      }
      
      orders.push(newOrder)
      localStorage.setItem('orders', JSON.stringify(orders))
      
      console.log('Order saved to localStorage:', newOrder)
    } catch (error) {
      console.error('localStorage save error:', error)
    }
  }

  /**
   * Get orders from localStorage (for development/testing)
   */
  getLocalStorageOrders(): OrderData[] {
    try {
      return JSON.parse(localStorage.getItem('orders') || '[]')
    } catch (error) {
      console.error('localStorage read error:', error)
      return []
    }
  }

  /**
   * Initialize Google Sheets with headers (call once during setup)
   */
  async initializeSheet(): Promise<void> {
    const headers = [
      'Номер на поръчка',
      'Дата и час',
      'Име на клиент',
      'Телефон',
      'Адрес',
      'Бележки',
      'Продукт',
      'SKU',
      'Цена на продукт',
      'Доставка',
      'Общо',
      'Статус',
      'Начин на плащане'
    ]

    try {
      await this.appendToSheet(headers)
      console.log('Google Sheets initialized with headers')
    } catch (error) {
      console.error('Failed to initialize Google Sheets:', error)
    }
  }

  /**
   * Test Google Sheets connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const testData = ['TEST', new Date().toISOString(), 'Test Customer', '0888000000', 'Test Address', 'Test Notes', 'Test Product', 'TEST-001', '10.00', '5.00', '15.00', 'Тест', 'Тест']
      const result = await this.appendToSheet(testData)
      return result.success
    } catch (error) {
      console.error('Google Sheets connection test failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService()

// Export types
export type { OrderData, GoogleSheetsResponse } 