import { LoanType, LoanPurpose } from '../types/borrower';

export interface LoanProductInfo {
  id: LoanType;
  title: string;
  shortDesc: string;
  category: 'unsecured' | 'secured';
  isCollateralRequired: boolean;
  typicalTenureRange: string;
  bestSuitedFor: LoanPurpose[];
}

export const LOAN_PRODUCTS: Record<LoanType, LoanProductInfo> = {
  personal: {
    id: 'personal',
    title: 'Personal Loan',
    shortDesc: 'Unsecured retail loan for personal, wedding, or travel needs.',
    category: 'unsecured',
    isCollateralRequired: false,
    typicalTenureRange: '12 – 60 months',
    bestSuitedFor: ['wedding', 'medical_emergency', 'education', 'consumption_lifestyle'],
  },
  business_unsecured: {
    id: 'business_unsecured',
    title: 'Unsecured Business Loan',
    shortDesc: 'Short-term working capital or machinery loan for enterprises without pledging property.',
    category: 'unsecured',
    isCollateralRequired: false,
    typicalTenureRange: '12 – 48 months',
    bestSuitedFor: ['business_expansion', 'productive_asset'],
  },
  lap_secured: {
    id: 'lap_secured',
    title: 'Loan Against Property (LAP / MSME)',
    shortDesc: 'Secured loan against self-owned residential or commercial property with lower interest and longer tenure.',
    category: 'secured',
    isCollateralRequired: true,
    typicalTenureRange: '36 – 120 months',
    bestSuitedFor: ['business_expansion', 'debt_consolidation', 'productive_asset', 'education'],
  },
  two_wheeler: {
    id: 'two_wheeler',
    title: 'Two-Wheeler / Commercial Vehicle Loan',
    shortDesc: 'Vehicle hypothecation loan where the vehicle itself acts as security.',
    category: 'secured',
    isCollateralRequired: true,
    typicalTenureRange: '12 – 36 months',
    bestSuitedFor: ['productive_asset', 'other'],
  },
  gold: {
    id: 'gold',
    title: 'Gold Loan',
    shortDesc: 'Instant secured loan against physical gold jewelry with minimal income documentation.',
    category: 'secured',
    isCollateralRequired: true,
    typicalTenureRange: '6 – 24 months',
    bestSuitedFor: ['medical_emergency', 'business_expansion', 'other'],
  },
  home: {
    id: 'home',
    title: 'Home Loan',
    shortDesc: 'Long-term secured loan for property acquisition or home construction.',
    category: 'secured',
    isCollateralRequired: true,
    typicalTenureRange: '60 – 240 months',
    bestSuitedFor: ['home_purchase_renovation'],
  },
};
