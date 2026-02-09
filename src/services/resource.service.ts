import { getServiceClient } from '../config/supabase';
import { Resource, ResourceResponse } from '../types';

export const searchResources = async (query: string): Promise<ResourceResponse[]> => {
  console.log('[Resource Service] Searching for:', query);

  // Get service client inside function to ensure env vars are loaded
  const supabase = getServiceClient();

  // Get all resources
  const { data, error } = await supabase
    .from('resources')
    .select('id, title, type, public_url, tags, description');

  if (error) {
    console.error('[Resource Service] Error fetching resources:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log('[Resource Service] No resources found in database');
    return [];
  }

  console.log('[Resource Service] Found', data.length, 'resources in database');

  // Extract keywords from query (only words with 3+ chars)
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);

  console.log('[Resource Service] Keywords:', keywords);

  // If no valid keywords, return all resources
  if (keywords.length === 0) {
    return (data as Resource[]).slice(0, 5).map((resource) => ({
      id: resource.id,
      title: resource.title,
      type: resource.type,
      url: resource.public_url,
    }));
  }

  // Filter resources that match any keyword
  const matchingResources = (data as Resource[]).filter((resource) => {
    const titleMatch = keywords.some((kw) =>
      resource.title.toLowerCase().includes(kw)
    );
    const descMatch = resource.description
      ? keywords.some((kw) => resource.description.toLowerCase().includes(kw))
      : false;
    const tagMatch = resource.tags
      ? keywords.some((kw) => resource.tags.some((tag) => tag.toLowerCase().includes(kw)))
      : false;

    return titleMatch || descMatch || tagMatch;
  });

  console.log('[Resource Service] Matching resources:', matchingResources.length);

  return matchingResources.slice(0, 5).map((resource) => ({
    id: resource.id,
    title: resource.title,
    type: resource.type,
    url: resource.public_url,
  }));
};

// Get all resources (fallback)
export const getAllResources = async (): Promise<ResourceResponse[]> => {
  console.log('[Resource Service] Getting all resources (fallback)');

  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from('resources')
    .select('id, title, type, public_url')
    .limit(5);

  if (error) {
    console.error('[Resource Service] Error fetching all resources:', error);
    return [];
  }

  console.log('[Resource Service] Found', data?.length || 0, 'resources');

  if (!data) return [];

  return data.map((resource) => ({
    id: resource.id,
    title: resource.title,
    type: resource.type as 'ppt' | 'video',
    url: resource.public_url,
  }));
};
