import { getSkills } from '@/lib/masterReport';

export default async function SkillsPage() {
    const skills = await getSkills();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-5xl font-bold mb-8">Skills & Technologies</h1>

            <div className="max-w-6xl space-y-10">
                {Object.values(skills).map((skillCategory) => (
                    <section key={skillCategory.category} className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-900 border-b-2 border-blue-600 pb-2">
                            {skillCategory.category}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skillCategory.items.map((skill, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <h3 className="font-bold text-lg mb-1">{skill.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">Level: <span className="font-medium text-blue-600">{skill.level}</span></p>
                                    {skill.yearsOfExperience && (
                                        <p className="text-sm text-gray-600">{skill.yearsOfExperience} years of experience</p>
                                    )}
                                    {skill.context && (
                                        <p className="text-sm text-gray-700 mt-2 italic">{skill.context}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}