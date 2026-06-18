'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Comment } from '@/lib/types/database'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'

interface Props {
  postId: string
  myUserId: string
  initialComments: Comment[]
}

export default function CommentThread({ postId, myUserId, initialComments }: Props) {
  const [comments, setComments] = useState(initialComments)
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`comments:${postId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'comments',
        filter: `post_id=eq.${postId}`,
      }, async (payload) => {
        const { data } = await supabase
          .from('comments')
          .select('*, profiles(*)')
          .eq('id', payload.new.id)
          .single()
        if (data) setComments(prev => [...prev, data as Comment])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [postId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('comments').insert({ post_id: postId, user_id: myUserId, body: body.trim() })
    setBody('')
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold font-body text-gray-700 text-sm">Comments ({comments.length})</h3>

      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {comments.length === 0 && (
          <p className="text-gray-400 text-xs font-body text-center py-2">No comments yet. Be first! 🍽️</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-2">
            <Avatar
              char={c.profiles?.icon_char}
              bgColor={c.profiles?.icon_bg_color}
              textColor={c.profiles?.icon_text_color}
              size="xs"
            />
            <div className="flex-1 bg-gray-50 rounded-2xl px-3 py-2">
              <span className="text-xs font-bold text-bite-purple font-body mr-1">@{c.profiles?.user_handle}</span>
              <span className="text-xs text-gray-700 font-body">{c.body}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-bite-teal"
        />
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="bg-bite-gradient text-white font-bold font-body px-4 py-2 rounded-full text-sm disabled:opacity-50 transition-opacity"
        >
          Post
        </button>
      </form>
    </div>
  )
}
