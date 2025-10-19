import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다!')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseAnonKey ? '설정됨' : '없음')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)