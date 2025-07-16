/**
 * Mapping for Activities, defined in `activities` table
 * Entries here, especially `id`s should match the IDs from the table
 * Make sure to update this alongside the `activities` table
 * Only the ID will make sense to use here. The type and dynamic text should act as guide for more clarity
 */
export const ACTIVITIES_MAPPING = [
  {
    id: 1,
    type: 'update_game_status_playing',
    dynamicText: `{user }started playing {gameName}.`, // ex: Armand started playing Elden Ring
  },
  {
    id: 2,
    type: 'add_to_library',
    dynamicText: `{gameName} has been added to {user}'s library.`,
  },
  {
    id: 3,
    type: 'update_game_status_backlog',
    dynamicText: `{userName} moved {gameName} to backlog.`,
  },
  {
    id: 4,
    type: 'update_game_status_completed',
    dynamicText: `{userName} completed {gameName}!`,
  },
  {
    id: 5,
    type: 'update_game_status_wishlisted',
    dynamicText: `{userName} added {gameName} to wishlist.`,
  },
];
