'use client';
import { useState, useRef, useEffect } from 'react';
import like from '../../public/like.svg';
import celebrate from '../../public/celebrate.svg';
import funny from '../../public/funny.svg';
import insightful from '../../public/insightful.svg';
import liked from '../../public/liked.svg';
import love from '../../public/love.svg';
import support from '../../public/support.svg';
import Image from 'next/image';
import { gsap } from 'gsap';

type ReactionType =
    | 'liked'
    | 'celebrate'
    | 'funny'
    | 'insightful'
    | 'love'
    | 'support'
    | null;

export default function Home() {
    const [isHovering, setIsHovering] = useState(false);
    const [selectedReaction, setSelectedReaction] =
        useState<ReactionType>(null);
    const reactionsRef = useRef<HTMLDivElement>(null);
    const likeButtonRef = useRef<HTMLButtonElement>(null);
    const iconsRef = useRef<(HTMLImageElement | null)[]>([]);

    useEffect(() => {
        if (selectedReaction) {
            gsap.to(likeButtonRef.current, {
                scale: 1.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
            });
        }
    }, [selectedReaction]);

    const handleMouseEnter = () => {
        setIsHovering(true);
        gsap.to(reactionsRef.current, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.1,
        });
        gsap.fromTo(
            '.reaction-icon',
            { scale: 0, y: 30, opacity: 0 },
            {
                scale: 1,
                y: 0,
                opacity: 1,
                duration: 0.1,
                stagger: 0.05,
                ease: 'power2.out',
            }
        );
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        gsap.to(reactionsRef.current, {
            opacity: 0,
            visibility: 'hidden',
            duration: 0.3,
        });
    };

    const handleIconHoverEnter = (index: number) => {
        gsap.to(iconsRef.current[index], {
            scale: 1.8,
            duration: 0.2,
            y: -15,
            zIndex: 10,
        });

        gsap.to(reactionsRef.current, {
            opacity: 1,
            visibility: 'visible',
            width: 320,
            duration: 0.3,
            ease: 'power2.out',
        });

        iconsRef.current.forEach((icon, i) => {
            if (icon && i !== index) {
                const distance = 15;
                const direction = i < index ? -0.4 : 0.4;
                gsap.to(icon, {
                    x: direction * distance,
                    duration: 0.2,
                    ease: 'power2.out',
                });
            }
        });
    };

    const handleIconHoverLeave = () => {
        gsap.to('.reaction-icon', {
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.2,
            ease: 'power2.out',
            zIndex: 1,
        });
    };

    const handleReactionClick = (reactionType: ReactionType) => {
        if (selectedReaction === reactionType) {
            setSelectedReaction(null);
        } else {
            setSelectedReaction(reactionType);
        }
        gsap.to(reactionsRef.current, {
            opacity: 0,
            visibility: 'hidden',
            duration: 0.3,
        });
    };

    const getLikeButtonIcon = () => {
        switch (selectedReaction) {
            case 'liked':
                return liked;
            case 'celebrate':
                return celebrate;
            case 'support':
                return support;
            case 'love':
                return love;
            case 'insightful':
                return insightful;
            case 'funny':
                return funny;
            default:
                return like;
        }
    };

    return (
        <div className='flex items-center justify-center h-screen bg-gray-100'>
            <div
                className='relative like-button-container group pt-4'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role='group'
                aria-label='LinkedIn reaction buttons'>
                <button
                    ref={likeButtonRef}
                    className='cursor-pointer'
                    aria-label={
                        selectedReaction
                            ? `You reacted with ${selectedReaction}`
                            : 'Like button'
                    }
                    onClick={() =>
                        selectedReaction && setSelectedReaction(null)
                    }>
                    <Image
                        alt={
                            selectedReaction
                                ? `${selectedReaction} icon`
                                : 'like icon'
                        }
                        src={getLikeButtonIcon()}
                        width={40}
                        height={40}
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                    />
                </button>

                <div
                    ref={reactionsRef}
                    className='absolute top-0 md:left-35 -translate-x-1/2 -translate-y-full flex gap-2 bg-white shadow-xl rounded-full p-3 opacity-0 invisible transition-opacity duration-300 group-hover:opacity-100 group-hover:visible w-max justify-between'>
                    {[
                        { type: 'liked', icon: liked, label: 'Like' },
                        {
                            type: 'celebrate',
                            icon: celebrate,
                            label: 'Celebrate',
                        },
                        { type: 'support', icon: support, label: 'Support' },
                        { type: 'love', icon: love, label: 'Love' },
                        {
                            type: 'insightful',
                            icon: insightful,
                            label: 'Insightful',
                        },
                        { type: 'funny', icon: funny, label: 'Funny' },
                    ].map((reaction, index) => (
                        <div key={reaction.type} className='relative'>
                            <Image
                                ref={(el) => {
                                    iconsRef.current[index] = el;
                                }}
                                className='reaction-icon cursor-pointer transition-transform duration-200'
                                alt={`${reaction.label} reaction`}
                                src={reaction.icon}
                                width={40}
                                height={40}
                                onClick={() =>
                                    handleReactionClick(
                                        reaction.type as ReactionType
                                    )
                                }
                                tabIndex={isHovering ? 0 : -1}
                                role='button'
                                aria-label={reaction.label}
                                onMouseEnter={() => handleIconHoverEnter(index)}
                                onMouseLeave={handleIconHoverLeave}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
