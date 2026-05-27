import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class AudexumApi implements ICredentialType {
  name = 'audexumApi';
  displayName = 'Audexum API';
  documentationUrl = 'https://audexum.com/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      placeholder: 'sk_live_...',
      description:
        'Your Audexum API key. Create one at audexum.com/dashboard under "API Keys".',
    },
  ];
}
