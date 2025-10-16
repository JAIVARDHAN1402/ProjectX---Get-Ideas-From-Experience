import { Project, ThreeDCardDemo } from '@/components/ThreeDCardDemo';
import { EvervaultCard, Icon } from '@/components/ui/evervault-card';
import { client } from '@/sanity/lib/client';
import React from 'react';
import { auth } from '@/auth';
import { Link } from 'lucide-react';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
    try {
        const resolvedParams = await params;
        const { username } = resolvedParams;
        const session = await auth();

        console.log("🎯 Profile page accessed for username:", username);

        // Pehle username se search karo
        let user = await client.fetch(
            `*[_type == "user" && username == $username][0]{
                _id,
                username,
                email,
                image,
                Bio
            }`,
            { username }
        );

        // Agar username se nahi mila, toh session email se search karo
        if (!user && session?.user?.email) {
            console.log("🔍 User not found by username, trying session email...");
            user = await client.fetch(
                `*[_type == "user" && email == $email][0]{
                    _id,
                    username,
                    email,
                    image,
                    Bio
                }`,
                { email: session.user.email }
            );
        }

        // Agar phir bhi nahi mila, toh simple profile dikhao
        if (!user) {
            console.log("❌ User not found, showing fallback profile");
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Welcome!</h1>
                        <p className="mt-4 text-lg">Username: {username}</p>
                        <p className="mt-2 text-gray-600">Create your profile to get started</p>
                    </div>
                </div>
            );
        }

        console.log("✅ User found:", user.username);

        // User ke projects fetch karo
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

        // Check if current user is viewing their own profile
        const isOwnProfile = session?.user?.email === user.email;

        return (
            <section className='profile_box flex flex-col md:flex-row gap-8 mt-5 p-4'>
                {/* Profile Card */}
                <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col max-w-sm mx-auto p-4 relative h-[30rem] items-center">
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                    <EvervaultCard ImageUrl={user?.image || ""} />

                    <h2 className="dark:text-white text-black mt-4 text-2xl font-bold">
                        {user.username}
                    </h2>
                    <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5">
                        {isOwnProfile ? "Your Profile" : "User Profile"}
                    </p>
                </div>

                {/* Projects Section */}
                <div className='project_all flex-1'>
                    <div className='heading text-2xl font-bold mb-8'>
                        {isOwnProfile ? "Your Projects" : `${user.username}'s Projects`}
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
                                    {isOwnProfile 
                                        ? "You haven't created any projects yet." 
                                        : `${user.username} hasn't created any projects yet.`
                                    }
                                </p>
                                {isOwnProfile && (
                                    <Link 
                                        href="/project/create"
                                        className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Create Your First Project
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        )
    } catch (error) {
        console.error('❌ Profile page error:', error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Something went wrong</h1>
                    <p className="mt-4">Please try again later</p>
                </div>
            </div>
        );
    }
}

export default Page;