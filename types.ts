import React from 'react';

export enum ProjectStatus {
  PLANNING = 'Perencanaan',
  ONGOING = 'Sedang Berjalan',
  COMPLETED = 'Selesai',
  ON_HOLD = 'Tertunda'
}

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  progress: number;
  status: ProjectStatus;
  manager: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lastUpdated: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export interface AppSettings {
  appName: string;
  companyName: string;
}

export type ViewState = 'DASHBOARD' | 'PROJECTS' | 'INVENTORY' | 'AI_INSIGHTS';