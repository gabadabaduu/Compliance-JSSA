interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
}

export default function LoadingSpinner({ size = 'medium', text }: LoadingSpinnerProps) {
    const sizeConfig = {
        small: { container: 'w-5 h-5', radius: 8 },
        medium: { container: 'w-10 h-10', radius: 16 },
        large: { container: 'w-16 h-16', radius: 28 },
    };

    const dotSize = {
        small: 'w-1.5 h-1.5',
        medium: 'w-2 h-2',
        large: 'w-3 h-3',
    };

    const config = sizeConfig[size];

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className={`relative ${config.container} animate-spin`}>
                {/* Solo 4 puntos con opacidad diferente */}
                {[0, 1, 2, 3].map((i) => {
                    const angle = i * 90 * (Math.PI / 180);
                    const x = Math.cos(angle) * config.radius;
                    const y = Math.sin(angle) * config.radius;
                    const opacities = [1, 0.7, 0.4, 0.15];
                    
                    return (
                        <div
                            key={i}
                            className={`absolute ${dotSize[size]} bg-blue-500 rounded-full`}
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                                opacity: opacities[i],
                            }}
                        />
                    );
                })}
            </div>
            {text && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
            )}
        </div>
    );
}