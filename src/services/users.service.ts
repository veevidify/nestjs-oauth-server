import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  public adminGetUsers() {
    return ['should return all users'];
  }

  public adminGetIndividualUser(userId: string) {
    return {user: 'Requesting user ' + userId};
  }
}
