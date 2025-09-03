// API utility functions for making authenticated requests

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message)
        this.name = 'ApiError'
    }
}

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
}

export function setAuthToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', token)
}

export function removeAuthToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
}

export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getAuthToken()

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    }

    const response = await fetch(endpoint, config)
    const data = await response.json()

    if (!response.ok) {
        throw new ApiError(response.status, data.error || 'Something went wrong')
    }

    return data
}

// Project API functions
export const projectApi = {
    getAll: () => apiRequest('/api/projects'),
    create: (data: { title: string; description?: string }) =>
        apiRequest('/api/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: string, data: { title: string; description?: string }) =>
        apiRequest(`/api/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        apiRequest(`/api/projects/${id}`, {
            method: 'DELETE',
        }),
    getById: (id: string) => apiRequest(`/api/projects/${id}`),
}

// Auth API functions
export const authApi = {
    login: (email: string, password: string) =>
        apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
    register: (email: string, password: string) =>
        apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
    logout: () =>
        apiRequest('/api/auth/logout', {
            method: 'POST',
        }),
    me: () => apiRequest('/api/auth/me'),
}

// Task API functions
export const taskApi = {
    getByProject: (projectId: string, params?: { status?: string; sortBy?: string; order?: string }) => {
        const searchParams = new URLSearchParams()
        if (params?.status) searchParams.set('status', params.status)
        if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
        if (params?.order) searchParams.set('order', params.order)

        const query = searchParams.toString()
        return apiRequest(`/api/projects/${projectId}/tasks${query ? `?${query}` : ''}`)
    },
    create: (projectId: string, data: { title: string; description?: string; status?: string; dueDate?: string }) =>
        apiRequest(`/api/projects/${projectId}/tasks`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: string, data: { title?: string; description?: string; status?: string; dueDate?: string }) =>
        apiRequest(`/api/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        apiRequest(`/api/tasks/${id}`, {
            method: 'DELETE',
        }),
    getById: (id: string) => apiRequest(`/api/tasks/${id}`),
}