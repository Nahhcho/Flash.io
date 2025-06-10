'use client'
import React from 'react';

const Loading = () => {
  return (
<>
      {/* Header */}
      <header className="flex justify-between items-center font-sora text-[32px] col-start-4 col-end-13 font-semibold text-white">
        <div className="h-[40px] w-[250px] bg-gray-700 rounded animate-pulse" />
        <div className="h-[50px] w-[50px] rounded-full bg-gray-700 animate-pulse" />
      </header>

      {/* Calendar */}
      <div className="col-start-4 col-end-13 mt-[30px] h-[300px] bg-gray-700 rounded-[10px] animate-pulse" />

      {/* Progress bar + motivation */}
      <div className="col-start-4 col-end-12 pt-[70px]">
        <div className="h-[24px] w-full bg-gray-700 rounded animate-pulse" />
        <span className="mt-4 h-[20px] w-[60%] bg-gray-600 rounded animate-pulse block mx-auto" />
      </div>

      {/* Trophy */}
      <div className="col-start-12 pt-[40px] flex justify-center">
        <div className="w-[71px] h-[71px] bg-gray-700 rounded-full animate-pulse" />
      </div>

      {/* Today's Quizzes header */}
      <header className="col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]">
        <div className="h-[36px] w-[300px] bg-gray-700 rounded animate-pulse" />
      </header>

      {/* Empty quiz grid */}
      <div className="grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={`quiz-${i}`}
              className="h-[140px] bg-gray-700 rounded-[10px] animate-pulse"
            />
          ))}
      </div>

      {/* All Courses header */}
      <header className="col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]">
        <div className="h-[36px] w-[300px] bg-gray-700 rounded animate-pulse" />
      </header>

      {/* Courses grid */}
      <div className="grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={`course-${i}`}
              className="h-[180px] bg-gray-700 rounded-[10px] animate-pulse"
            />
          ))}
      </div>
    </>
  );
};

export default Loading;

