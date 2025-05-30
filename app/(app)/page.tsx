import Calendar from '../../components/app_components/Calendar'
import ProgressBar from '../../components/app_components/ProgressBar'
import QuizCard from '../../components/app_components/cards/QuizCard'
import CourseCard from '../../components/app_components/cards/CourseCard'
import Image from 'next/image'
import CreateForm from '@/components/app_components/forms/CreateForm'

export const quizzes = [
    {
        title: "CMP 310 Final Review",
        terms: 10,
        completed: false  
    },
    {
        title: "Math 520 Quiz Review",
        terms: 25,
        completed: true
    },
    {
        title: "Biology 101 Midterm Review",
        terms: 11,
        completed: true
    },
    {
        title: "Physics 220 Test 1 Review",
        terms: 22,
        completed: false  
    }
]

const courses = [
    {
        id: 1,
        title: "Biology 101"
    },
    {
        id: 2,
        title: "Math 220"
    }
]

const App = () => {


  return (
   
        <>
            <Calendar />

            <div className='col-start-4 col-end-12 pt-[70px]'>
                <ProgressBar />
                <span className='flex font-sora text-[22px] justify-center pt-[17px] text-white'>Consistency beats cramming. Keep going!</span>
            </div>
            <div className='col-start-12 pt-[40px] flex justify-center '> <Image src={'/trophy.png'} width={71} height={71} alt='trophy' className='w-[71px] h-[71px]'/></div>
            <header className='col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]'>Today&apos;s Quizzes</header>
            <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13'>
                {quizzes.map((quiz, index) => (
                    <QuizCard key={index} quiz={quiz} />
                ))}
            </div>
            <header className='col-start-4 col-end-13 font-sora font-semibold text-white text-[32px] pt-[70px]'>All Courses</header>
            <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pt-[30px] col-start-4 col-end-13'>
                {courses.map((course) => (
                    <CourseCard key={course.id} title={course.title}/>
                ))}
            </div>
            <CreateForm formType="ADD_COURSE" defaultValues={{ title: "" }}/>
        </>
  )
}

export default App