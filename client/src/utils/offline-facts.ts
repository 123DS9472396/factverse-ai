// Fallback facts for offline mode
export const OFFLINE_FACTS = {
  science: [
    {
      id: 'offline-science-1',
      text: 'Water expands by about 9% when it freezes, which is why ice floats.',
      category: 'science',
      verified: true,
      likes: 0,
      createdAt: new Date().toISOString(),
    },
    // Add more science facts...
  ],
  history: [
    {
      id: 'offline-history-1',
      text: 'The Great Wall of China is not visible from space with the naked eye, contrary to popular belief.',
      category: 'history',
      verified: true,
      likes: 0,
      createdAt: new Date().toISOString(),
    },
    // Add more history facts...
  ],
  // Add more categories...
} as const;

export const getOfflineFact = (category?: string) => {
  if (!category) {
    const categories = Object.keys(OFFLINE_FACTS);
    category = categories[Math.floor(Math.random() * categories.length)];
  }
  
  const facts = OFFLINE_FACTS[category as keyof typeof OFFLINE_FACTS] || OFFLINE_FACTS.science;
  return facts[Math.floor(Math.random() * facts.length)];
};
