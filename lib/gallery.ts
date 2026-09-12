export const COUPLE_GALLERY = Array.from({ length: 26 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/images/casal/casal-${n}.jpg`;
});
