export interface walletCard {
  id: string; // Unique identifier for the wallet card
  name: string; // Name of the wallet card
  balance: number; // Current balance on the card
  currency: string; // Currency type (e.g., USD, EUR)
  expiryDate: string; // Expiry date of the card in YYYY-MM-DD format
  image: string; // URL or local path to the card image
  membershipLevel: string; // Membership level associated with the card (e.g., Gold, Silver)
  QRCode: string; // QR code string for the card
  cardNumber: string; // Masked card number (e.g., "**** **** **** 1234")
  isActive: boolean; // Indicates if the card is currently active
}
