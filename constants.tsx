import { Project, ProjectStatus, Material } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Grand City Mall Expansion',
    client: 'PT. Grand City Property',
    location: 'Jakarta Selatan',
    budget: 15000000000,
    spent: 4500000000,
    startDate: '2023-11-01',
    endDate: '2025-06-30',
    progress: 35,
    status: ProjectStatus.ONGOING,
    manager: 'Budi Santoso'
  },
  {
    id: 'PRJ-002',
    name: 'Skyline Apartment Tower B',
    client: 'Skyline Group',
    location: 'Surabaya',
    budget: 45000000000,
    spent: 44800000000,
    startDate: '2022-03-15',
    endDate: '2024-05-20',
    progress: 98,
    status: ProjectStatus.COMPLETED,
    manager: 'Dewi Lestari'
  },
  {
    id: 'PRJ-003',
    name: 'Jembatan Layang Antasari',
    client: 'Dinas PU',
    location: 'Jakarta Selatan',
    budget: 7500000000,
    spent: 1200000000,
    startDate: '2024-01-10',
    endDate: '2024-12-20',
    progress: 15,
    status: ProjectStatus.ONGOING,
    manager: 'Hendra Gunawan'
  },
  {
    id: 'PRJ-004',
    name: 'Gudang Logistik Modern',
    client: 'PT. Logistik Maju',
    location: 'Cikarang',
    budget: 2500000000,
    spent: 0,
    startDate: '2024-06-01',
    endDate: '2024-11-30',
    progress: 0,
    status: ProjectStatus.PLANNING,
    manager: 'Siti Aminah'
  }
];

export const INITIAL_MATERIALS: Material[] = [
  { id: 'MAT-001', name: 'Semen Portland', category: 'Struktural', quantity: 500, unit: 'Zak', unitPrice: 65000, lastUpdated: '2024-05-20' },
  { id: 'MAT-002', name: 'Besi Beton Ulir 13mm', category: 'Besi & Baja', quantity: 1200, unit: 'Batang', unitPrice: 85000, lastUpdated: '2024-05-18' },
  { id: 'MAT-003', name: 'Pasir Beton', category: 'Agregat', quantity: 45, unit: 'Kubik', unitPrice: 350000, lastUpdated: '2024-05-21' },
  { id: 'MAT-004', name: 'Batu Bata Merah', category: 'Dinding', quantity: 15000, unit: 'Buah', unitPrice: 800, lastUpdated: '2024-05-15' },
];