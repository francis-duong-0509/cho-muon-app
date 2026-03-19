import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../index";
import { 
  getUploadUrls, 
  submit, 
  getStatus, 
  listPending, 
  approve, 
  reject, 
  getDetail 
} from "./kyc";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  kyc: {
    getUploadUrls,
    submit,
    getStatus,
    admin: {
      listPending,
      approve,
      reject,
      getDetail,
    }
  },
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;