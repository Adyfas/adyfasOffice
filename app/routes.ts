import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("contact", "routes/contact.tsx"),
    // route("lab", "routes/blog.tsx"),
    route("lab", "routes/adylab.tsx"),
    route("lab/:slug", "routes/adylabDetails.tsx"),
    // route("playground", "routes/playground.tsx"),
    ...prefix("project", [
      index("routes/project.tsx"),
      route(":slug", "routes/projectDetails.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
