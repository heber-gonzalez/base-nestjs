export interface IConfigurationService {
    getDatabaseHost(): string;
    getDatabasePort(): number;
    getDatabaseUser(): string;
    getDatabasePassword(): string;
    getDatabaseName(): string;
    getDatabaseSchema(): string;
    getDatabaseSync(): boolean;
}