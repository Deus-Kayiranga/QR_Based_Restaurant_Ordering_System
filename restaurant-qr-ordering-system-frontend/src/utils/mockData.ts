/** Dev-only fallbacks when API is unavailable — prefer live data from Spring Boot. */
export const MOCK_PROMOS = [
  {
    id: 1,
    title: "Today's Special",
    sub: 'Chef pick',
    body: 'Ask your server for seasonal dishes.',
    gradient: ['#8B4513', '#D2691E'] as const,
  },
]
