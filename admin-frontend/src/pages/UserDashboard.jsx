import React from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">👤 Потребителско Табло</h1>
          <p className="text-gray-600">Вашето пътуване към по-добро психично здраве</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mood Tracker */}
          <Link
            to="/emotions"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">😊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Следене на Настроение</h3>
              <p className="text-gray-600">Записвайте и следете вашето ежедневно настроение</p>
            </div>
          </Link>

          {/* Journal */}
          <Link
            to="/journal-hub"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Дневник</h3>
              <p className="text-gray-600">Пишете и организирайте вашите мисли</p>
            </div>
          </Link>

          {/* AI Chat */}
          <Link
            to="/chat"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Чат</h3>
              <p className="text-gray-600">Говорете с AI асистент за подкрепа</p>
            </div>
          </Link>

          {/* Breathing Exercises */}
          <Link
            to="/breathing"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🫁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Дихателни Упражнения</h3>
              <p className="text-gray-600">Релаксирайте се с дихателни техники</p>
            </div>
          </Link>

          {/* Crisis Resources */}
          <Link
            to="/crisis"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🆘</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Кризисни Ресурси</h3>
              <p className="text-gray-600">Бърза помощ в трудни моменти</p>
            </div>
          </Link>

          {/* Achievements */}
          <Link
            to="/badges"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Постижения</h3>
              <p className="text-gray-600">Вижте вашия напредък и награди</p>
            </div>
          </Link>

          {/* Active Therapists */}
          <Link
            to="/therapists"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🩺</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Активни Терапевти</h3>
              <p className="text-gray-600">Свържете се с лицензиран терапевт</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
