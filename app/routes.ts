import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
    
    layout('routes/layout.jsx', [
        index("routes/home.tsx"),
    ])
] satisfies RouteConfig;
