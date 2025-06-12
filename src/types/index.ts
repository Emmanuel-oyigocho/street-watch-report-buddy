
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

export interface DatabaseReport {
  id: string;
  user_id: string;
  location: string;
  hazard_type: string;
  description: string;
  image_url?: string;
  submitted_by: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}
