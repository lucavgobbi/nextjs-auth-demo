import {
  UserManager,
  User,
  WebStorageStateStore,
  UserManagerSettings,
} from "oidc-client-ts";

export class AuthService {
  _callbacks: Array<any> = [];
  _nextSubscriptionId = 0;
  isAuthenticated = false;
  _userManager!: UserManager;
  _user?: User;

  async getUser() {
    if (this._user && this._user.profile) {
      return this._user.profile;
    }

    await this.ensureUserManagerInitialized();
    const user = await this._userManager!.getUser();
    return user && user.profile;
  }

  async getAccessToken() {
    await this.ensureUserManagerInitialized();
    const user = await this._userManager!.getUser();
    return user && user.access_token;
  }

  async signIn(state: any) {
    await this.ensureUserManagerInitialized();
    try {
      await this._userManager!.signinRedirect({ state: state });
      return this.redirect();
    } catch (redirectError) {
      console.log("Redirect authentication error: ", redirectError);
      return this.error(redirectError);
    }
  }

  async completeSignIn(url: string) {
    try {
      await this.ensureUserManagerInitialized();
      const user = await this._userManager!.signinCallback(url);
      this.updateState(user);
      return this.success(user && user.state);
    } catch (error) {
      console.log("There was an error signing in: ", error);
      return this.error("There was an error signing in.");
    }
  }

  async signOut(state: any) {
    await this.ensureUserManagerInitialized();
    try {
      await this._userManager!.signoutRedirect(this.createArguments(state));
      return this.redirect();
    } catch (redirectSignOutError) {
      console.log("Redirect signout error: ", redirectSignOutError);
      return this.error(redirectSignOutError);
    }
  }

  async completeSignOut(url: string) {
    await this.ensureUserManagerInitialized();
    try {
      const response = await this._userManager!.signoutCallback(url);
      this.updateState(null);
      return this.success({});
    } catch (error) {
      console.log(`There was an error trying to log out '${error}'.`);
      return this.error(error);
    }
  }

  updateState(user: any) {
    this._user = user;
    this.isAuthenticated = !!this._user;
  }

  createArguments(state: any = null): any {
    return { useReplaceToNavigate: true, data: state };
  }

  error(message: any) {
    return { status: AuthenticationResultStatus.Fail, message };
  }

  success(state: any) {
    return { status: AuthenticationResultStatus.Success, state };
  }

  redirect() {
    return { status: AuthenticationResultStatus.Redirect };
  }

  async ensureUserManagerInitialized() {
    if (this._userManager !== undefined) {
      return;
    }

    const settings: UserManagerSettings = {
      automaticSilentRenew: true,
      includeIdTokenInSilentRenew: true,
      userStore: new WebStorageStateStore({
        prefix: process.env.NEXT_PUBLIC_CLIENT_ID,
      }),
      authority: process.env.NEXT_PUBLIC_AUTHORITY!,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      response_type: "code",
      scope: process.env.NEXT_PUBLIC_SCOPE!,
    };

    this._userManager = new UserManager(settings);

    this._userManager!.events?.addUserSignedOut(async () => {
      await this._userManager!.removeUser();
      this.updateState(undefined);
    });
  }

  static get instance() {
    return authService;
  }
}

const authService = new AuthService();

export default authService;

export const AuthenticationResultStatus = {
  Redirect: "redirect",
  Success: "success",
  Fail: "fail",
};
