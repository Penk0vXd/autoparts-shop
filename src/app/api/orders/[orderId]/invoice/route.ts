import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { requireServerAuth } from '@/lib/auth'
import PDFDocument from 'pdfkit'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    // Require authentication
    const user = await requireServerAuth()

    // Get order with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          products (
            name,
            sku
          )
        )
      `)
      .eq('id', params.orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError) throw orderError

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Create PDF
    const doc = new PDFDocument()
    const chunks: Buffer[] = []

    doc.on('data', chunk => chunks.push(chunk))

    // Header
    doc.fontSize(20).text('Invoice', { align: 'center' })
    doc.moveDown()

    // Order details
    doc.fontSize(12)
    doc.text(`Order #: ${order.id}`)
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('bg-BG')}`)
    doc.text(`Status: ${order.status}`)
    doc.moveDown()

    // Customer details
    doc.text('Shipping Details:')
    doc.text(`${order.shipping_details.firstName} ${order.shipping_details.lastName}`)
    doc.text(order.shipping_details.email)
    doc.text(order.shipping_details.phone)
    doc.text(order.shipping_details.address)
    doc.text(`${order.shipping_details.city}, ${order.shipping_details.postalCode}`)
    doc.moveDown()

    if (order.billing_details.companyName) {
      doc.text('Billing Details:')
      doc.text(order.billing_details.companyName)
      if (order.billing_details.vatNumber) {
        doc.text(`VAT: ${order.billing_details.vatNumber}`)
      }
      doc.moveDown()
    }

    // Items table
    doc.text('Items:', { underline: true })
    doc.moveDown()

    // Table header
    doc.text('Product', 50, doc.y, { width: 200 })
    doc.text('SKU', 250, doc.y, { width: 100 })
    doc.text('Qty', 350, doc.y, { width: 50 })
    doc.text('Price', 400, doc.y, { width: 100 })
    doc.moveDown()

    // Table rows
    order.order_items.forEach(item => {
      doc.text(item.products.name, 50, doc.y, { width: 200 })
      doc.text(item.products.sku, 250, doc.y, { width: 100 })
      doc.text(item.quantity.toString(), 350, doc.y, { width: 50 })
      doc.text(
        new Intl.NumberFormat('bg-BG', {
          style: 'currency',
          currency: 'BGN'
        }).format(item.price),
        400,
        doc.y,
        { width: 100 }
      )
      doc.moveDown()
    })

    // Total
    doc.moveDown()
    doc.text(
      `Total: ${new Intl.NumberFormat('bg-BG', {
        style: 'currency',
        currency: 'BGN'
      }).format(order.total)}`,
      { align: 'right' }
    )

    // Finalize PDF
    doc.end()

    // Wait for PDF to be generated
    const pdf = await new Promise<Buffer>(resolve => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })

    // Return PDF
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.id}.pdf"`
      }
    })
  } catch (error) {
    console.error('Generate invoice API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
} 