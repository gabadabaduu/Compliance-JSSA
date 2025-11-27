export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: User;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

// ============================================
// 📊 RAT Types
// ============================================
export interface Entity {
    id: number;
    name: string;
    description: string;
    fields: Field[];
    createdAt: string;
}

export interface Field {
    id: number;
    entityId: number;
    name: string;
    dataType: string;
    sensitivityLevel: 'Public' | 'Internal' | 'Confidential' | 'HighlyConfidential';
    isMandatory: boolean;
}

export interface Relation {
    id: number;
    sourceEntityId: number;
    targetEntityId: number;
    relationType: 'OneToOne' | 'OneToMany' | 'ManyToMany';
}

export interface GraphNode {
    id: string;
    data: { label: string };
    position: { x: number; y: number };
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    label: string;
}

// ============================================
// 📋 Dashboard Types
// ============================================
export interface DashboardMetrics {
    totalEntities: number;
    totalRequests: number;
    pendingRequests: number;
    slaAlerts: number;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}