import { Locator, Page } from '@playwright/test';

export class LoginEprsysComPage {
  private page: Page;
  private header: Locator;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.getByRole('heading', { name: 'You are using Internet Explorer.' });
    this.usernameInput = this.page.locator('#username');
    this.passwordInput = this.page.locator('#pass');
    this.loginButton = this.page.locator('#signin');
    this.forgotPasswordLink = this.page.locator('.forgot-password');
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }
}