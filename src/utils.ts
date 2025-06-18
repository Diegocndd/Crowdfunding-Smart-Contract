export function getPercentage(part: number, total: number) {
  if (total === 0) return 0;
  return (part / total) * 100;
}

export function formatUnixTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getDaysRemaining(unixTimestamp: number) {
  const now = new Date();
  const targetDate = new Date(unixTimestamp * 1000);

  const diffInMs = targetDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays > 0 ? diffInDays : 0;
}

/**
 * Splits an address in two parts, if the address length is greater than the maxLen. The first part is the beginning of the address. The last part is the end of the address. Ellipsis is between the splitted address.
 * @param address
 * @param maxLen
 * @returns string
 */
export const reduceString = (address: string, maxLen: number): string => {
  if (!address) return "";
  return address.length > maxLen
    ? `${address.slice(0, maxLen / 2)}...${address.slice(-(maxLen / 2))}`
    : address;
};
