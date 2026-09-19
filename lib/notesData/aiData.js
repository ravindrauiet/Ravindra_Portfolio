export const aiData = {
  id: "ai",
  slug: "ai",
  name: "Artificial Intelligence",
  icon: "fas fa-robot",
  iconColor: "#ff7b00",
  badge: "AI & Machine Learning",
  description: "Understand Machine Learning models, Neural Networks, Large Language Models (LLMs), Prompt Engineering, and RAG Architecture.",
  totalLectures: 1,
  lectures: [
    {
      slug: "lecture-1",
      number: 1,
      title: "Introduction to AI, Machine Learning & LLM Integration",
      summary: "Explore Supervised vs Unsupervised Learning, Neural Network concepts, Vector Embeddings, and OpenAI/Gemini API integration.",
      readTime: "16 min read",
      difficulty: "Intermediate",
      date: "2026-09-19",
      sections: [
        {
          heading: "1. Core Categories of Artificial Intelligence",
          content: `Artificial Intelligence spans multiple paradigms:
• **Machine Learning (ML)**: Algorithms that learn patterns from training data to make predictions (Regression, Classification).
• **Deep Learning (DL)**: Multi-layer Artificial Neural Networks (ANNs, CNNs, Transformers) capable of feature extraction from unstructured data (images, text, audio).
• **Generative AI & LLMs**: Transformer models trained on vast text corpora to generate text, code, images, and reason step-by-step.`
        },
        {
          heading: "2. Retrieval-Augmented Generation (RAG) Architecture",
          content: `RAG combines LLMs with custom enterprise document data to eliminate hallucinations and deliver accurate domain answers:
1. **Document Ingestion**: Chunk text files into smaller semantic snippets.
2. **Vector Embeddings**: Convert text chunks into numerical vectors using embedding models (e.g. text-embedding-3-small).
3. **Vector Database**: Store vectors in databases like Pinecone, ChromaDB, or Pgvector.
4. **Similarity Search**: Retrieve top matching snippets based on user query cosine similarity.
5. **Augmented Prompting**: Inject retrieved context into the LLM system prompt.`,
          codeSnippet: `// Example: AI API Integration with Vector Context
async function queryAIWithContext(userQuestion, contextSnippets) {
  const prompt = \`
    You are an AI assistant. Answer the user question based strictly on the provided context below:
    
    Context:
    \${contextSnippets.join("\\n\\n")}

    Question: \${userQuestion}
  \`;

  // Send request to LLM endpoint
  const response = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  return await response.json();
}`
        },
        {
          heading: "3. Best Practices in Prompt Engineering",
          content: `• **Assign a Clear Role**: "You are a Senior Full-Stack Engineer reviewing a React PR."
• **Provide Structural Output Format**: Request JSON schemas or Markdown tables.
• **Use Few-Shot Examples**: Include 2-3 sample input-output pairs to guide model output accuracy.`
        }
      ]
    }
  ]
};
