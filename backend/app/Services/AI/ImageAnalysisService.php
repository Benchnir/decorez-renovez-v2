<?php

namespace App\Services\AI;

use Google\Cloud\Vision\V1\ImageAnnotatorClient;
use App\Models\ProjectImage;
use Illuminate\Support\Facades\Storage;

class ImageAnalysisService
{
    protected $client;
    protected $openAIClient;

    public function __construct(ImageAnnotatorClient $client, \OpenAI\Client $openAIClient)
    {
        $this->client = $client;
        $this->openAIClient = $openAIClient;
    }

    public function analyzeProjectImages(array $images): array
    {
        $results = [];
        foreach ($images as $image) {
            $results[] = $this->analyzeSingleImage($image);
        }
        return $this->aggregateResults($results);
    }

    protected function analyzeSingleImage(ProjectImage $image): array
    {
        $path = Storage::path($image->path);
        $imageContent = file_get_contents($path);

        // Google Cloud Vision Analysis
        $visionAnalysis = $this->performVisionAnalysis($imageContent);
        
        // OpenAI Analysis for detailed insights
        $openAIAnalysis = $this->performOpenAIAnalysis($visionAnalysis);

        return [
            'image_id' => $image->id,
            'vision_analysis' => $visionAnalysis,
            'ai_insights' => $openAIAnalysis,
        ];
    }

    protected function performVisionAnalysis(string $imageContent): array
    {
        $image = new \Google\Cloud\Vision\V1\Image();
        $image->setContent($imageContent);

        $features = [
            'LABEL_DETECTION',
            'OBJECT_LOCALIZATION',
            'TEXT_DETECTION',
            'SAFE_SEARCH_DETECTION',
        ];

        $requests = [];
        foreach ($features as $feature) {
            $requests[] = (new \Google\Cloud\Vision\V1\Feature())
                ->setType($feature);
        }

        $response = $this->client->annotateImage($image, $requests);

        return [
            'labels' => $this->extractLabels($response->getLabelAnnotations()),
            'objects' => $this->extractObjects($response->getLocalizedObjectAnnotations()),
            'text' => $this->extractText($response->getTextAnnotations()),
            'safe_search' => $this->extractSafeSearch($response->getSafeSearchAnnotation()),
        ];
    }

    protected function performOpenAIAnalysis(array $visionAnalysis): array
    {
        $prompt = $this->buildAnalysisPrompt($visionAnalysis);

        $response = $this->openAIClient->completions()->create([
            'model' => 'gpt-4',
            'prompt' => $prompt,
            'max_tokens' => 500,
        ]);

        return json_decode($response->choices[0]->text, true);
    }

    protected function buildAnalysisPrompt(array $visionAnalysis): string
    {
        return "Based on the following image analysis, provide insights about the renovation project:\n" .
               "Labels detected: " . implode(', ', $visionAnalysis['labels']) . "\n" .
               "Objects detected: " . implode(', ', $visionAnalysis['objects']) . "\n" .
               "Please provide:\n" .
               "1. Type of renovation needed\n" .
               "2. Estimated complexity\n" .
               "3. Potential challenges\n" .
               "4. Material suggestions\n" .
               "5. Estimated timeline";
    }

    protected function extractLabels($labelAnnotations): array
    {
        $labels = [];
        foreach ($labelAnnotations as $label) {
            $labels[] = [
                'description' => $label->getDescription(),
                'score' => $label->getScore(),
            ];
        }
        return $labels;
    }

    protected function extractObjects($objectAnnotations): array
    {
        $objects = [];
        foreach ($objectAnnotations as $object) {
            $objects[] = [
                'name' => $object->getName(),
                'confidence' => $object->getScore(),
                'bounds' => $this->getBoundingPoly($object->getBoundingPoly()),
            ];
        }
        return $objects;
    }

    protected function extractText($textAnnotations): array
    {
        $texts = [];
        foreach ($textAnnotations as $text) {
            $texts[] = [
                'text' => $text->getDescription(),
                'bounds' => $this->getBoundingPoly($text->getBoundingPoly()),
            ];
        }
        return $texts;
    }

    protected function extractSafeSearch($safeSearchAnnotation): array
    {
        return [
            'adult' => $safeSearchAnnotation->getAdult(),
            'violence' => $safeSearchAnnotation->getViolence(),
            'racy' => $safeSearchAnnotation->getRacy(),
        ];
    }

    protected function getBoundingPoly($boundingPoly): array
    {
        $vertices = [];
        foreach ($boundingPoly->getVertices() as $vertex) {
            $vertices[] = [
                'x' => $vertex->getX(),
                'y' => $vertex->getY(),
            ];
        }
        return $vertices;
    }

    protected function aggregateResults(array $results): array
    {
        // Implement result aggregation logic
        return [
            'overall_analysis' => $this->generateOverallAnalysis($results),
            'individual_results' => $results,
        ];
    }

    protected function generateOverallAnalysis(array $results): array
    {
        // Implement overall analysis generation
        return [];
    }
}
