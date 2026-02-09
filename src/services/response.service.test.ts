import { generateMockedResponse } from './response.service';

describe('Response Service', () => {
  describe('generateMockedResponse', () => {
    // Test matching known topics
    it('should return RAG explanation for RAG-related queries', () => {
      const queries = ['Explain RAG', 'What is RAG?', 'retrieval augmented generation'];
      
      queries.forEach((query) => {
        const response = generateMockedResponse(query);
        expect(response).toContain('RAG');
        expect(response).toContain('Retrieval-Augmented Generation');
      });
    });

    it('should return LLM explanation for LLM-related queries', () => {
      const response = generateMockedResponse('What is a large language model?');
      expect(response).toContain('Large Language Models');
    });

    it('should return prompt engineering info for prompt queries', () => {
      const response = generateMockedResponse('How to do prompt engineering?');
      expect(response).toContain('Prompt Engineering');
    });

    it('should return transformer info for architecture queries', () => {
      const response = generateMockedResponse('Explain transformer attention');
      expect(response).toContain('Transformers');
    });

    it('should return fine-tuning info for finetune queries', () => {
      const response = generateMockedResponse('How to fine tune a model');
      expect(response).toContain('Fine-tuning');
    });

    it('should return embedding info for vector queries', () => {
      const response = generateMockedResponse('What are embeddings and vectors?');
      expect(response).toContain('Embeddings');
    });

    it('should return AI info for general AI queries', () => {
      const response = generateMockedResponse('What is artificial intelligence?');
      expect(response).toContain('Artificial Intelligence');
    });

    // Edge cases
    it('should return default response for unknown topics', () => {
      const response = generateMockedResponse('Tell me about quantum computing');
      expect(response).toContain("That's an interesting question");
      expect(response).toContain('learning resources');
    });

    it('should handle empty strings gracefully', () => {
      const response = generateMockedResponse('');
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
    });

    it('should handle very long queries', () => {
      const longQuery = 'RAG '.repeat(500);
      const response = generateMockedResponse(longQuery);
      expect(response).toContain('RAG');
    });

    it('should be case insensitive', () => {
      const responses = [
        generateMockedResponse('RAG'),
        generateMockedResponse('rag'),
        generateMockedResponse('Rag'),
      ];
      
      // All should return the same RAG response
      responses.forEach((response) => {
        expect(response).toContain('Retrieval-Augmented Generation');
      });
    });

    it('should handle special characters in query', () => {
      const response = generateMockedResponse('What is RAG??? <script>alert("xss")</script>');
      expect(response).toContain('RAG');
    });

    it('should handle unicode characters', () => {
      const response = generateMockedResponse('What is RAG? 🤖');
      expect(response).toContain('RAG');
    });

    it('should handle queries with only whitespace after topic keyword', () => {
      const response = generateMockedResponse('   rag   ');
      expect(response).toContain('RAG');
    });
  });
});
