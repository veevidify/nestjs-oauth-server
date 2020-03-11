import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  public adminGetUsers() {
    return ['should return all users'];
  }
}