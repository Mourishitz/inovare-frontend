/**
 * Parses a backend date string, normalising microseconds to milliseconds
 * so that "2026-03-05T21:42:17.326578-03:00" is handled correctly.
 */
const parseBackendDate = (dateStr: string): Date => {
  // Truncate fractional seconds to at most 3 digits (ms precision)
  const normalised = dateStr.replace(/(\.\d{3})\d+/, "$1");
  return new Date(normalised);
};

export const useDate = () => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "N/A";
    return parseBackendDate(dateStr).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (dateStr?: string): string => {
    if (!dateStr) return "N/A";
    return parseBackendDate(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return { formatDate, formatDateTime };
};
