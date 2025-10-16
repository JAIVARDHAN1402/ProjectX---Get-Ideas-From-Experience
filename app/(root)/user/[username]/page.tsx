
import { Project, ThreeDCardDemo } from '@/components/ThreeDCardDemo';
import { EvervaultCard, Icon } from '@/components/ui/evervault-card';
import { PROJECT_BY_user_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import React from 'react';
import { auth } from '@/auth';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
    try {
        // console.log('🔍 Step 1: Starting page...');
        
        const resolvedParams = await params;
        // console.log('🔍 Step 2: Params resolved:', resolvedParams);
        
        const { username } = resolvedParams;
        // console.log('🔍 Step 3: Username from URL (encoded):', username);
        
        // ✅ FIX: URL decode the username
        const decodedUsername = decodeURIComponent(username);
        // console.log('🔍 Step 3.5: Username (decoded):', decodedUsername);
        
        const session = await auth();
        // console.log('🔍 Step 4: Session user:', session?.user);

        // Fetch user by DECODED username
        // console.log('🔍 Step 5: Fetching user by decoded username...');
        const user = await client.fetch(
            `*[_type == "user" && username == $username][0]{
                _id,
                username,
                email,
                image,
                Bio
            }`,
            { username: decodedUsername }  // ✅ Use decoded username
        );
        // console.log('🔍 Step 6: User found:', user);

        if (!user) {
            // console.log('❌ Step 7: User not found with decoded username:', decodedUsername);
            return notFound();
        }

        // Fetch user's projects
        // console.log('🔍 Step 8: Fetching user projects...');
        const userProjects = await client.fetch(PROJECT_BY_user_QUERY, { id: user._id });
        // console.log('🔍 Step 9: User projects:', userProjects);

        // console.log('✅ Step 10: Rendering page...');
        return (
            <section className='profile_box flex flex-col md:flex-row gap-8 mt-5 p-4'>
                {/* Profile Card */}
                <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col max-w-sm mx-auto p-4 relative h-[30rem] items-center">
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                    <EvervaultCard ImageUrl={session?.user?.image || "D:\DESKTOP\projecthub\public\profile.png"}/>

                    <h2 className="dark:text-white text-black mt-4 text-2xl font-bold">
                        {`${user.username}`}
                    </h2>
                    <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5">
                        User
                    </p>
                </div>

                {/* Projects Section - FIXED SPACING */}
                <div className='project_all flex-1'>
                    <div className='heading text-2xl font-bold mb-8'>
                        {session?.user?.email === user.email ? "Your Projects" : `${user.username}'s Projects`}
                    </div>
                    <div>
                        {userProjects && userProjects.length > 0 ? (
                            <div className='flex flex-wrap gap-8 justify-center'>
                                {userProjects.map((project: Project) => (
                                    <div key={project._id}>
                                        <ThreeDCardDemo project={project} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className='text-gray-500 dark:text-gray-400 text-lg'>
                                    {session?.user?.email === user.email 
                                        ? "You haven't created any projects yet." 
                                        : `${user.username} hasn't created any projects yet.`
                                    }
                                </p>
                                <p className='text-sm text-gray-400 mt-2'>
                                    User ID: {user._id} | Projects found: {userProjects?.length || 0}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        )
    } catch (error) {
        console.error('❌ FINAL ERROR:', error);
        return (
            <div className="flex justify-center items-center h-64 flex-col">
                <p className="text-xl text-red-500 mb-4">Error loading user profile</p>
                <p className="text-sm text-gray-500">Check browser console for details</p>
            </div>
        );
    }
}

export default Page;