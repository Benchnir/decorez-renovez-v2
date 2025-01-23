<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'artisan_id',
        'amount',
        'description',
        'materials_cost',
        'labor_cost',
        'estimated_duration',
        'validity_period',
        'status',
        'ai_analysis_score',
        'ai_price_comparison',
    ];

    protected $casts = [
        'amount' => 'float',
        'materials_cost' => 'float',
        'labor_cost' => 'float',
        'estimated_duration' => 'integer',
        'validity_period' => 'datetime',
        'ai_analysis_score' => 'float',
        'ai_price_comparison' => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function artisan()
    {
        return $this->belongsTo(ArtisanProfile::class, 'artisan_id');
    }

    public function materials()
    {
        return $this->hasMany(QuoteMaterial::class);
    }
}
