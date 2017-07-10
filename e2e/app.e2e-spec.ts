import { TheLigaChallengeAppPage } from './app.po';

describe('the-liga-challenge-app App', () => {
  let page: TheLigaChallengeAppPage;

  beforeEach(() => {
    page = new TheLigaChallengeAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
