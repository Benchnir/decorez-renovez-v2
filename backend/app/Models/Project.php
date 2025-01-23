<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'artisan_id',
        'title',
        'description',
        'budget',
        'status',
        'start_date',
        'end_date',
        'location',
        'ai_analysis_result',
        'estimated_duration',
        'material_suggestions',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'budget' => 'float',
        'ai_analysis_result' => 'array',
        'material_suggestions' => 'array',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function artisan()
    {
        return $this->belongsTo(ArtisanProfile::class, 'artisan_id');
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    public function images()
    {
        return $this->hasMany(ProjectImage::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'project_required_skills');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
