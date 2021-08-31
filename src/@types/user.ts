export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  register: string;
  birthDate?: Date;
}
