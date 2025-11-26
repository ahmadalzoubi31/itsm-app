export const USER_PREFERENCES_ENDPOINTS = {
    base: "/api/v1/user-preferences",
    table: (preferenceKey: string) => `/api/v1/user-preferences/table/${preferenceKey}`,
    upsertTable: "/api/v1/user-preferences/table",
    deleteTable: (preferenceKey: string) =>
        `/api/v1/user-preferences/table/${preferenceKey}`,
    filters: (preferenceKey: string) => `/api/v1/user-preferences/filters/${preferenceKey}`,
    upsertFilters: "/api/v1/user-preferences/filters",
    deleteFilters: (preferenceKey: string) =>
        `/api/v1/user-preferences/filters/${preferenceKey}`,
};