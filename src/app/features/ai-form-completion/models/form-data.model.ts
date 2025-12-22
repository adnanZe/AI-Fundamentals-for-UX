export interface ProfileFormData {
  subject: string;
  description: string;
}

export interface FormFieldChange {
  field: keyof ProfileFormData;
  oldValue: string;
  newValue: string;
  timestamp: Date;
  source: 'user' | 'ai';
}
