# API Provider Setup Guide

## Overview

This application supports multiple LLM providers. Each provider requires an API key that you obtain from their respective platforms. API keys are stored locally in your browser and never sent to our servers.

## Supported Providers

### 1. OpenAI

**Models Supported:**
- GPT-4o (Multimodal)
- GPT-4o Mini
- GPT-3.5 Turbo

**Setup:**
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Paste into the application

**Cost:** Pay-per-use, varies by model
**Rate Limits:** Varies by usage tier

### 2. Google Gemini

**Models Supported:**
- Gemini 1.5 Flash
- Gemini 1.5 Pro
- Gemini 2.0 Flash (Experimental)

**Setup:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API key"
4. Copy the generated key
5. Paste into the application

**Cost:** Free tier available, then pay-per-use
**Rate Limits:** Generous free tier limits

### 3. OpenRouter

**Models Supported:**
- Meta Llama 3.1 8B (Free)
- DeepSeek Chat V3 (Free)
- Anthropic Claude models (Paid)
- Many other models

**Setup:**
1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up for an account
3. Go to Keys section
4. Create a new API key
5. Copy the key
6. Paste into the application

**Cost:** Many free models available, paid models vary
**Rate Limits:** Varies by model and account type

## API Key Security

### What We Store
- **Masked Keys Only**: Only the provider name + last 4 digits (e.g., "openai_k8j3")
- **No Full Keys**: Your complete API key never leaves your browser
- **No Prompts**: Your test messages are never stored
- **No Responses**: LLM responses are never stored

### Local Storage
- Keys are stored in your browser's localStorage
- Keys persist until you manually delete them
- Keys are not synced across devices
- Clear your browser data to remove all keys

### Best Practices
1. **Use Separate Keys**: Create dedicated keys for this application
2. **Set Spending Limits**: Configure usage limits on your provider accounts
3. **Monitor Usage**: Regularly check your usage on provider dashboards
4. **Rotate Keys**: Periodically regenerate your API keys
5. **Secure Environment**: Don't use shared computers for API key entry

## Custom Models

### OpenAI Custom Models
- Use format: `gpt-4o-mini` or your fine-tuned model ID
- Must be accessible with your API key

### Gemini Custom Models
- Use format: `gemini-1.5-flash` or `models/gemini-1.5-pro`
- Check [Google's model list](https://ai.google.dev/gemini-api/docs/models/gemini)

### OpenRouter Custom Models
- Use full model path: `anthropic/claude-3-sonnet`
- Browse available models at [OpenRouter Models](https://openrouter.ai/models)

## Troubleshooting

### Common Issues

**"Invalid API Key" Error:**
- Verify key is copied correctly (no extra spaces)
- Check if key has required permissions
- Ensure billing is set up on provider account

**"Model Not Found" Error:**
- Verify model name spelling
- Check if model is available in your region
- Ensure your account has access to the model

**"Rate Limited" Error:**
- Wait before making more requests
- Check your usage limits on provider dashboard
- Consider upgrading your account plan

**"Insufficient Quota" Error:**
- Add billing information to your provider account
- Check if you've exceeded free tier limits
- Top up your account balance

### Provider-Specific Issues

**OpenAI:**
- Ensure billing is set up for API access
- Check organization membership if using team account
- Verify model availability in your region

**Google Gemini:**
- Ensure you're using the correct endpoint region
- Check if you've enabled the necessary APIs
- Verify your Google Cloud project settings

**OpenRouter:**
- Check if model requires credits vs free tier
- Verify account verification status
- Ensure model is currently available (some rotate)

## Support

For API-related issues:
1. Check provider documentation first
2. Verify your account status on provider dashboard
3. Test with provider's official tools
4. Contact provider support if account issues persist

For application issues:
- Create an issue in our GitHub repository
- Include error messages (with API key removed)
- Specify which provider and model you're using
