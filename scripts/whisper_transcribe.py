"""공용 faster-whisper 모델로 음성을 전사한다 (CPU).

사용법: python scripts/whisper_transcribe.py <오디오 파일> [--words]
모델 경로는 환경 변수 WHISPER_MODEL_MEDIUM에서 읽는다.
"""
import os
import sys

from faster_whisper import WhisperModel

model_dir = os.environ.get("WHISPER_MODEL_MEDIUM")
if not model_dir or not os.path.isdir(model_dir):
    sys.exit("WHISPER_MODEL_MEDIUM 환경 변수가 없거나 폴더가 없습니다")
if len(sys.argv) < 2:
    sys.exit("사용법: python scripts/whisper_transcribe.py <오디오 파일> [--words]")

audio = sys.argv[1]
show_words = "--words" in sys.argv

model = WhisperModel(model_dir, device="cpu", compute_type="int8")
segments, info = model.transcribe(audio, language="ko", word_timestamps=show_words, vad_filter=False)
print(f"언어 {info.language}, 길이 {info.duration:.2f}초")
for s in segments:
    print(f"[{s.start:6.2f} -> {s.end:6.2f}] {s.text.strip()}")
    if show_words:
        for w in s.words:
            print(f"    {w.start:6.2f} {w.end:6.2f} {w.word}")
