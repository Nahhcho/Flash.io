import { ICourseDoc } from '@/database/course.model';
import { api } from '@/lib/api';
import Image from 'next/image'
import Navlinks from './Navlinks';
import { auth } from '@/auth';
import { ROUTES } from '@/constants/routes';
import { redirect } from 'next/navigation';

const Nav = async () => {
    const session = await auth();
    if (!session) {
        console.log("No session found")
        redirect(ROUTES.SIGN_IN)
    }
    const res = await api.courses.getAll(session!.user!.id!);

    let courses = null
    if (res.success) {
        courses = res.data as ICourseDoc[];
    }

  return (
    <div className='w-[226px] bg-[#A78BFA] h-screen pl-[25px] pt-[40px] fixed top-0 left-0'>
        
        <div className='flex items-center gap-1'>
            <Image src={"/favicon.png"} height={35} width={35} quality={100} alt='icon'/>
            <p className='font-semibold text-[28px] flex'>Nuero <p className='text-[#6F00FF]'>Note</p></p>
        </div>
    
        { <Navlinks courses={courses} />}            
        
    </div>
  )
}

export default Nav