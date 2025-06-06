
export interface User {
  username: string;
  role: 'user' | 'admin';
}

export interface Report {
  id: string;
  location: string;
  hazardType: string;
  description: string;
  imageUrl?: string;
  submittedBy: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}

export interface ReportFormData {
  location: string;
  hazardType: string;
  description: string;
  imageUrl?: string;
  submittedBy: string;
}
