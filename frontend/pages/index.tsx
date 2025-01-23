import React from 'react';
import { Button, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-20">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" className="text-4xl md:text-6xl font-bold mb-4">
                Décorez & Rénovez
              </Typography>
              <Typography variant="h2" className="text-xl md:text-2xl mb-8">
                Trouvez les meilleurs artisans pour vos projets de rénovation et décoration
              </Typography>
              <Link href="/projects/create" passHref>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                >
                  Démarrer un projet
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} md={6}>
              <img
                src="/images/hero-image.jpg"
                alt="Rénovation"
                className="rounded-lg shadow-xl"
              />
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* Services Section */}
      <Container maxWidth="lg" className="py-16">
        <Typography variant="h3" className="text-3xl font-bold text-center mb-12">
          Nos Services
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: 'Rénovation',
              description: 'Transformez votre espace avec nos artisans qualifiés',
              icon: '🏠'
            },
            {
              title: 'Décoration',
              description: 'Donnez vie à vos idées avec nos décorateurs experts',
              icon: '🎨'
            },
            {
              title: 'Construction',
              description: 'Construisez votre projet avec des professionnels',
              icon: '🏗️'
            }
          ].map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <Typography variant="h5" className="mb-2">
                    {service.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <div className="bg-gray-100 py-16">
        <Container maxWidth="lg">
          <Typography variant="h3" className="text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                step: '1',
                title: 'Décrivez votre projet',
                description: 'Partagez vos idées et vos besoins'
              },
              {
                step: '2',
                title: 'Trouvez un artisan',
                description: 'Comparez les profils et les avis'
              },
              {
                step: '3',
                title: 'Réalisez vos travaux',
                description: 'Suivez l\'avancement de votre projet'
              }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <Typography variant="h5" className="mb-2">
                    {step.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {step.description}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <Container maxWidth="lg">
          <div className="text-center">
            <Typography variant="h3" className="text-3xl font-bold mb-4">
              Prêt à transformer votre espace ?
            </Typography>
            <Typography variant="h6" className="mb-8">
              Rejoignez des milliers de clients satisfaits
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              Commencer maintenant
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Home;
