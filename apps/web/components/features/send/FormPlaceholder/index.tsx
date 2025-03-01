import React from 'react';

export const SendTransactionFormPlaceholder: React.FC = () => {
  return (
    <div className="p-6 min-w-[25rem] animate-pulse">
      <div className="flex items-center mb-6">
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="ml-3 h-5 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div className="mb-6">
        <div className="h-5 w-24 mb-2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div className="mb-6">
        <div className="h-5 w-32 mb-2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex items-center">
          <div className="h-12 flex-1 rounded-l-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-12 w-24 rounded-r-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-5 w-20 mb-2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-16 w-full rounded-lg bg-gray-200 dark:bg-gray-700 p-4">
          <div className="flex justify-between mb-2">
            <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="h-12 w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>
    </div>
  );
};

