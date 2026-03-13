let currentAudio = null;

export async function speakText(text, language = 'English') {
  if (typeof window === 'undefined') {
    return;
  }

  console.log('=== Starting TTS ===');
  console.log('Language:', language);
  console.log('Text length:', text.length);

  stopSpeaking();

  if (!navigator.onLine) {
    console.log('Offline - TTS not available');
    throw new Error('Audio generation requires internet connection');
  }

  try {
    console.log('Requesting audio generation...');
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, language }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || 'Failed to generate audio');
    }

    console.log('Audio generated:', data.audioPath);

    return new Promise((resolve, reject) => {
      currentAudio = new Audio(data.audioPath);
      
      currentAudio.onloadeddata = () => {
        console.log('✓ Audio loaded');
      };

      currentAudio.onplay = () => {
        console.log('✓ Audio playing');
      };

      currentAudio.onended = () => {
        console.log('✓ Audio completed');
        currentAudio = null;
        resolve();
      };

      currentAudio.onerror = (error) => {
        console.error('✗ Audio playback error:', error);
        currentAudio = null;
        reject(new Error('Audio playback failed'));
      };

      const playPromise = currentAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('✗ Play error:', error);
          currentAudio = null;
          reject(error);
        });
      }
    });
  } catch (error) {
    console.error('TTS Error:', error);
    throw error;
  }
}

export function stopSpeaking() {
  if (currentAudio) {
    console.log('Stopping audio...');
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
      currentAudio.load();
    } catch (e) {
      console.log('Error stopping audio:', e);
    }
    currentAudio = null;
  }
}
