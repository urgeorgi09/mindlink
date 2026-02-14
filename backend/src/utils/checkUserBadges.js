export const checkUserBadges = async (userId) => {
  // 1. Взимаме статистиката и вече отключените значки едновременно
  const [stats, alreadyUnlocked] = await Promise.all([
    UserStats.findOne({ where: { userId } }),
    UserBadge.findAll({ where: { userId }, attributes: ['badgeId'] })
  ]);

  if (!stats) return [];

  const unlockedIds = new Set(alreadyUnlocked.map(b => b.badgeId));

  // 2. Взимаме всички дефиниции на значки само веднъж
  const allBadges = await Badge.findAll();
  const newlyUnlocked = [];

  // 3. Логика за проверка (изнесена или параметризирана)
  for (const badge of allBadges) {
    if (unlockedIds.has(badge.id)) continue;

    // Динамична проверка на условията
    const userValue = stats[badge.targetField] || 0;
    if (userValue >= badge.threshold) {
      newlyUnlocked.push(badge);
    }
  }

  // 4. Масово записване на новите постижения (Bulk Create)
  if (newlyUnlocked.length > 0) {
    await UserBadge.bulkCreate(
      newlyUnlocked.map(b => ({ userId, badgeId: b.id }))
    );
  }

  return newlyUnlocked;
};