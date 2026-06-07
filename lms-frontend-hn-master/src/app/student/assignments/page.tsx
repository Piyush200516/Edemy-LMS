import React from 'react';
import { useAssignments } from './hooks/useAssignments';
import AssignmentCard from './AssignmentCard';
import AssignmentDetails from './AssignmentDetails';

export default function AssignmentsPage() {
  const { data: assignments, isLoading, isError, error } = useAssignments();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600">
        Error loading assignments: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No assignments available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
}
