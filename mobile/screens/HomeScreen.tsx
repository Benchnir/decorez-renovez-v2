import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  Button,
  Card,
  Title,
  Paragraph,
  useTheme,
  Avatar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const features = [
    {
      title: 'Créer un projet',
      description: 'Décrivez votre projet et recevez des devis personnalisés',
      icon: 'plus-circle',
      action: () => navigation.navigate('CreateProject'),
    },
    {
      title: 'Mes projets',
      description: 'Suivez l'avancement de vos projets en cours',
      icon: 'folder',
      action: () => navigation.navigate('Projects'),
    },
    {
      title: 'Assistant IA',
      description: 'Obtenez des conseils personnalisés pour vos travaux',
      icon: 'robot',
      action: () => navigation.navigate('Chat'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={[styles.header, { width }]}
      >
        <Title style={styles.headerTitle}>Bienvenue sur Décorez-Rénovez</Title>
        <Paragraph style={styles.headerSubtitle}>
          Trouvez l'artisan parfait pour votre projet
        </Paragraph>
      </LinearGradient>

      <View style={styles.content}>
        {features.map((feature, index) => (
          <Card
            key={index}
            style={styles.card}
            onPress={feature.action}
          >
            <Card.Content style={styles.cardContent}>
              <Avatar.Icon
                size={48}
                icon={feature.icon}
                style={{ backgroundColor: theme.colors.primary }}
              />
              <Title style={styles.cardTitle}>{feature.title}</Title>
              <Paragraph style={styles.cardDescription}>
                {feature.description}
              </Paragraph>
            </Card.Content>
          </Card>
        ))}

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('CreateProject')}
        >
          Démarrer un nouveau projet
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  cardTitle: {
    marginTop: 16,
    fontSize: 18,
  },
  cardDescription: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default HomeScreen;
