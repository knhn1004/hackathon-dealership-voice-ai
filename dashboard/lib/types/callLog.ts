export interface CallLog {
	_id: string;
	callSid: string;
	streamSid: string;
	createdAt: string;
	endedAt?: string;
	fullTranscript?: string;
	toolsUsed: string[];
	duration?: string; // Added this line
}

export interface Transcription {
	_id: string;
	callSid: string;
	role: string;
	content: string;
	timestamp: string;
}
