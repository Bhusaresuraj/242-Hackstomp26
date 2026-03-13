#!/usr/bin/env python3
import sys
import json
import hashlib
from pathlib import Path

try:
    from gtts import gTTS
except ImportError:
    print(json.dumps({"error": "gTTS not installed"}))
    sys.exit(1)

def generate_audio(text, language):
    cache_dir = Path(__file__).parent.parent.parent.parent.parent / "public" / "audio-cache"
    cache_dir.mkdir(parents=True, exist_ok=True)
    
    text_hash = hashlib.md5(f"{text}_{language}".encode()).hexdigest()
    audio_file = cache_dir / f"{text_hash}.mp3"
    
    if audio_file.exists():
        return f"/audio-cache/{text_hash}.mp3"
    
    lang_map = {
        "English": "en",
        "Hindi": "hi",
        "Marathi": "mr"
    }
    
    lang_code = lang_map.get(language, "en")
    
    try:
        tts = gTTS(text=text, lang=lang_code, slow=False)
        tts.save(str(audio_file))
        return f"/audio-cache/{text_hash}.mp3"
    except Exception as e:
        return None

def main():
    try:
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        text = data.get("text", "")
        language = data.get("language", "English")
        
        if not text:
            print(json.dumps({"error": "No text provided"}))
            sys.exit(1)
        
        audio_path = generate_audio(text, language)
        
        if audio_path:
            print(json.dumps({"success": True, "audioPath": audio_path}))
        else:
            print(json.dumps({"error": "Failed to generate audio"}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
