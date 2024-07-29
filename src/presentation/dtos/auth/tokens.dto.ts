export class TokensDto {
    accessToken: string;
    refreshToken: string;

    constructor(access_token?: string, refresh_token?: string) {
        if (access_token) {
            this.accessToken = access_token;
        }
        if (refresh_token) {
            this.refreshToken = refresh_token;
        }
    }
}