export interface Authorization {
  User: User;
  Privileges: Privileges[];
  Roles: Roles[];
}
export interface User {
  Name: string;
  Id: string;
}

export interface Privileges {
  Id: number;
  Name: string;
  Description: string;
}

export interface Roles {
  Description: string;
  RoleId: number;
  RoleName: string;
}
