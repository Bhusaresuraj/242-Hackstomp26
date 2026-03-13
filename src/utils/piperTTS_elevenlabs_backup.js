let currentAudio = null;

const ELEVENLABS_API_KEY = 'sk_675744abd7d66f4030a1c220e094dffed206e626c28dbb9b';

const VOICE_IDS = {
  English: 'pNInz6obpgDQGcFmaJgB',
  Hindi: 'pNInz6obpgDQGcFmaJgB',
  Marathi: 'pNInz6obpgDQGcFmaJgB'
};

export async function speakText(text, language = 'English') {
  if (typeof window === 'undefined') {
    return;
  }

  console.log('=== ElevenLabs TTS ===');
  console.log('Language:', language);
  console.log('Text length:', text.length);

  stopSpeaking();

  try {
    const voiceId = VOICE_IDS[language] || VOICE_IDS.English;
    
    console.log('Generating audio with ElevenLabs...');
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    console.log('Audio received, creating blob...');
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return new Promise((resolve, reject) => {
      currentAudio = new Audio(audioUrl);
      
      currentAudio.onloadeddata = () => {
        console.log('✓ Audio loaded');
      };

      currentAudio.onplay = () => {
        console.log('✓ Audio playing');
      };

      currentAudio.onended = () => {
        console.log('✓ Audio completed');
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        resolve();
      };

      currentAudio.onerror = (error) => {
        console.error('✗ Audio playback error:', error);
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        reject(error);
      };

      currentAudio.play().catch((error) => {
        console.error('✗ Play error:', error);
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        reject(error);
      });
    });
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error);
    throw error;
  }
}

export function stopSpeaking() {
  if (currentAudio) {
    console.log('Stopping audio...');
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}
