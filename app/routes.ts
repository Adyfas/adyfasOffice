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
    route("playground", "routes/playground.tsx"),
    // route("blog", "routes/blog.tsx", [
    //   index("routes/blog._index.tsx"),
    //   route("write", "routes/blog.write.tsx"),
    //   route("dashboard", "routes/blog.dashboard.tsx"),
    //   route(":slug/edit", "routes/blog.$slug.edit.tsx"),
    //   route(":slug", "routes/blog.$slug.tsx"),
    // ]),
    ...prefix("project", [
      index("routes/project.tsx"),
      route(":slug", "routes/projectDetails.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
