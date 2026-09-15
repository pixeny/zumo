import Anthropic from '@anthropic-ai/sdk'

let client = null
function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set on the server')
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

export async function generateAssistantReply({ systemPrompt, history, model = 'claude-sonnet-5' }) {
  const anthropic = getClient()

  const messages = history.map((m) => ({
    role: m.sender_type === 'visitor' ? 'user' : 'assistant',
    content: m.body || '(sent an attachment)',
  }))

  const response = await anthropic.messages.create({
    model,
    max_tokens: 400,
    system: systemPrompt,
    messages,
  })

  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim()
}
