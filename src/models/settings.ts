export interface FilterSettings {
    urlIncludes?: string[];
    urlExcludes?: string[];
    methods?: string[];
    contentTypes?: string[];
    isActive: boolean;
}
  
export interface AppSettings {
    captureEnabled: boolean;
    // darkMode: boolean;
    filters: FilterSettings;
    maxStorageSize: number; // In MB
    autoCleanupEnabled: boolean;
    autoCleanupAge: number; // In days
}