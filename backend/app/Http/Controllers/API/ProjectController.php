<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\AI\ChatbotService;
use App\Services\AI\ImageAnalysisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\ProjectCreateRequest;

class ProjectController extends Controller
{
    protected $chatbot;
    protected $imageAnalysis;

    public function __construct(ChatbotService $chatbot, ImageAnalysisService $imageAnalysis)
    {
        $this->chatbot = $chatbot;
        $this->imageAnalysis = $imageAnalysis;
    }

    public function index(Request $request)
    {
        $query = Project::query();

        if ($request->user()->role === 'client') {
            $query->where('client_id', $request->user()->id);
        } elseif ($request->user()->role === 'artisan') {
            $query->whereHas('quotes', function ($q) use ($request) {
                $q->where('artisan_id', $request->user()->artisanProfile->id);
            });
        }

        $projects = $query->with(['client', 'artisan', 'quotes', 'images'])
                         ->latest()
                         ->paginate(10);

        return ProjectResource::collection($projects);
    }

    public function store(ProjectCreateRequest $request)
    {
        $project = new Project($request->validated());
        $project->client_id = Auth::id();
        $project->status = 'pending';
        $project->save();

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('project-images', 'public');
                $project->images()->create([
                    'path' => $path
                ]);
            }

            // Analyze images with AI
            $analysis = $this->imageAnalysis->analyzeProjectImages($project->images);
            $project->update([
                'ai_analysis_result' => $analysis['overall_analysis'],
            ]);
        }

        // Get AI suggestions for materials
        $materialSuggestions = $this->chatbot->suggestMaterials($project);
        $project->update([
            'material_suggestions' => $materialSuggestions,
        ]);

        return new ProjectResource($project->load(['client', 'images']));
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);
        
        return new ProjectResource($project->load([
            'client',
            'artisan',
            'quotes.materials',
            'images',
            'messages.user'
        ]));
    }

    public function update(ProjectCreateRequest $request, Project $project)
    {
        $this->authorize('update', $project);
        
        $project->update($request->validated());

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('project-images', 'public');
                $project->images()->create([
                    'path' => $path
                ]);
            }

            // Re-analyze images with AI
            $analysis = $this->imageAnalysis->analyzeProjectImages($project->images);
            $project->update([
                'ai_analysis_result' => $analysis['overall_analysis'],
            ]);
        }

        return new ProjectResource($project->load(['client', 'artisan', 'quotes', 'images']));
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        // Delete associated images from storage
        foreach ($project->images as $image) {
            Storage::delete($image->path);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    public function getChatbotResponse(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $response = $this->chatbot->getResponse(
            $request->input('message'),
            [
                'project' => $project->toArray(),
                'user_role' => $request->user()->role,
            ]
        );

        return response()->json(['response' => $response]);
    }

    public function analyzeImages(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $analysis = $this->imageAnalysis->analyzeProjectImages($project->images);

        return response()->json($analysis);
    }

    public function getRecommendedArtisans(Project $project)
    {
        $this->authorize('view', $project);

        // Implement artisan recommendation logic based on project requirements
        $recommendedArtisans = $project->getRecommendedArtisans();

        return ArtisanResource::collection($recommendedArtisans);
    }
}
