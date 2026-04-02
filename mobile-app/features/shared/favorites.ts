type UserFavoritesShape = {
  favoriteLocationIds?: unknown;
  favouriteLocationIds?: unknown;
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string");
};

export const getPersistedFavoriteLocationIds = (
  userData: UserFavoritesShape | null | undefined,
): string[] => {
  const primary = toStringArray(userData?.favoriteLocationIds);
  if (primary.length > 0) return primary;

  return toStringArray(userData?.favouriteLocationIds);
};
