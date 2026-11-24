import { data, type LoaderFunctionArgs } from "react-router";

/**
 * Catch-all: trả về HTTP 404 thật (không phải 200) để search engine
 * và analytics đọc đúng, rồi root ErrorBoundary render trang 404.
 */
export function loader({}: LoaderFunctionArgs) {
  throw data(null, { status: 404, statusText: "Not Found" });
}

export function meta() {
  return [
    { title: "404 - Page not found | VuongTech" },
    { name: "description", content: "The requested page could not be found." },
  ];
}

export default function NotFound() {
  return null;
}
