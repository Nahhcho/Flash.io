import Calendar from '../../../components/app_components/calendars/Calendar'
import ProgressBar from '../../../components/app_components/ProgressBar'
import CourseCard from '../../../components/app_components/cards/CourseCard'
import Image from 'next/image'
import { auth } from '@/auth'
import UserAvatar from '@/components/app_components/UserAvatar'
import { api } from '@/lib/api'
import { ActionResponse } from '@/types/global'
import { ICourseDoc } from '@/database/course.model'
import AddModal from '@/components/app_components/modals/AddModal'
import SetCard from '@/components/app_components/cards/SetCard'
import { redirect } from 'next/navigation'
import { IFlashcardSetDoc } from '@/database/flashcard-set.model'
import { toLocalMidnight } from '@/lib/utils/dateLogic'


const App = async () => {
    const session = await auth();
    if (!session || !session.user) redirect("/about")
    console.log(session)
    let numberOfQuizzes = 0;
    let numberOfCompletedQuizzes = 0;
    const res = await (api.courses.getAll(session!.user!.id!)) as ActionResponse<ICourseDoc[]>;
    const courses = res.data;
    const result = (await api.user.getAllExamSets(session.user.id!))
    const examSets = result.data as IFlashcardSetDoc[];
    examSets.map((set) => {
        if (!set?.dueDate) return;
        
        const due = toLocalMidnight(new Date(set.dueDate)).getTime();
        const today = toLocalMidnight(new Date()).getTime();
        
        const isDueToday = due === today;
        
        if (isDueToday) {
            numberOfQuizzes += 1
            if (set.completed) {
                numberOfCompletedQuizzes += 1
            } 
        }
    })
    const progress = numberOfQuizzes === 0 ? 0 : numberOfCompletedQuizzes / numberOfQuizzes;
        
  return (
   
        <> 
            <header className='flex justify-between items-center font-sora text-[32px] col-start-4 col-end-13 font-semibold text-white'>
                Your Study Plan
                <UserAvatar image={session?.user?.image} />
            </header>
            { courses && <Calendar courses={courses}  examSets={examSets}/> }
            <div className='col-start-4 col-end-12 pt-[40px]'>
                <ProgressBar progress={(progress) * 100} displayHome={true}/>
            </div>
            <div className='col-start-12 pt-[10px] flex justify-end'> <Image src={'/trophy.png'} width={71} height={71} alt='trophy' className='w-[71px] h-[71px]'/></div>
            <header className='col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]'>Today&apos;s Quizzes</header>
            <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13'>
            {
                examSets?.map((set) => {
                    if (!set?.dueDate) return null;

                    const due = toLocalMidnight(new Date(set.dueDate)).getTime();
                    const today = toLocalMidnight(new Date()).getTime();

                    const isDueToday = due === today;
                    const isOverdue = due < today && !set.completed;

                    if (isDueToday) {
                        numberOfQuizzes += 1
                        if (set.completed) {
                            numberOfCompletedQuizzes += 1
                        } 
                    }

                    if (isDueToday || isOverdue) {
                    return <SetCard key={set._id.toString()} set={set} />;
                    }

                    return null;
                })
            }
            </div>
            <header className='col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]'>All Courses</header>
                <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13'>
                    {courses && courses.map((course: ICourseDoc) => (
                        <CourseCard key={course._id.toString()} _id={course._id.toString()} title={course.title}/>
                    ))}
                </div>
            <div className='col-start-4 col-end-7 pt-6'>
                <AddModal formType={"ADD_COURSE"} />
            </div>
        </>
  )
}

export default App