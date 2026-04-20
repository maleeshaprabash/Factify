import React from 'react';

const Background = () => {
    // Generate random stars for the background
    const stars = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        cx: `${Math.random() * 100}%`,
        cy: `${Math.random() * 100}%`,
        r: Math.random() * 1.5 + 0.5, // radius from 0.5 to 2
        opacity: Math.random(),
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 5}s`
    }));

    return (
        <div className="fixed top-0 left-0 w-screen h-screen -z-10 bg-black pointer-events-none overflow-hidden">
            <svg className="w-full h-full">
                <style>
                    {`
                        @keyframes twinkle {
                            0% { opacity: 0.1; transform: scale(0.8); }
                            50% { opacity: 1; transform: scale(1.2); }
                            100% { opacity: 0.1; transform: scale(0.8); }
                        }
                        .star {
                            animation: twinkle ease-in-out infinite;
                        }
                    `}
                </style>
                {stars.map((star) => (
                    <circle
                        key={star.id}
                        cx={star.cx}
                        cy={star.cy}
                        r={star.r}
                        fill="#ffffff"
                        className="star"
                        style={{
                            opacity: star.opacity,
                            animationDelay: star.animationDelay,
                            animationDuration: star.animationDuration
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};

export default Background;
