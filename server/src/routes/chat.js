import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabaseAdmin.js'
import { generateAssistantReply } from '../lib/llm.js'

const router = Router()

router.post('/reply', async (req, res) => {
  const { conversationId } = req.body
  if (!conversationId) {
    return res.status(400).json({ error: 'conversationId is required' })
  }

  try {
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('id, assigned_agent_id, status, widget_id')
      .eq('id', conversationId)
      .maybeSingle()

    if (convError || !conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    if (conversation.assigned_agent_id || conversation.status === 'closed') {
      return res.json({ skipped: true })
    }

    let widget = null
    let knowledgeBase = []
    if (conversation.widget_id) {
      const { data } = await supabaseAdmin
        .from('widgets')
        .select('system_prompt, assistant_name, persona, ai_model')
        .eq('id', conversation.widget_id)
        .maybeSingle()
      widget = data

      const { data: kb } = await supabaseAdmin
        .from('knowledge_base')
        .select('question, answer')
        .eq('widget_id', conversation.widget_id)
        .limit(50)
      knowledgeBase = kb ?? []
    }

    const { data: history, error: historyError } = await supabaseAdmin
      .from('messages')
      .select('sender_type, body')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(30)

    if (historyError) {
      return res.status(500).json({ error: historyError.message })
    }

    let systemPrompt =
      widget?.system_prompt ||
      (widget?.persona ? `You are ${widget.assistant_name || 'an assistant'}. ${widget.persona}` : null) ||
      'You are a helpful customer support assistant. Answer briefly and clearly.'

    if (knowledgeBase.length > 0) {
      const facts = knowledgeBase.map((k) => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n')
      systemPrompt += `\n\nUse the following known facts about this business when relevant:\n\n${facts}`
    }

    const replyText = await generateAssistantReply({
      systemPrompt,
      history,
      model: widget?.ai_model || 'claude-sonnet-5',
    })

    if (!replyText) {
      return res.json({ skipped: true })
    }

    const { error: insertError } = await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      sender_type: 'ai',
      body: replyText,
    })

    if (insertError) {
      return res.status(500).json({ error: insertError.message })
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('chat/reply failed', err)
    res.status(500).json({ error: err.message || 'Internal error' })
  }
})

export default router
