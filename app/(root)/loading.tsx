'use client'
import React from 'react';

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-[#2E3D52] rounded-md ${className}`} />
);

const Loading = () => {
  return (
    <>
      {/* Header */}
      <header className='flex justify-between items-center font-sora text-[32px] col-start-4 col-end-13 font-semibold text-white'>
        <SkeletonBox className='h-[40px] w-1/3' />
        <SkeletonBox className='h-[40px] w-[40px] rounded-full' />
      </header>

      {/* Calendar */}
      <SkeletonBox className='col-start-4 col-end-13 h-[300px] w-full mt-[30px]' />

      {/* ProgressBar */}
      <div className='col-start-4 col-end-12 pt-[70px]'>
        <SkeletonBox className='h-[20px] w-full mb-[15px]' />
        <SkeletonBox className='h-[30px] w-1/2 mx-auto' />
      </div>

      {/* Trophy image */}
      <div className='col-start-12 pt-[40px] flex justify-center '>
        <SkeletonBox className='w-[71px] h-[71px] rounded-full' />
      </div>

      {/* Today's Quizzes Header */}
      <header className='col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]'>
        <SkeletonBox className='h-[40px] w-1/3' />
      </header>

      {/* Empty grid for quizzes */}
      <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13'>
        {[...Array(3)].map((_, i) => (
          <SkeletonBox key={i} className='h-[150px] w-full' />
        ))}
      </div>

      {/* All Courses Header */}
      <header className='col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]'>
        <SkeletonBox className='h-[40px] w-1/3' />
      </header>

      {/* Courses grid */}
      <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13'>
        {[...Array(6)].map((_, i) => (
          <SkeletonBox key={i} className='h-[180px] w-full' />
        ))}
      </div>

      {/* AddModal placeholder */}
      <div className='col-start-4 col-end-13 mt-[40px]'>
        <SkeletonBox className='h-[60px] w-[200px]' />
      </div>
    </>
  );
};

export default Loading;

