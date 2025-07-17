import { Locator, Page } from '@playwright/test';

export class MeitavViewtradeComPage {
  private page: Page;
  private header: Locator;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private forgotPasswordButton: Locator;
  private languageRadioEnglish: Locator;
  private languageRadioHebrew: Locator;
  private languageRadioRussian: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.getByRole('heading', { name: 'מסחר בוול סטריט עם מיטב טרייד' });
    this.usernameInput = this.page.locator('input[name="username"]');
    this.passwordInput = this.page.locator('input[name="password"]');
    this.loginButton = this.page.locator('input[name="processLogin"]');
    this.forgotPasswordButton = this.page.locator('input[name="forgotPasswd"]');
    this.languageRadioEnglish = this.page.locator('input#en');
    this.languageRadioHebrew = this.page.locator('input#he');
    this.languageRadioRussian = this.page.locator('input#ru');
  }

  public async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  public async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  public async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  public async selectLanguage(language: 'en' | 'he' | 'ru'): Promise<void> {
    switch (language) {
      case 'en':
        await this.languageRadioEnglish.click();
        break;
      case 'he':
        await this.languageRadioHebrew.click();
        break;
      case 'ru':
        await this.languageRadioRussian.click();
        break;
    }
  }
}
