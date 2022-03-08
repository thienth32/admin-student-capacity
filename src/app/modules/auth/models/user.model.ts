import { AuthModel } from './auth.model';
import { Role } from 'src/app/_share/models/role';

export class UserModel extends AuthModel {
  id: number;
  name: string;
  email: string;
  avatar: string;
  roles: Array<Role>;
}
