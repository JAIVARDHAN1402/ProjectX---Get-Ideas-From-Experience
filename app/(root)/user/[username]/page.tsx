import { Project, ThreeDCardDemo } from '@/components/ThreeDCardDemo';
import { EvervaultCard, Icon } from '@/components/ui/evervault-card';
import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import React from 'react';
import { auth } from '@/auth';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
    try {
        const resolvedParams = await params;
        const { username } = resolvedParams;
        const decodedUsername = decodeURIComponent(username);
        const session = await auth();

        console.log("🔍 URL Username:", decodedUsername);
        console.log("🔍 Session User:", session?.user);

        // ✅ FIX: Find user by username OR email
        const user = await client.fetch(
            `*[_type == "user" && (username == $username || email == $email)][0]{
                _id,
                username,
                email,
                image,
                Bio
            }`,
            { 
                username: decodedUsername,
                email: session?.user?.email // Session email se bhi search karo
            }
        );

        if (!user) {
            console.log("❌ User not found");
            return notFound();
        }

        console.log("✅ User found:", user);

        // ✅ FIX: Simple projects query
        const userProjects = await client.fetch(
            `*[_type == "project" && user._ref == $userId]{
                _id,
                title,
                description,
                category,
                imageUrl,
                user->{
                    _id,
                    username,
                    email,
                    image,
                    Bio
                }
            }`,
            { userId: user._id }
        );

        console.log("📊 User projects:", userProjects?.length);

        return (
            <section className='profile_box flex flex-col md:flex-row gap-8 mt-5 p-4'>
                {/* Profile Card */}
                <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col max-w-sm mx-auto p-4 relative h-[30rem] items-center">
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                    {/* ✅ FIX: Correct image path */}
                    <EvervaultCard ImageUrl={user?.image || ""} />

                    <h2 className="dark:text-white text-black mt-4 text-2xl font-bold">
                        {user.username}
                    </h2>
                    <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5">
                        User
                    </p>
                </div>

                {/* Projects Section */}
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
                                    Debug: User ID: {user._id} | Username: {user.username} | Email: {user.email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        )
    } catch (error) {
        console.error('❌ Profile page error:', error);
        return notFound();
    }
}

export default Page;