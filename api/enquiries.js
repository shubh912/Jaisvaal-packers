import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { name, phone, from_location, to_location, moving_date, service_type, message } = req.body;
      if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
      const { data, error } = await supabase.from('enquiries').insert({
        name, phone, from_location, to_location, moving_date, service_type, message, status: 'new'
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('enquiries api:', err);
    res.status(500).json({ error: err.message });
  }
}
