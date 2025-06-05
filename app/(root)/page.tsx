import Calendar from '../../components/app_components/Calendar'
import ProgressBar from '../../components/app_components/ProgressBar'
import CourseCard from '../../components/app_components/cards/CourseCard'
import Image from 'next/image'
import CreateForm from '@/components/app_components/forms/CreateForm'
import { auth } from '@/auth'
import UserAvatar from '@/components/app_components/UserAvatar'
import { api } from '@/lib/api'
import { ActionResponse } from '@/types/global'
import { ICourseDoc } from '@/database/course.model'


const App = async () => {
    const session = await auth();
    console.log(session)

    const res = await (api.courses.getAll(session!.user!.id!)) as ActionResponse<ICourseDoc[]>
    console.log("RESULT:, ", res)
    const courses = res.data
    console.log("Courses", courses)

  return (
   
        <>
                <header className='flex justify-between items-center font-sora text-[32px] col-start-4 col-end-13 font-semibold text-white'>
                    Your Study Plan
                    <UserAvatar image={session?.user?.image} />
                </header>
            <Calendar />
            <div className='col-start-4 col-end-12 pt-[70px]'>
                <ProgressBar />
                <span className='flex font-sora text-[22px] justify-center pt-[17px] text-white'>Consistency beats cramming. Keep going!</span>
            </div>
            <div className='col-start-12 pt-[40px] flex justify-center '> <Image src={'/trophy.png'} width={71} height={71} alt='trophy' className='w-[71px] h-[71px]'/></div>
            <header className='col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]'>Today&apos;s Quizzes</header>
            <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13'>
                
            </div>
            <header className='col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]'>All Courses</header>
            <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13'>
                {courses && courses.map((course: ICourseDoc) => (
                    <CourseCard key={course._id.toString()} _id={course._id.toString()} title={course.title}/>
                ))}
            </div>
            <CreateForm formType="ADD_COURSE" defaultValues={{ title: "" }}/>
        </>
  )
}

export default App