// pages/examplePage.ts

import { Page } from 'playwright';

export class ExamplePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private header = async () => this.page.$('h1');
  private paragraph = async () => this.page.$('p');
  private link = async () => this.page.$('a');

  public async getHeaderText() {
    const header = await this.header();
    return header ? header.innerText() : '';
  }

  public async getParagraphText() {
    const paragraph = await this.paragraph();
    return paragraph ? paragraph.innerText() : '';
  }

  public async clickLink() {
    const link = await this.link();
    if (link) {
      await link.click();
    }
  }
}