"use client";

import { IFlashcardSetDoc } from '@/database/flashcard-set.model';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
  set: IFlashcardSetDoc;
  rightAnswers: number;
  wrongAnswers: number;
  totalTime: string;
  percentage: number;
}

const ResultsContainer = ({
  percentage,
  set,
  rightAnswers,
  wrongAnswers,
  totalTime,
}: Props) => {
  const router = useRouter();

  let delay = 4000;
  let diff = 1000;
  let src = "";
  let audioSrc = "";
  let msg = ""

  if (percentage >= 90) {
    src = "/grades/brushA.png";
    audioSrc = "/audio/victory.mp3";
    msg = set.type === "Exam" && !set.completed ? 
    "Outstanding work! Building an advanced quiz to keep your momentum soaring—get ready!" :
    "Excellent focus! Keep this energy going—you’re mastering the material."
  } else if (percentage >= 80) {
    src = "/grades/brushB.png";
    audioSrc = "/audio/mid.mp3";
    delay = 2000;
    diff = 750;
    msg = set.type === "Exam" && !set.completed ?
    "Great job! Crafting a targeted quiz to help you push from good to great." :
    "Great consistency! Stay sharp and keep challenging yourself."
  } else if (percentage >= 70) {
    src = "/grades/brushC.png";
    audioSrc = "/audio/mid.mp3";
    delay = 2000;
    diff = 750;
    msg = set.type === "Exam" && !set.completed ? 
    "Solid effort! Preparing a quiz to reinforce key concepts and boost your confidence." :
    "Nice work! Every session strengthens your recall—keep it up."
    
  } else if (percentage >= 60) {
    src = "/grades/brushD.png";
    audioSrc = "/audio/failure.mp3";
    msg = set.type === "Exam" && !set.completed ? 
    "Keep it up! Generating a focused quiz to strengthen your understanding—you're on the right track." :
    "You're making progress! Keep showing up and the results will follow."
  } else {
    src = "/grades/brushF.png";
    audioSrc = "/audio/failure.mp3";
    msg = set.type === "Exam" && !set.completed  ? 
    "Don’t give up! Creating a fundamentals quiz to help you master the basics—let’s learn and grow together." :
    "Showing up is the first win. Keep going—every rep builds retention."
  }

  const computeMs = (mult: number) => `${delay + diff * mult}ms`;

  return (
    <>
      <audio src={audioSrc} autoPlay />

      <header className="flex items-center justify-center col-start-3 col-end-11 text-white text-[32px] font-sora font-semibold pb-[10px]">
        {set.title} Quiz Results
      </header>
      <hr className="w-full border-[#2E3D52] col-start-3 col-end-11" />

      <header className="col-start-5 col-end-13 font-sora font-semibold text-white text-[26px] pt-15">
        Quiz Results
      </header>

      <div className="col-start-5 col-end-9 grid grid-cols-6 bg-[#3D516D] rounded-[10px] mt-5 relative">
        <Image
          src={src}
          width={200}
          height={200}
          alt="grade"
          className="absolute right-0 -rotate-10 -translate-y-25 translate-x-25 motion-preset-shrink motion-duration-4000"
        />

        {/* Total Time */}
        <span
          className="col-start-1 pr-5 py-4 col-end-4 text-right text-white font-sora text-[26px] motion-preset-fade motion-duration-2000"
          style={{ animationDelay: computeMs(0) }}
        >
          Total Time:
        </span>
        <span
          className="col-start-4 pl-5 py-4 col-end-7 text-left text-white font-sora font-extralight text-[26px] motion-preset-fade motion-duration-2000"
          style={{ animationDelay: computeMs(0) }}
        >
          {totalTime} m
        </span>
        <hr className="border-1 border-[#516D94] col-span-6 mx-2" />

        {/* Right Answers */}
        <span
          className="col-start-1 pr-5 py-4 col-end-4 text-right text-white font-sora text-[26px] motion-preset-fade motion-duration-2000"
          style={{ animationDelay: computeMs(1) }}
        >
          Right Answers:
        </span>
        <span
          className="col-start-4 pl-5 py-4 col-end-7 text-left text-white font-sora font-extralight text-[26px] motion-preset-fade motion-duration-2000"
          style={{ animationDelay: computeMs(1) }}
        >
          {rightAnswers}
        </span>
        <hr className="border-1 border-[#516D94] col-span-6 mx-2" />

        {/* Wrong Answers */}
        <span
          className="col-start-1 pr-5 py-4 col-end-4 text-right text-white font-sora text-[26px] motion-preset-fade motion-duration-2000"
          style={{ animationDelay: computeMs(2) }}
        >
          Wrong Answers:
        </span>
        <span
          className="col-start-4 pl-5 py-4 col-end-7 text-left text-white font-sora font-extralight text-[26px] motion-preset-fade motion-duration-2000"
          style={{ animationDelay: computeMs(2) }}
        >
          {wrongAnswers}
        </span>
        <hr className="border-1 border-[#516D94] col-span-6 mx-2" />

        {/* Percentage */}
        <span
          className="col-start-1 pr-5 py-4 col-end-4 text-right text-white font-sora text-[26px] motion-preset-fade motion-duration-2000"
          style={{ animationDelay: computeMs(3) }}
        >
          Percentage:
        </span>
        <span
          className="col-start-4 pl-5 py-4 col-end-7 text-left text-white font-sora font-extralight text-[26px] motion-preset-fade motion-duration-2000"
          style={{ animationDelay: computeMs(3) }}
        >
          {percentage}%
        </span>
      </div>

        <div className="flex flex-col items-center justify-center col-start-5 col-end-9 pt-4 motion-preset-fade motion-duration-2000"
            style={{ animationDelay: computeMs(4) }}
        >
            <span className="font-sora text-white text-[20px] text-center ">
            {msg}
            </span>
            {set.type === "Exam" && !set.completed &&
            <span className="font-sora text-[#425775] text-[20px]">
            Will be available on your calendar once it&apos;s ready
            </span>
            }
        </div>

      <div
        className="col-start-5 col-end-9 flex gap-4 mt-4 motion-preset-fade motion-duration-2000"
        style={{ animationDelay: computeMs(4) }}
      >
        <div
          onClick={() => router.push("/")}
          className="flex flex-1/2 items-center justify-center w-[200px] gap-2 rounded-[10px] bg-[#6366F1] cursor-pointer hover:bg-[#898BF4]"
        >
          <p className="font-sora text-white text-[24px] py-1">Home</p>
        </div>
        <div
          onClick={() => window.location.reload()}
          className="flex flex-1/2 items-center justify-center w-[200px] gap-2 rounded-[10px] border-2 border-[#6366F1] cursor-pointer hover:border-[#898BF4]"
        >
          <p className="font-sora text-white text-[24px] py-1">Retry</p>
        </div>
      </div>
        
    </>
  );
};

export default ResultsContainer;
