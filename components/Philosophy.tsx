import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Philosophy() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        Why This Site Exists
                    </h2>
                    <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                        Philosophy
                    </h3>
                </div>

                <div className="prose prose-lg prose-blue mx-auto dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                        I didn’t build this site to look good on a résumé.
                    </p>
                    <p>
                        I built it as my <strong>master digital twin</strong> — a single, living record of everything I’m thinking, building, and becoming. One JSON file is the source of truth; the rest of the site (projects, notes, experiments, even this page) pulls from it and updates automatically.
                    </p>
                    <p>
                        The term “digital twin” comes straight out of chemical engineering, the field I studied at LSU. In industry we create a virtual copy of a physical plant so we can monitor it, predict failures, and test changes without blowing anything up. I just turned the same idea inward. This site is the virtual copy of my mind and work: always in sync, always transparent, always evolving. In an age where AI can spin up a convincing version of anyone in seconds, this is my anchor. It’s the one place where the record is mine, versioned, and impossible to fake.
                    </p>
                    <p>
                        The pivot from chemical engineering to mathematics was never a grand plan. I loved the applied side of ChemE — messy data, real processes, seeing a model actually move a needle in the physical world. But the deeper I got into AI and machine learning, the more I felt like I was using tools without fully understanding the language they were written in. <strong>Math is that language.</strong> Linear algebra, probability, optimization, calculus — those are the primitives that make modern AI possible. Switching my focus wasn’t abandoning engineering; it was going straight to the foundation so I could actually shape the systems instead of just wiring them together.
                    </p>
                    <p>
                        That pivot taught me the only skill that seems to survive every tech wave: <strong>adaptability</strong>. Frameworks die, libraries get replaced, new paradigms show up every couple of years. The web in 2030–2032 will be even more of an infinite, self-directed classroom than it is today — AI co-pilots, open research, global communities, instant feedback loops. The people who thrive won’t be the ones who memorized the hottest stack; they’ll be the ones who can:
                    </p>
                    <ul className="my-8 space-y-2 list-none pl-0">
                        <li className="flex items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 mr-3 bg-blue-500 rounded-full"></span>
                            <span>Re-derive from first principles when the abstractions break</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 mr-3 bg-blue-500 rounded-full"></span>
                            <span>Flex between domains without panicking</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 mr-3 bg-blue-500 rounded-full"></span>
                            <span>Keep their human judgment sharp enough to steer the machines instead of being steered by them</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 mr-3 bg-blue-500 rounded-full"></span>
                            <span>Stay curious and creative even when the tools get scarily good</span>
                        </li>
                    </ul>
                    <p>
                        I’m betting on <strong>mathematical thinking</strong> as the timeless part, <strong>engineering pragmatism</strong> as the flexible part, and <strong>relentless self-teaching</strong> (the same way I learned full-stack dev with Cursor and a lot of late nights) as the delivery system. Everything on this site is an artifact of that bet.
                    </p>
                    <p>
                        So this digital twin isn’t a portfolio. It’s a <em>public lab notebook</em>, a mirror, and a promise to my future self: the record will stay honest, the thinking will stay visible, and the work will keep moving.
                    </p>
                    <p>
                        If that way of operating resonates with you — the quiet obsession with clarity, the joy of building things that actually make sense, the willingness to change direction when the evidence demands it — my inbox is open. Happy to talk shop, swap notes, or just geek out about whatever rabbit hole we’re both in.
                    </p>
                    <p className="mt-8 font-medium text-gray-900 dark:text-white">
                        — Ryan
                    </p>
                </div>
            </div>
        </section>
    );
}
