export interface UserInfo {
  userId: string;
  tenantId: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    userInfo?: UserInfo;
  }
}
