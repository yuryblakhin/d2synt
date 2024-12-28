import React, { useState } from 'react';
export const D2synt: React.FC = () => {
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
      setError('Пожалуйста, введите текст для воспроизведения');
      return;
    }

    try {
      setIsPlaying(true);
      setError('');
      
      const context = new (window.AudioContext)();
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
      setError('Произошла ошибка при воспроизведении. Попробуйте еще раз.');
      console.error('Ошибка воспроизведения:', err);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(180deg, #e6f3ff 0%, #f0f7ff 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
          textAlign: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            D2synt
          </h2>
        </div>
        
        <div style={{ padding: '20px' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст для преобразования..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
              marginBottom: '16px',
              resize: 'none'
            }}
          />
          
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <button 
            onClick={playSequence}
            disabled={isPlaying}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isPlaying ? 'not-allowed' : 'pointer',
              opacity: isPlaying ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isPlaying ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                Воспроизведение...
              </>
            ) : (
              <>
                <span>▶</span>
                Воспроизвести
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default D2synt;