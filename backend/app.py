import gradio as gr
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torchaudio
from transformers import GenerationConfig

# Load from subfolder
model_path = "./custom-whisper"
processor = WhisperProcessor.from_pretrained(model_path, local_files_only=True)
model = WhisperForConditionalGeneration.from_pretrained(model_path, local_files_only=True)

# Use GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
model.config.forced_decoder_ids = None
model.config.suppress_tokens = []
# Transcription function
def transcribe(audio):
    waveform, sr = torchaudio.load(audio)
    if sr != 16000:
        resampler = torchaudio.transforms.Resample(sr, 16000)
        waveform = resampler(waveform)
    
    inputs = processor(waveform.squeeze(), sampling_rate=16000, return_tensors="pt").input_features.to(device)

    with torch.no_grad():
        predicted_ids = model.generate(
            inputs,
            max_new_tokens=447  # or 512 or even higher depending on GPU memory
        )

    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
    return transcription



# Gradio interface
iface = gr.Interface(
    fn=transcribe,
    inputs=gr.Audio(type="filepath"),
    outputs="text",
    title="Whisper Base Arabic Transcription",
    description="Upload an Arabic MP3/WAV file to transcribe using Whisper Base fine-tuned model."
)

if __name__ == "__main__":
    iface.launch(show_error=True)
