export const DEBT_TYPES = ['MULTA', 'IPVA', 'LICENCIAMENTO'] as const;

export type DebtType = (typeof DEBT_TYPES)[number];
