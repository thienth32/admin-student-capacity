export class AuthModel {
  authToken: string;
  // refreshToken: string;
  // expiresIn: Date;

  setAuth(token: string) {
    this.authToken = token;
    // this.refreshToken = auth.refreshToken;
    // this.expiresIn = auth.expiresIn;
  }
}
