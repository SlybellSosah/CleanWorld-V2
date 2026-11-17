// Maintained to match the global data schema in project.md. Update project.md first.

export const SERVICE_SLUGS = ["fumigation", "cleaning", "waste-collection", "landscaping", "consultancy"] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const FREQUENCIES = ["one-time", "weekly", "fortnightly", "monthly", "contract"] as const;
export type Frequency = (typeof FREQUENCIES)[number];

export const CUSTOMER_TYPES = ["organisation", "household"] as const;
export type CustomerType = (typeof CUSTOMER_TYPES)[number];

export const QUOTE_STATUSES = ["new", "contacted", "quoted", "won", "lost", "spam"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export type NotifyStatus = "pending" | "sent" | "failed";

export interface QuoteRequestInput {
  id: string;
  customerType: CustomerType;
  service: ServiceSlug;
  scope?: string;
  frequency?: Frequency;
  neighbourhood: string;
  landmark?: string;
  name: string;
  phone: string;
  organisation?: string;
  email?: string;
  poReference?: string;
  turnstileToken?: string;
}

export interface QuoteRequest extends Omit<QuoteRequestInput, "turnstileToken"> {
  reference: string;
  createdAt: string;
  status: QuoteStatus;
  notifyStatus: NotifyStatus;
  notifyTries: number;
}

export type ErrorCode =
  | "INVALID_JSON"
  | "UNAUTHORIZED"
  | "SPAM_CHECK_FAILED"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "PAYLOAD_TOO_LARGE"
  | "VALIDATION_FAILED"
  | "SERVER_ERROR"
  | "ADMIN_NOT_CONFIGURED";

export type FieldErrors = Partial<Record<keyof QuoteRequestInput | "status", string>>;

export interface ApiSuccess<T> {
  status: "success";
  data: T;
}

export interface ApiError {
  status: "error";
  code: ErrorCode;
  message: string;
  fields?: FieldErrors;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface CompanyFact<T> {
  value: T;
  confirmed: boolean;
}

export interface MerchantNumber {
  provider: string;
  number: string;
  name: string;
}

export interface Service {
  slug: ServiceSlug;
  title: string;
  short: string;
  summary: string;
  intro: string;
  includes: string[];
  method: string[];
  safety: string[];
  frequency: string;
  goodFor: string[];
}

export interface QuoteDraft {
  step: number;
  fields: Partial<QuoteRequestInput> & { id: string };
}
