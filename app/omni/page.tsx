'use client';

import { useState } from 'react';
import OmniLayout from '@/components/omni/OmniLayout';
import OmniHeroInput from '@/components/omni/OmniHeroInput';
import OmniBottomInput from '@/components/omni/OmniBottomInput';
import MessageBubble from '@/components/omni/MessageBubble';
import SuggestionChip from '@/components/omni/SuggestionChip';
import { cn } from '@/lib/utils';

export default function OmniPage() {
    const [hasStarted, setHasStarted] = useState(false);

    const suggestions = [
        "Analyze my startup's retention data",
        "Explain quantum entanglement like I'm 5",
        "Debug this React useEffect hook",
        "Draft a Series A pitch deck outline",
        "Compare Llama 3 vs GPT-4o architecture",
        "Generate a neon-noir city image"
    ];

    return (
        <OmniLayout>
            <div className="flex flex-col h-full min-h-[calc(100vh-64px)]">
                {!hasStarted ? (
                    /* Empty State / Hero */
                    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn">
                        <div className="w-full max-w-3xl space-y-12">
                            <div className="text-center space-y-6">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                                    What can I help you with?
                                </h1>
                                <p className="text-xl text-text-secondary font-light">
                                    Omni is ready to assist with code, creative writing, and analysis.
                                </p>
                            </div>

                            <div onClick={() => setHasStarted(true)}>
                                <OmniHeroInput />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                                {suggestions.map((suggestion, i) => (
                                    <SuggestionChip
                                        key={i}
                                        label={suggestion}
                                        onClick={() => setHasStarted(true)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Active Chat State */
                    <div className="flex-1 flex flex-col h-full relative">
                        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 space-y-8 pb-32 custom-scrollbar">
                            <div className="max-w-3xl mx-auto w-full">
                                <MessageBubble
                                    role="user"
                                    content="Explain quantum entanglement like I'm 5"
                                />
                                <MessageBubble
                                    role="ai"
                                    content="Imagine you have two magic dice. Normally, when you roll dice, the numbers are random. But with these magic dice, if you roll a 6 on one, the other one *instantly* shows a 6 too, no matter how far apart they are—even if one is on Mars!
                    
This connection is called **entanglement**. The particles are linked in a way where measuring one tells you exactly what the other is doing, faster than a text message could ever travel."
                                    sources={["Wikipedia: Quantum Mechanics", "NASA Science", "Stanford Encyclopedia of Philosophy"]}
                                />
                                <MessageBubble
                                    role="user"
                                    content="Wait, does that mean information travels faster than light?"
                                />
                                <MessageBubble
                                    role="ai"
                                    content="Great question! Use check: No, it actually doesn't. 
                    
While the *state change* is instantaneous, you can't use it to send a message (like 'Hello') faster than light. You still need to compare notes with the person on Mars using a regular radio signal to confirming the correlation. It's one of the weirdest parts of physics!"
                                />
                            </div>
                        </div>

                        {/* Bottom Input */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 bg-gradient-to-t from-background via-background to-transparent">
                            <OmniBottomInput />
                            <div className="text-center mt-3 text-xs text-text-secondary">
                                Omni can make mistakes. Check important info.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </OmniLayout>
    );
}
