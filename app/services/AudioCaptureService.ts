import { Audio } from 'expo-av';

export class AudioCaptureService {
  private recordingA: Audio.Recording | null = null;
  private recordingB: Audio.Recording | null = null;
  private useRecordingA = true;
  private isRecording = false;

  async requestPermissions() {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  }

  async startContinuousRecording(onChunkReady: (uri: string) => void, chunkDurationMs = 5000) {
    if (this.isRecording) return;
    this.isRecording = true;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start the first recording
      this.recordingA = await this.createNewRecording();

      // Set up a loop to flip-flop recordings to emulate a rolling buffer
      const recordingLoop = async () => {
        if (!this.isRecording) return;

        // Start the next recording BEFORE stopping the current one to minimize gaps
        const nextRecording = await this.createNewRecording();
        const currentRecording = this.useRecordingA ? this.recordingA : this.recordingB;

        // Switch pointers
        if (this.useRecordingA) {
          this.recordingB = nextRecording;
        } else {
          this.recordingA = nextRecording;
        }
        this.useRecordingA = !this.useRecordingA;

        // Stop the old recording and process it
        if (currentRecording) {
          await currentRecording.stopAndUnloadAsync();
          const uri = currentRecording.getURI();
          if (uri) {
            onChunkReady(uri);
          }
        }

        setTimeout(recordingLoop, chunkDurationMs);
      };

      // Start loop
      setTimeout(recordingLoop, chunkDurationMs);
      console.log('Continuous recording started');

    } catch (err) {
      console.error('Failed to start recording', err);
      this.isRecording = false;
    }
  }

  private async createNewRecording(): Promise<Audio.Recording> {
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    return recording;
  }

  async stopRecording() {
    this.isRecording = false;

    if (this.recordingA) {
      await this.recordingA.stopAndUnloadAsync().catch(console.error);
      this.recordingA = null;
    }
    if (this.recordingB) {
      await this.recordingB.stopAndUnloadAsync().catch(console.error);
      this.recordingB = null;
    }
  }

  isCapturing() {
    return this.isRecording;
  }
}

export const audioCaptureService = new AudioCaptureService();
