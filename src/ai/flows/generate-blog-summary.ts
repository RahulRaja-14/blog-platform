'use server';
/**
 * @fileOverview A Genkit flow for generating a concise summary of a blog post.
 *
 * - generateBlogSummary - A function that handles the blog summary generation process.
 * - GenerateBlogSummaryInput - The input type for the generateBlogSummary function.
 * - GenerateBlogSummaryOutput - The return type for the generateBlogSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogSummaryInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  content: z.string().describe('The full content of the blog post.'),
});
export type GenerateBlogSummaryInput = z.infer<typeof GenerateBlogSummaryInputSchema>;

const GenerateBlogSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the blog post.'),
});
export type GenerateBlogSummaryOutput = z.infer<typeof GenerateBlogSummaryOutputSchema>;

export async function generateBlogSummary(
  input: GenerateBlogSummaryInput
): Promise<GenerateBlogSummaryOutput> {
  return generateBlogSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogSummaryPrompt',
  input: {schema: GenerateBlogSummaryInputSchema},
  output: {schema: GenerateBlogSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing blog posts.

Read the following blog post and generate a concise, engaging summary that captures its main points.
The summary should be suitable for a quick overview, allowing readers to understand the topic without needing to read the full article.

Blog Title: {{{title}}}

Blog Content:
{{{content}}}

---
Generate Summary:
`,
});

const generateBlogSummaryFlow = ai.defineFlow(
  {
    name: 'generateBlogSummaryFlow',
    inputSchema: GenerateBlogSummaryInputSchema,
    outputSchema: GenerateBlogSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
