export interface Menu {
  Name: string;
  Icon?: string;
  Path: string;
  Order?: number;
  Visible?: boolean;
  RequiredPrivilege?: string;
  Children?: Menu[];
}
