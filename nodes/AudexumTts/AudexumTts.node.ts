import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

const BASE_URL = 'https://audexum.com/api';

export class AudexumTts implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Audexum TTS',
		name: 'audexumTts',
		icon: 'file:audexum.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Convert text to speech using Audexum — 43 voices, 33 languages, from €4/month',
		defaults: {
			name: 'Audexum TTS',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'audexumApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Synthesize Text',
						value: 'synthesize',
						description: 'Convert text to speech and return audio as binary',
						action: 'Synthesize text to speech',
					},
					{
						name: 'List Voices',
						value: 'listVoices',
						description: 'Get all available voice IDs',
						action: 'List available voices',
					},
					{
						name: 'Get Usage',
						value: 'getUsage',
						description: 'Get current character usage for the authenticated key',
						action: 'Get usage stats',
					},
				],
				default: 'synthesize',
			},

			// --- Synthesize options ---
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: {
					show: { operation: ['synthesize'] },
				},
				default: '',
				required: true,
				description: 'The text to convert to speech',
				placeholder: 'Enter text here…',
			},
			{
				displayName: 'Voice',
				name: 'voice',
				type: 'string',
				displayOptions: {
					show: { operation: ['synthesize'] },
				},
				default: 'af_heart',
				required: true,
				description:
					'Voice ID to use. Get the full list via the "List Voices" operation or at audexum.com/docs.',
				placeholder: 'af_heart',
			},
			{
				displayName: 'Audio Format',
				name: 'format',
				type: 'options',
				displayOptions: {
					show: { operation: ['synthesize'] },
				},
				options: [
					{ name: 'MP3', value: 'mp3' },
					{ name: 'WAV', value: 'wav' },
				],
				default: 'mp3',
				description: 'Output audio format',
			},
			{
				displayName: 'Speed',
				name: 'speed',
				type: 'number',
				typeOptions: { minValue: 0.5, maxValue: 2.0, numberStepSize: 0.05 },
				displayOptions: {
					show: { operation: ['synthesize'] },
				},
				default: 1.0,
				description: 'Playback speed multiplier (0.5–2.0, default 1.0)',
			},
			{
				displayName: 'Put Output In Field',
				name: 'binaryPropertyName',
				type: 'string',
				displayOptions: {
					show: { operation: ['synthesize'] },
				},
				default: 'data',
				description: 'Name of the binary field the audio file will be stored in',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('audexumApi');
		const apiKey = credentials.apiKey as string;

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				if (operation === 'synthesize') {
					const text = this.getNodeParameter('text', i) as string;
					const voice = this.getNodeParameter('voice', i) as string;
					const format = this.getNodeParameter('format', i) as string;
					const speed = this.getNodeParameter('speed', i) as number;
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

					const audioBuffer = await this.helpers.httpRequest({
						method: 'POST',
						url: `${BASE_URL}/synthesize`,
						headers: {
							Authorization: `Bearer ${apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							text,
							voice,
							format,
							...(speed !== 1.0 ? { speed } : {}),
						},
						encoding: 'arraybuffer',
					});

					const mimeType = format === 'wav' ? 'audio/wav' : 'audio/mpeg';
					const fileName = `speech.${format}`;

					const binaryData = await this.helpers.prepareBinaryData(
						Buffer.from(audioBuffer as unknown as ArrayBuffer),
						fileName,
						mimeType,
					);

					returnData.push({
						json: {
							voice,
							format,
							speed,
							textLength: text.length,
							fileName,
						},
						binary: {
							[binaryPropertyName]: binaryData,
						},
						pairedItem: { item: i },
					});
				} else if (operation === 'listVoices') {
					const voices = await this.helpers.httpRequest({
						method: 'GET',
						url: `${BASE_URL}/voices`,
						headers: { Authorization: `Bearer ${apiKey}` },
					});

					const voiceList = Array.isArray(voices) ? voices : Object.values(voices);
					for (const voiceId of voiceList) {
						returnData.push({
							json: { voice_id: voiceId },
							pairedItem: { item: i },
						});
					}
				} else if (operation === 'getUsage') {
					const usage = await this.helpers.httpRequest({
						method: 'GET',
						url: `${BASE_URL}/usage`,
						headers: { Authorization: `Bearer ${apiKey}` },
					});

					returnData.push({
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						json: usage as any,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}
