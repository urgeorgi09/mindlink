const BreathingTechnique = sequelize.define('BreathingTechnique', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  difficulty: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
  steps: {
    type: DataTypes.JSONB, // Postgres позволява съхранение на масив от обекти директно
    allowNull: false
  }
});