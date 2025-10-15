import { Components, OperationMethods, Paths } from 'api/gen/client'
import { Awaited } from './helpers'

export type Invoice = Awaited<
  ReturnType<OperationMethods['getInvoices']>
>['data']['invoices'][0]

export type Product = Awaited<
  ReturnType<OperationMethods['getSearchProducts']>
>['data']['products'][0]

export type Customer = Awaited<
  ReturnType<OperationMethods['getSearchCustomers']>
>['data']['customers'][0]

export type InvoiceLine = Invoice['invoice_lines'][0]
export type Error = Components.Schemas.Error

export enum Operator {
  EQ = 'eq',
  NEQ = 'not_eq',
  GT = 'gt',
  GTEQ = 'gteq',
  LT = 'lt',
  LTEQ = 'lteq',
  IN = 'in',
  NIN = 'not_in',
  start_with = 'start_with',
}

export type VariantEnum =
  | 'Success'
  | 'Danger'
  | 'Warning'
  | 'Info'
  | 'Light'
  | 'Dark'
export type InvoiceAction = 'paid' | 'finalized'
export type InvoiceLineType =
  | Components.Schemas.InvoiceLineUpdatePayload
  | Components.Schemas.InvoiceLineCreatePayload

export type FilterProps = {
  field: FieldEnum
  operator: Operator
  value: number | string | boolean
}
export enum FieldEnum {
  CUSTOMER_ID = 'customer_id',
  TAX = 'tax',
  FINALIZED = 'finalized',
  PAID = 'paid',
  DATE = 'date',
  DEADLINE = 'deadline',
  PRODUCT_ID = 'invoice_lines.product_id',
}

export type EditInvoiceProps = {
  id: Invoice['id']
  data: Paths.PutInvoice.RequestBody
  onSuccessCallback?: () => void
  successMessage?: string
}
