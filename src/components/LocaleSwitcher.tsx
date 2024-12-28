import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLocale } from '../contexts/LocaleContext';
import { messages } from '../locales';

export const LocaleSwitcher: React.FC = () => {
    const { locale, setLocale } = useLocale();
    const availableLocales = Object.keys(messages);

    return (
        <div className="fixed top-4 left-4 z-50">
            <Select
                value={locale}
                onValueChange={value => setLocale(value as keyof typeof messages)}
            >
                <SelectTrigger
                    className="w-[180px] bg-white dark:bg-gray-800 border border-gray-200
                             dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700
                             transition-colors duration-200"
                >
                    <div className="flex items-center gap-2">
                        <SelectValue placeholder={locale.toUpperCase()} />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {availableLocales.map(loc => (
                        <SelectItem key={loc} value={loc}>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                    <span className="font-medium">{loc.toUpperCase()}</span>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default LocaleSwitcher;
