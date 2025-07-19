// UI Component Exports
// Centralized export point for all UI components

export { Button, buttonVariants } from './button'
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
export { SafeImage, ProductImagePlaceholder, ProductImageError } from './SafeImage'
export { LoadingSpinner, CategoryGridSkeleton } from './LoadingSpinner'
export { CartIcon } from './CartIcon'
export { Breadcrumb, BreadcrumbItem } from './Breadcrumb'
export { Toast, addToast, ToastContainer } from './Toast'
export { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogOverlay,
  DialogClose,
  DialogPortal 
} from './dialog'
export { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from './sheet'

// Error Boundary Components (NEW)
export { 
  ErrorBoundary, 
  useErrorHandler, 
  withErrorBoundary, 
  SimpleErrorFallback, 
  ProductErrorFallback 
} from './ErrorBoundary'

// MVP Vehicle Selector
export { MVPVehicleSelector } from '../MVPVehicleSelector';
export type { 
  MVPVehicleSelectorProps, 
  MVPVehicleSelection, 
  MVPVehicleSelectorRef 
} from '../../types/mvp-vehicle-selector'; 