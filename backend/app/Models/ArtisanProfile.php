<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtisanProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'siret',
        'description',
        'experience_years',
        'hourly_rate',
        'insurance_number',
        'insurance_company',
        'subscription_status',
        'subscription_expires_at',
        'rating_average',
        'completed_projects_count',
    ];

    protected $casts = [
        'subscription_expires_at' => 'datetime',
        'rating_average' => 'float',
        'completed_projects_count' => 'integer',
        'experience_years' => 'integer',
        'hourly_rate' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'artisan_skills');
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'artisan_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'artisan_id');
    }

    public function portfolio()
    {
        return $this->hasMany(PortfolioItem::class);
    }
}
