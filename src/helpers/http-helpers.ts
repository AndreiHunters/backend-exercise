export interface UserInfo {
  userId: string;
  tenant: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    userInfo?: UserInfo;
  }
}
