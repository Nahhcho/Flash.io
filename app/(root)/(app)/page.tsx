import Calendar from '../../../components/app_components/Calendar'
import ProgressBar from '../../../components/app_components/ProgressBar'
import CourseCard from '../../../components/app_components/cards/CourseCard'
import Image from 'next/image'
import { auth } from '@/auth'
import UserAvatar from '@/components/app_components/UserAvatar'
import { api } from '@/lib/api'
import { ActionResponse } from '@/types/global'
import { ICourseDoc } from '@/database/course.model'
import AddModal from '@/components/app_components/modals/AddModal'
import { getTodayExamSets } from '@/lib/actions/set.action'
import SetCard from '@/components/app_components/cards/SetCard'


const App = async () => {
    const session = await auth();
    console.log(session)

    const res = await (api.courses.getAll(session!.user!.id!)) as ActionResponse<ICourseDoc[]>;
    console.log("RESULT:, ", res);
    const courses = res.data;
    console.log("Courses", courses);
    const result = await getTodayExamSets();
    
    const examSets = result.data;
        
  return (
   
        <> 
            <header className='flex justify-between items-center font-sora text-[32px] col-start-4 col-end-13 font-semibold text-white'>
                Your Study Plan
                <UserAvatar image={session?.user?.image} />
            </header>
            { courses && <Calendar courses={courses}/> }
            <div className='col-start-4 col-end-12 pt-[70px]'>
                <ProgressBar progress={66}/>
                <span className='flex font-sora text-[22px] justify-center pt-[17px] text-white'>Consistency beats cramming. Keep going!</span>
            </div>
            <div className='col-start-12 pt-[40px] flex justify-center '> <Image src={'/trophy.png'} width={71} height={71} alt='trophy' className='w-[71px] h-[71px]'/></div>
            <header className='col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]'>Today&apos;s Quizzes</header>
            <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13'>
                {
                    examSets && examSets.map((set) => (
                        <SetCard key={set._id.toString()} set={set}/>
                    ))
                }
            </div>
            <header className='col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]'>All Courses</header>
                <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13'>
                    {courses && courses.map((course: ICourseDoc) => (
                        <CourseCard key={course._id.toString()} _id={course._id.toString()} title={course.title}/>
                    ))}
                </div>
            {<AddModal formType={"ADD_COURSE"} />
            }
        </>
  )
}

export default App