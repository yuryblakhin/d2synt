import React, { useState } from 'react';
import ThemeSwitcher from './components/ThemeSwitcher';
import { LocaleSwitcher } from './components/LocaleSwitcher';
import { useLocale } from './contexts/LocaleContext';

export const D2synt: React.FC = () => {
    const { t } = useLocale();
    const [text, setText] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState('');

    const getFrequencyForChar = (char: string): number => {
        const charCode = char.charCodeAt(0);
        const baseFrequency = 2000;

        const normalizeCharCode = (code: number): number => {
            if (code >= 65 && code <= 90) {
                return code - 65;
            }

            if (code >= 97 && code <= 122) {
                return code - 97;
            }

            if (code >= 1040 && code <= 1071) {
                return code - 1040 + 26;
            }

            if (code >= 1072 && code <= 1103) {
                return code - 1072 + 26;
            }

            if (code === 1025 || code === 1105) {
                return 6 + 26;
            }

            if (code === 32) {
                return -10;
            }

            if (code >= 48 && code <= 57) {
                return code - 48 + 52;
            }
            return 0;
        };

        const normalizedIndex = normalizeCharCode(charCode);

        if (normalizedIndex === -10) {
            return baseFrequency * 0.5;
        }

        return baseFrequency * Math.pow(1.03, normalizedIndex);
    };

    const generateBeep = async (
        context: AudioContext,
        frequency: number,
        duration: number
    ): Promise<void> => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.type = frequency < 2000 ? 'sine' : 'square';
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration - 0.01);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + duration);

        return new Promise(resolve => setTimeout(resolve, duration * 1000));
    };

    const playSequence = async () => {
        if (!text) {
            setError('errors.emptyText');
            return;
        }

        try {
            setIsPlaying(true);
            setError('');

            const context = new window.AudioContext();
            const duration = 0.15;

            for (const char of text) {
                const baseFrequency = getFrequencyForChar(char);
                const randomVariation = Math.random() * 100 - 50;
                const finalFrequency = baseFrequency + randomVariation;

                await generateBeep(context, finalFrequency, duration);
                await new Promise(resolve => setTimeout(resolve, 30));
            }

            await context.close();
        } catch (err) {
            setError('errors.playbackError');
            console.error('Ошибка воспроизведения:', err);
        } finally {
            setIsPlaying(false);
        }
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            <ThemeSwitcher />
            <LocaleSwitcher />

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-transform hover:scale-[1.02]">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        {t('app.title')}
                    </h2>
                </div>

                <div className="p-6 space-y-4">
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder={t('input.placeholder')}
                        className="w-full min-h-[120px] p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                                 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                                 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                                 resize-none transition-colors duration-200"
                    />

                    {error && (
                        <div
                            className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800
                                    text-red-700 dark:text-red-200 p-3 rounded-lg text-sm"
                        >
                            {t(error)}
                        </div>
                    )}

                    <button
                        onClick={playSequence}
                        disabled={isPlaying}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600
                               hover:from-blue-600 hover:to-blue-700
                               text-white font-semibold rounded-lg
                               flex items-center justify-center gap-2
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transform transition-all duration-200 active:scale-95"
                    >
                        {isPlaying ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                {t('button.playing')}
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                {t('button.play')}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
