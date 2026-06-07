import React from 'react';
import { Assignment } from './types';

interface Props {
  assignment: Assignment;
}

const AssignmentCard: React.FC<Props> = ({ assignment }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-200">
      <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
        <span>{assignment.points} pts</span>
      </div>
    </div>
  );
};

export default AssignmentCard;
