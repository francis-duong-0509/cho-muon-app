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
import { 
  create as createListing, 
  getById as getListingById, 
  list as listListings,
  listCategories,
  update as updateListing,
  pause as pauseListing,
  activate as activateListing,
  deleteListing,
  myListings,
  blockDates,
  unblockDates,
  checkAvailability
} from "./listings";

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
  listings: {
    create: createListing,
    list: listListings,
    getById: getListingById,
    categories: listCategories,
    myListings,
    blockDates,
    unblockDates,
    checkAvailability,
    update: updateListing,
    pause: pauseListing,
    activate: activateListing,
    delete: deleteListing
  }
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;