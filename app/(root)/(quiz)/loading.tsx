import React from 'react'

const Loading = () => {
return (
    <>
      <div className="col-start-1 col-end-3">
        <div className="h-[40px] w-[80px] bg-gray-700 rounded animate-pulse" />
      </div>

      <header className="flex items-center justify-center col-start-3 col-end-11 pb-[10px]">
        <div className="h-[40px] w-[60%] bg-gray-700 rounded animate-pulse" />
      </header>

      <div className="col-start-12 col-end-13 flex items-center justify-center">
        <div className="h-[40px] w-[80px] bg-gray-700 rounded animate-pulse" />
      </div>

      <hr className="w-full border-[#2E3D52] col-start-3 col-end-11" />

      <div className="grid grid-cols-12 col-span-12">
        <div className="col-start-2 flex flex-col items-center justify-center pt-[25px] pr-[10px]">
          <div className="w-[104px] h-[104px] bg-gray-700 rounded-full animate-pulse" />
          <div className="w-[40px] h-[40px] bg-gray-700 mt-2 rounded animate-pulse" />
        </div>

        <div className="col-start-3 col-end-11 flex justify-center items-center rounded-[10px] bg-gray-700 h-[150px] px-[60px] mt-[20px] animate-pulse" />

        <div className="col-start-11 flex flex-col items-center justify-center pt-[25px] pl-[10px]">
          <div className="w-[64px] h-[64px] bg-gray-700 rounded-full animate-pulse" />
          <div className="w-[40px] h-[40px] bg-gray-700 mt-2 rounded animate-pulse" />
        </div>
      </div>

      <div className="col-start-3 col-end-11 flex items-center justify-center gap-[60px] pt-[30px]">
        <div className="h-[32px] w-[180px] bg-gray-700 rounded animate-pulse" />
        <div className="flex-1 h-[24px] bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="col-start-2 col-end-12 grid grid-cols-2 gap-x-[40px] mt-[30px] py-[40px] gap-[40px] bg-gray-700/70 rounded-[10px] px-[140px]">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-[180px] bg-gray-600 rounded-[10px] animate-pulse"
            />
          ))}
      </div>
    </>
  );
}

export default Loading