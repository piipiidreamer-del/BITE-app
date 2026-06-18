export type Profile = {
  id: string
  nickname: string
  user_handle: string
  icon_char: string
  icon_bg_color: string
  icon_text_color: string
  streak: number
  last_post_date: string | null
  first_bite_done: boolean
  created_at: string
}

export type Post = {
  id: string
  user_id: string
  caption: string | null
  image_top: string
  image_middle: string
  image_bottom: string
  is_first_bite: boolean
  created_at: string
  profiles?: Profile
}

export type Friendship = {
  id: string
  requester_id: string
  addressee_id: string
  status: 'pending' | 'accepted'
  created_at: string
  requester?: Profile
  addressee?: Profile
}

export type ReactionEmoji = 'drool' | 'plead' | 'neutral'

export type Reaction = {
  id: string
  post_id: string
  user_id: string
  emoji: ReactionEmoji
  created_at: string
  profiles?: Profile
}

export type Comment = {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
  profiles?: Profile
}

export type PostView = {
  id: string
  post_id: string
  viewer_id: string
  viewed_at: string
}
