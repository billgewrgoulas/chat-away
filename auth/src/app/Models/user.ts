export class User {
  public lastComment: string = 'Click to start chatting.';
  public status: boolean = true;
  public details: any;
  public isVisible: boolean = true;
  public active = false;

  constructor(userData: any) {
    this.details = userData;
    if (userData.id == '60539a6801ac562984ae4f93') {
      this.status == true;
    } else if (userData.alive == true || userData.alive == false) {
      this.status = userData.alive;
    }
  }
}