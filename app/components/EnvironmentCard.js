import React from 'react';

const EnvironmentCard = ({ icon: Icon, label, value, unit, bgColor }) => {
  return (
    <div className={`environment-card ${bgColor}`}>
      <Icon className="w-5 h-5 text-amber-700" />
      <div>
        <p className="text-sm text-amber-700 font-medium">{label}</p>
        <p className="text-lg font-bold text-amber-800">{value}{unit}</p>
      </div>
    </div>
  );
};

export default EnvironmentCard;