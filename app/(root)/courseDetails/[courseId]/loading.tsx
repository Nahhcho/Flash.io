import React from 'react';

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-[#2E3D52] rounded-md ${className}`} />
);

const Loading = () => {
  return (
    <>
      <div className='col-start-4 col-end-13'>
        <SkeletonBox className='h-[40px] w-1/3 mb-[25px]' />
        <hr className='w-full border-[#2E3D52] mb-[70px]' />
        <SkeletonBox className='h-[40px] w-1/2 mb-[25px]' />
      </div>

      {/* Placeholder for AddModal */}
      <SkeletonBox className='h-[60px] w-[200px] col-start-4 col-end-13 mb-[30px]' />

      <div className='col-start-4 col-end-13'>
        <SkeletonBox className='h-[40px] w-2/3 mb-[30px] mt-[100px]' />

        <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] col-start-4 col-end-13'>
          {[...Array(3)].map((_, i) => (
            <SkeletonBox key={i} className='h-[180px] w-full' />
          ))}
        </div>
      </div>

      {/* Placeholder for bottom AddModal */}
      <SkeletonBox className='h-[60px] w-[200px] col-start-4 col-end-13 mt-[50px]' />
    </>
  );
};

export default Loading;
