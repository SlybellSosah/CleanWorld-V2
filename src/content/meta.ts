import { pageMeta, type PageMeta } from "../lib/meta";
import { company, fact } from "./company";

export const metaFor = (page: PageMeta) => pageMeta(page, fact(company.siteUrl));
