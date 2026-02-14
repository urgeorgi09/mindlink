import React, { useState, useEffect } from "react";
import api from "../services/api";

const TherapistSelector = ({ onSelectTherapist }) => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await api.get("/therapist-chat/available-therapists");
      if (response.data.success) {
        setTherapists(response.data.therapists);
      }
    } catch (error) {
      console.error("Failed to fetch therapists:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Зареждане на терапевти...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Изберете Терапевт</h2>

      <div className="grid gap-4">
        {therapists.map((therapist) => (
          <div
            key={therapist.id}
            onClick={() => onSelectTherapist(therapist)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🩺</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{therapist.name}</h3>
                  <p className="text-sm text-gray-600">Лицензиран терапевт</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-600">Онлайн</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {therapists.length === 0 && (
        <div className="text-center py-8 text-gray-500">Няма налични терапевти в момента</div>
      )}
    </div>
  );
};

export default TherapistSelector;
