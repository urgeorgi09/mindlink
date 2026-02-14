/**
 * Ограничава достъпа само до определени роли
 */
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Нямате разрешение за това действие."
            });
        }
        next();
    };
};

/**
 * Проверява дали потребителят е собственик на ресурса ИЛИ има висок ранг
 */
export const requireOwnershipOrRole = (allowedRoles = []) => {
    return (req, res, next) => {
        const userIdFromParams = req.params.userId;
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;

        const isOwner = currentUserId === userIdFromParams;
        const hasRole = allowedRoles.includes(currentUserRole);

        if (!isOwner && !hasRole) {
            return res.status(403).json({
                error: "Нямате достъп до тези данни."
            });
        }
        next();
    };
};