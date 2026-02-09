interface MockedResponse {
  keywords: string[];
  answer: string;
}

// Predefined responses (mock response)
const mockedResponses: MockedResponse[] = [
  {
    keywords: ['rag', 'retrieval', 'augmented', 'generation'],
    answer:
      'RAG (Retrieval-Augmented Generation) is a technique that enhances AI responses by retrieving relevant information from external knowledge bases before generating answers. It combines the power of large language models with up-to-date, domain-specific knowledge, making responses more accurate and contextual.',
  },
  {
    keywords: ['llm', 'large', 'language', 'model'],
    answer:
      'Large Language Models (LLMs) are AI systems trained on massive amounts of text data to understand and generate human-like text. Examples include GPT-4, Claude, and Gemini. They excel at tasks like text generation, summarization, translation, and question answering.',
  },
  {
    keywords: ['prompt', 'engineering', 'prompting'],
    answer:
      'Prompt Engineering is the art of crafting effective inputs (prompts) to get desired outputs from AI models. Key techniques include: clear instructions, few-shot examples, chain-of-thought reasoning, and role-playing. Mastering prompts significantly improves AI model performance.',
  },
  {
    keywords: ['transformer', 'attention', 'architecture'],
    answer:
      'Transformers are neural network architectures that use self-attention mechanisms to process sequential data. Introduced in "Attention Is All You Need" (2017), they revolutionized NLP and form the foundation of modern LLMs. Key components include multi-head attention and positional encoding.',
  },
  {
    keywords: ['fine', 'tuning', 'finetune'],
    answer:
      'Fine-tuning is the process of taking a pre-trained model and training it further on domain-specific data. This allows models to specialize in particular tasks or industries while retaining their general capabilities. Common approaches include full fine-tuning, LoRA, and QLoRA.',
  },
  {
    keywords: ['embedding', 'vector', 'semantic'],
    answer:
      'Embeddings are numerical representations of text (or other data) in high-dimensional vector space. Similar concepts are placed close together in this space, enabling semantic search, clustering, and recommendation systems. Popular embedding models include OpenAI Ada and Sentence-BERT.',
  },
  {
    keywords: ['ai', 'artificial', 'intelligence', 'machine', 'learning'],
    answer:
      'Artificial Intelligence (AI) is the simulation of human intelligence by machines. Machine Learning (ML), a subset of AI, enables systems to learn from data without explicit programming. Deep Learning, using neural networks, has driven recent AI breakthroughs in vision, language, and more.',
  },
];

// Default response
const defaultResponse =
  "That's an interesting question about AI! While I don't have a specific pre-built answer for this topic, I recommend exploring the learning resources provided. They cover fundamental AI concepts that will help you understand this better.";

export const generateMockedResponse = (query: string): string => {
  const queryLower = query.toLowerCase();

  // Find the best matching response
  for (const response of mockedResponses) {
    const matchCount = response.keywords.filter((keyword) =>
      queryLower.includes(keyword)
    ).length;

    if (matchCount > 0) {
      return response.answer;
    }
  }

  return defaultResponse;
};
