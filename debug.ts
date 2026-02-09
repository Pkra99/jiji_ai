// Debug script to test Supabase connection
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 20 chars):', supabaseKey?.substring(0, 20));

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('\n--- Testing Supabase Connection ---\n');

  // Test 1: Fetch all resources
  console.log('1. Fetching all resources...');
  const { data, error } = await supabase
    .from('resources')
    .select('*');

  if (error) {
    console.error('ERROR:', error.message);
    console.error('Details:', error);
  } else {
    console.log('SUCCESS! Found', data?.length || 0, 'resources:');
    data?.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.title} (${r.type}) - tags: ${r.tags?.join(', ')}`);
    });
  }
}

testConnection().catch(console.error);
