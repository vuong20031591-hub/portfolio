export type ErrorPageVariant = "notFound" | "serverError";

export interface ErrorPageProps {
  variant: ErrorPageVariant;
}
