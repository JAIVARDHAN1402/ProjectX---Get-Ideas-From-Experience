import { auth } from '@/auth';
import ProjectForm from '@/components/ProjectForm'
import { redirect } from 'next/navigation';
import React from 'react'

const Create = async () => {
    const session = await auth();
    if(!session) redirect("/");
    return (
        <>
            <section className='form_container mx-auto !min-h-[250px] bg-emerald-600 flex justify-center items-center'>
                <div className=' bg-emerald-700 rounded-full '>
                    <h1 className='heading text-amber-50 text-[50px] p-6'>Submit Your Project</h1>
                </div>
            </section>
            <ProjectForm />

        </>
    )
}

export default Create
