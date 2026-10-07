import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

export default function AnalyticsRouteTracker() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const lastPath = useRef(location.pathname);

  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;

    window.gtag?.("event", "page_view", {
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, navigationType]);

  return null;
}