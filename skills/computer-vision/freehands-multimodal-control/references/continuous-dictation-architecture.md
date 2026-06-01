# Continuous Dictation Engine — FreeHands

## Architecture

The continuous dictation engine provides free-form voice-to-text input,
separate from the discrete-command VoiceListener.

### Components

```
VoiceListener (whisper_listener.py)
  └── COMMAND_PHRASES dict
       ├── start_voice_typing → "empezar a escribir", "start writing", ...
       ├── stop_voice_typing  → "parar escribir", "stop writing", ...
       ├── start_dictation    → "dictar", "dictado", "empezar dictado", ...
       └── stop_dictation     → "parar dictado", "terminar dictado", ...
            ↑ stop commands MUST be defined BEFORE start commands (first match wins)
            ↑ voice typing commands MUST be defined BEFORE dictation (avoids collision with "start"/"esc")

ContinuousDictationEngine (continuous_dictation.py)
  ├── DictationState: IDLE | ACTIVE | COMMITTING
  ├── DictationConfig: model_size, language, backend, sample_rate,
  │                     chunk_seconds, silence_threshold, silence_cooldown,
  │                     max_buffer_length, commit_interval, auto_punctuation,
  │                     voice_typing_mode (bool), detected_language (str)
  ├── _whisper_loop() / _vosk_loop() — ASR backends
  ├── _process_transcript(text) — check stop phrases, punctuation, buffer
  ├── _apply_punctuation(text, norm) — keyword → punctuation mapping
  ├── _flush_buffer() — commit buffer to session text, call on_text callback
  ├── _auto_commit() — triggered by silence cooldown or buffer length
  └── _auto_detect_language(text) — infer language from first spoken words

main.py integration:
  ├── dictation_engine = ContinuousDictationEngine(DictationConfig(...))
  ├── dictation_active = False
  ├── _on_dictated_text(text) → pyautogui.write(text)
  ├── tick(): detect start_voice_typing/stop_voice_typing in voice_actions_this_frame
  ├── dictation_engine.start() / .stop()
  ├── overlay.set_language_indicator(lang) — show detected language badge
  ├── overlay.flash_action("dictando: {buffer[:60]}")
  └── cleanup(): dictation_engine.stop()

WHISPER_LANGUAGES (continuous_dictation.py):
  ├── Dict mapping 98+ ISO codes to display names
  ├── Used for language auto-detection and UI display
  └── Keys: "en", "es", "fr", "de", "pt", "ru", "ja", "zh", "ko", ...
```

## Voice Typing Mode (mejora #37)

Full voice typing with 99+ language support via Whisper tiny-base:
- **Config**: `DictationConfig.voice_typing_mode = True` (persisted in Profile)
- **Auto-detection**: First spoken language detected via Whisper tokenizer, stored in `engine.detected_language`
- **UI**: Language badge rendered in overlay (top-right corner, glass style)
- **Phrases (ES)**: "empezar a escribir", "empieza a escribir", "empezar escritura", "parar escribir", "dejar de escribir", "terminar escribir"
- **Phrases (EN)**: "start writing", "start dictation mode", "stop writing", "stop dictation mode"
- **Important**: These phrases were placed at the TOP of COMMAND_PHRASES dict, AND ambiguous substrings ("start" from resume, "esc" from escape) were removed from generic commands.

## Punctuation Map

Spanish and English keywords mapped to punctuation:
- Spanish: coma(,), punto(.), nueva linea(\n), signo de interrogacion(?),
  signo de exclamacion(!), parrafo(\n\n), arroba(@), guion(-), ...
- English: comma(,), period(.), new line(\n), question mark(?),
  exclamation mark(!), paragraph(\n\n), at(@), ...

## Command Collision Rules

When adding voice command phrases, check these collision points:
1. "stop" → matches toggle_pause
2. "escape"/"cancelar"/"cancel" → matches escape command
3. "escribir texto" → matches gaze_typing
4. Generic English words often collide with existing commands
5. **Always test**: `parse_voice_command("FreeHands <phrase>")`
6. **Ambiguous substring removal**: When a new command phrase contains a substring that matches an existing generic command (e.g., "start writing" contains "start" which matched `resume`, "empezar a escribir" contains "esc" which matched `escape`), you MUST remove that ambiguous substring from the generic command's phrase list. Example: change `resume` from `["start", ...]` to `["empezar", ...]`, change `escape` from `["esc", ...]` to `["escapar", ...]`.

## Design Decisions

- Dictation commands require wake word (not safety commands)
- Uses same sounddevice stream as VoiceListener (single mic)
- Text written via pyautogui.write() into focused OS text field
- Silence detection triggers auto-commit (RMS < threshold for > 800ms)
- Buffer length limit forces commit (500 chars default)
- Commit interval forces periodic flush (2s default)
- Voice typing mode is separate from dictation: voice typing uses auto-punctuation, dictation is raw text
