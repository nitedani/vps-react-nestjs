import ky from "ky";

export const client = ky.extend({
  prefixUrl: import.meta.env.SSR ? "http://localhost/api" : "/api",
});
