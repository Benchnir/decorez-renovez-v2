<?php

namespace App\Services\AI;

use OpenAI\Client;
use Illuminate\Support\Facades\Cache;
use App\Models\Project;
use App\Models\Quote;

class ChatbotService
{
    protected $client;
    protected $context = [];

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function getResponse(string $message, array $context = [])
    {
        $this->context = $context;
        
        $systemPrompt = $this->getSystemPrompt();
        $conversation = $this->buildConversation($message);

        $response = $this->client->chat()->create([
            'model' => 'gpt-4',
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ...array_map(fn($msg) => [
                    'role' => $msg['role'],
                    'content' => $msg['content']
                ], $conversation)
            ],
            'temperature' => 0.7,
            'max_tokens' => 500,
        ]);

        return $response->choices[0]->message->content;
    }

    protected function getSystemPrompt(): string
    {
        return "Vous êtes un expert en rénovation et décoration d'intérieur. " .
               "Votre rôle est d'aider les clients à comprendre leurs besoins " .
               "et de leur donner des conseils précis sur leurs projets de rénovation. " .
               "Utilisez vos connaissances pour estimer les coûts, suggérer des matériaux " .
               "et expliquer les différentes étapes des travaux.";
    }

    public function analyzeMaterialPrices(array $materials): array
    {
        $marketPrices = Cache::remember('material_prices', 86400, function () {
            return $this->fetchCurrentMarketPrices();
        });

        $analysis = [];
        foreach ($materials as $material) {
            $marketPrice = $marketPrices[$material['type']] ?? null;
            if ($marketPrice) {
                $analysis[$material['type']] = [
                    'suggested_price' => $marketPrice,
                    'difference_percentage' => $this->calculatePriceDifference(
                        $material['price'],
                        $marketPrice
                    ),
                ];
            }
        }

        return $analysis;
    }

    public function suggestMaterials(Project $project): array
    {
        $prompt = $this->buildMaterialSuggestionPrompt($project);
        
        $response = $this->client->completions()->create([
            'model' => 'gpt-4',
            'prompt' => $prompt,
            'max_tokens' => 500,
        ]);

        return json_decode($response->choices[0]->text, true);
    }

    public function analyzeQuote(Quote $quote): array
    {
        $analysis = [
            'price_analysis' => $this->analyzeMaterialPrices($quote->materials),
            'labor_cost_analysis' => $this->analyzeLaborCosts($quote),
            'duration_analysis' => $this->analyzeDuration($quote),
            'market_comparison' => $this->compareWithMarketRates($quote),
        ];

        return $analysis;
    }

    protected function fetchCurrentMarketPrices(): array
    {
        // Implement API call to material price database
        return [];
    }

    protected function calculatePriceDifference($price, $marketPrice): float
    {
        return (($price - $marketPrice) / $marketPrice) * 100;
    }

    protected function buildConversation(string $message): array
    {
        return [
            ['role' => 'user', 'content' => $message]
        ];
    }

    protected function buildMaterialSuggestionPrompt(Project $project): string
    {
        return "Based on the following project description, suggest appropriate materials:\n" .
               "Project: {$project->description}\n" .
               "Budget: {$project->budget}€\n" .
               "Type of work: {$project->type}";
    }

    protected function analyzeLaborCosts(Quote $quote): array
    {
        // Implement labor cost analysis
        return [];
    }

    protected function analyzeDuration(Quote $quote): array
    {
        // Implement duration analysis
        return [];
    }

    protected function compareWithMarketRates(Quote $quote): array
    {
        // Implement market rate comparison
        return [];
    }
}
