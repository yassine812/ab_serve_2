export type Mission = {
  id: number;
  code: string;
  intitule: string;
  reference: string;
  description: string;
  statut: boolean;
  statut_label: string;
  date_creation: string;
  client: string | null;
  designation: string | null;
  has_pdf: boolean;
  pdf_url: string | null;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type MissionMeta = {
  counts: {
    total: number;
    active: number;
    inactive: number;
  };
  references: string[];
};
