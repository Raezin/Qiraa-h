// src/services/whisperApi.js

const SPACE_BASE = "https://abaansohail131-qirah-asr.hf.space";

const uploadFile = async (audioBlob) => {
  const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
  const formData = new FormData();
  formData.append('files', audioFile);

  const response = await fetch(`${SPACE_BASE}/gradio_api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed (${response.status}): ${text}`);
  }

  const result = await response.json();
  console.log('Upload result:', result);

  // Returns array of path strings in Gradio 5
  const first = Array.isArray(result) ? result[0] : result;
  return typeof first === 'string' ? first : (first?.path ?? first?.url);
};

const callPredict = async (serverPath) => {
  // Gradio 5 expects the full FileData object, not just the path string
  const payload = {
    data: [{
      path: serverPath,
      orig_name: 'recording.wav',
      mime_type: 'audio/wav',
      size: null,
      url: null,
      is_stream: false,
      meta: { _type: 'gradio.FileData' },
    }],
  };

  const postRes = await fetch(`${SPACE_BASE}/gradio_api/call/transcribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!postRes.ok) {
    const text = await postRes.text();
    throw new Error(`Predict POST failed (${postRes.status}): ${text}`);
  }

  const { event_id } = await postRes.json();
  console.log('Event ID:', event_id);

  const streamRes = await fetch(`${SPACE_BASE}/gradio_api/call/transcribe/${event_id}`);

  if (!streamRes.ok) {
    const text = await streamRes.text();
    throw new Error(`Stream failed (${streamRes.status}): ${text}`);
  }

  const text = await streamRes.text();
  console.log('Raw stream:', text);

  // SSE format — find the "complete" event data line
  const lines = text.split('\n');
  let lastEventType = null;

  for (const line of lines) {
    if (line.startsWith('event: ')) {
      lastEventType = line.slice(7).trim();
    } else if (line.startsWith('data: ')) {
      const json = line.slice(6).trim();
      if (!json || json === 'null') continue;

      if (lastEventType === 'error') {
        throw new Error(`Server error event: ${json}`);
      }

      try {
        const parsed = JSON.parse(json);
        // Gradio 5 complete event: { data: ["transcription"] }
        if (parsed?.data?.[0] !== undefined) return parsed.data[0];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch {
        // skip non-JSON lines
      }
    }
  }

  throw new Error(`No transcription in stream. Full response:\n${text}`);
};

export const transcribeAudio = async (audioBlob) => {
  try {
    console.log('Uploading audio...', { size: audioBlob.size, type: audioBlob.type });
    const serverPath = await uploadFile(audioBlob);
    console.log('Server path:', serverPath);

    const transcription = await callPredict(serverPath);
    console.log('Transcription:', transcription);

    return { success: true, transcription };
  } catch (error) {
    console.error('Whisper API error:', error);
    return { success: false, transcription: '', error: error.message };
  }
};

export const checkWhisperApiHealth = async () => {
  try {
    const res = await fetch(`${SPACE_BASE}/gradio_api/info`);
    return res.ok;
  } catch {
    return false;
  }
};