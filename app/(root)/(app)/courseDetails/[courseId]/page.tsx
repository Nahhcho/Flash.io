import React from 'react'
import { api } from '@/lib/api'
import SetCard from '@/components/app_components/cards/SetCard'
import { IFlashcardSetDoc } from '@/database/flashcard-set.model'
import { error } from 'console'
import { ICourseDoc } from '@/database/course.model'
import AddModal from '@/components/app_components/modals/AddModal'
import DeleteModal from '@/components/app_components/modals/DeleteModal'
import { IStudyPlanDoc } from '@/database/study-plan.model'
import CourseCalendar from '@/components/app_components/calendars/CourseCalendar'
import { toLocalMidnight } from '@/lib/utils/dateLogic'
import NoCalanderDiv from '@/components/app_components/calendarPlaceHolders/NoCalenderDiv'
import StudyPlanCard from '@/components/app_components/cards/StudyPlanCard'



const CourseDetails = async ({ params }: {params: Promise<{ courseId: string }> }) => {
  const { courseId } = await params;
  let res = await api.courses.getSets(courseId);
  
  if (!res.success) {
    console.log("Error fetching response: ", error)
  }

  const sets = res.success ? res.data as IFlashcardSetDoc[] : [];

  res = await api.courses.getById(courseId);
  console.log(res)
  const course = res.success ? res.data as ICourseDoc : null;

  res = await api.courses.getStudyPlans(courseId);
  const studyPlans = res.success ? res.data as IStudyPlanDoc[] : null
  console.log("Course study plans!: ", studyPlans)

  const examSets: IFlashcardSetDoc[] = sets.filter(
    (set) => set.type === "Exam"
  );

  return (
    <>
      <div className='col-start-4 col-end-13'>
        <div className='flex justify-between items-start'>
          <header className=' text-white text-[32px] font-sora font-semibold pb-[20px]'>{course?.title}</header>
          <DeleteModal courseId={courseId}/>
        </div>
          <hr className=' w-full border-[#2E3D52]'/>
      </div>
      {
        !studyPlans || (studyPlans && studyPlans.length === 0) && <>
        <div className='col-start-4 col-end-13'>
          <NoCalanderDiv type='StudyPlans' courseName={course!.title!} courseId={course?._id.toString()}/>
        </div>
      </>}
    {
      studyPlans && studyPlans?.length > 0 && <>
      
            {examSets && studyPlans && 
            <>
              <span className='col-start-4 col-end-13 font-sora text-white text-[32px] pt-[40px]'>{course?.title} Study Plan</span>
              <CourseCalendar studyPlans={studyPlans} examSets={examSets} courseId={courseId}/>

              <div className='col-start-4 col-end-13 mt-[80px]'>
                <p className='font-sora text-white text-[32px] pb-[20px]'>Your current study plans</p>
        
                <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] col-start-4 col-end-13'>  
                  {studyPlans.map((sp) => (
                    <StudyPlanCard key={sp._id.toString()} sp={sp}/>
                  ))}
                </div>
              </div>
            </>
            }

          <div className='col-start-4 col-end-13 mt-[80]'>
            <p className='font-sora text-white text-[32px] pb-[20px]'>Today&apos;s Quizzes</p>
              <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] col-start-4 col-end-13'>
            {
              examSets?.map((set) => {
                if (!set?.dueDate) return null;
                
                const due = toLocalMidnight(new Date(set.dueDate)).getTime();
                const today = toLocalMidnight(new Date()).getTime();
                
                const isDueToday = due === today;
                const isOverdue = due < today && !set.completed;
                
                if (isDueToday || isOverdue) {
                  return <SetCard key={set._id.toString()} set={set} />;
                }
                
                return null;
              })
            }
            </div>
          </div>

      <div className='col-start-4 col-end-13 mt-[80px]'>
          <p className='font-sora text-white text-[32px] pb-[20px]'>Completed Quizzes</p>
              <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] col-start-4 col-end-13'>
                  {sets.map((set: IFlashcardSetDoc) => (
                      set.type === "Exam" && set.completed && <SetCard key={set._id.toString()} set={set}/>
                  ))}
              </div>
      </div>

      <div className='col-start-4 col-end-13  mt-[80px]'>
          <p className='font-sora text-white text-[32px] pb-[20px]'>Upcoming Quizzes</p>

          <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] col-start-4 col-end-13'>
              {sets.map((set: IFlashcardSetDoc) => (
                  set.type === "Exam" && new Date(set.dueDate!).getDate() > new Date().getDate() && <SetCard key={set._id.toString()} set={set}/>
              ))}
          </div>
      </div>
      </>}


      <div className='col-start-4 col-end-13 mt-[50px]'>
          <p className='font-sora text-white text-[32px] pb-[20px]'>All Sets</p>

              <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] col-start-4 col-end-13'>
                  {sets.map((set: IFlashcardSetDoc) => (
                      set.type === "Regular" && <SetCard key={set._id.toString()} set={set}/>
                  ))}
              </div>
      </div>
      <div className='col-start-4 col-end-7'>
        <AddModal formType={"ADD_SET"} courseId={courseId}/>
      </div>
    </>
  )
}

export default CourseDetails