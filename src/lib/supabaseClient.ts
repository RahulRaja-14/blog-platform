import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dzfqatwdvpczdbalvirp.supabase.co'
const supabaseKey = 'sb_publishable_sQTsg54htHbN-quBBnfkTA_LU1gAV_u'

export const supabase = createClient(supabaseUrl, supabaseKey)
