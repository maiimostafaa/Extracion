export interface coupon {
  id: string; // Unique identifier for the coupon
  organization: string; // Organization that issued the coupon
  organizationLogo: string; // URL or local path to the organization's logo
  QRcode: string; // QR code string for the coupon
  discountType: "percentage" | "fixed" | "item"; // Type of discount
  discountValue?: number; // Value of the discount
  item?: string; // Optional item for item-based discounts
  expirationDate: string; // Expiration date in ISO format
  isActive: boolean; // Whether the coupon is currently active
  createdAt: string; // Creation date in ISO format
  updatedAt?: string; // Last update date in ISO format, optional
  usageCount?: number; // Number of times the coupon has been used, optional
  description: string; // Description of the coupon
  termsAndConditions?: string[]; // Optional terms and conditions for the coupon
  hasBeenUsed?: boolean; // Indicates if the coupon has been used
}
