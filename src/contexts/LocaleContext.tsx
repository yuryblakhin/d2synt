import React, { createContext, useContext, useState, useEffect } from 'react';
import { messages, LocaleType } from '../locales';

interface LocaleContextType {
    locale: LocaleType;
    setLocale: (locale: LocaleType) => void;
    t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const defaultLocale = (process.env.REACT_APP_DEFAULT_LOCALE as LocaleType) || 'ru';
    const [locale, setLocale] = useState<LocaleType>(() => {
        const savedLocale = localStorage.getItem('locale');
        return (savedLocale as LocaleType) || defaultLocale;
    });

    useEffect(() => {
        localStorage.setItem('locale', locale);
    }, [locale]);

    const t = (path: string): string => {
        const keys = path.split('.');
        let current: any = messages[locale];

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation key not found: ${path}`);
                return path;
            }
            current = current[key];
        }

        return current;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
    );
};

export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};
