'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing strategic suggestions to the player.
 *
 * The flow takes the current game state as input and returns AI-powered suggestions for improving gameplay and learning new tactics.
 * @param {StrategyAiAssistantInput} input - The input data including the current game state.
 * @returns {Promise<StrategyAiAssistantOutput>} - A promise that resolves to the AI's strategic suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StrategyAiAssistantInputSchema = z.object({
  gameState: z
    .string()
    .describe('The current state of the game, including aircraft positions, stats, and available actions.'),
});
export type StrategyAiAssistantInput = z.infer<typeof StrategyAiAssistantInputSchema>;

const StrategyAiAssistantOutputSchema = z.object({
  suggestion: z
    .string()
    .describe('A strategic suggestion for the player, based on the current game state.'),
});
export type StrategyAiAssistantOutput = z.infer<typeof StrategyAiAssistantOutputSchema>;

export async function getStrategySuggestion(
  input: StrategyAiAssistantInput
): Promise<StrategyAiAssistantOutput> {
  return strategyAiAssistantFlow(input);
}

const strategyAiAssistantPrompt = ai.definePrompt({
  name: 'strategyAiAssistantPrompt',
  input: {schema: StrategyAiAssistantInputSchema},
  output: {schema: StrategyAiAssistantOutputSchema},
  prompt: `You are an AI assistant designed to provide strategic suggestions in an aircraft war game.

  Analyze the current game state and suggest a strategic move for the player.

  Consider aircraft positions, stats, available actions, and potential outcomes.

  Provide clear and concise suggestions to improve gameplay and learn new tactics.

  Current Game State: {{{gameState}}}

  Suggestion:`,
});

const strategyAiAssistantFlow = ai.defineFlow(
  {
    name: 'strategyAiAssistantFlow',
    inputSchema: StrategyAiAssistantInputSchema,
    outputSchema: StrategyAiAssistantOutputSchema,
  },
  async input => {
    const {output} = await strategyAiAssistantPrompt(input);
    return output!;
  }
);
