import { BaseSeeder } from '@adonisjs/lucid/seeders'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import Restaurant from '#models/restaurant'

const OWNERS = [
  { firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@resto.fr' },
  { firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@resto.fr' },
  { firstName: 'Pierre', lastName: 'Bernard', email: 'pierre.bernard@resto.fr' },
  { firstName: 'Sophie', lastName: 'Leclerc', email: 'sophie.leclerc@resto.fr' },
  { firstName: 'Luc', lastName: 'Moreau', email: 'luc.moreau@resto.fr' },
  { firstName: 'Claire', lastName: 'Simon', email: 'claire.simon@resto.fr' },
  { firstName: 'Antoine', lastName: 'Laurent', email: 'antoine.laurent@resto.fr' },
  { firstName: 'Isabelle', lastName: 'Lefebvre', email: 'isabelle.lefebvre@resto.fr' },
  { firstName: 'François', lastName: 'Michel', email: 'francois.michel@resto.fr' },
  { firstName: 'Nathalie', lastName: 'Garcia', email: 'nathalie.garcia@resto.fr' },
  { firstName: 'Thomas', lastName: 'David', email: 'thomas.david@resto.fr' },
  { firstName: 'Camille', lastName: 'Bertrand', email: 'camille.bertrand@resto.fr' },
  { firstName: 'Julien', lastName: 'Roux', email: 'julien.roux@resto.fr' },
  { firstName: 'Aurélie', lastName: 'Vincent', email: 'aurelie.vincent@resto.fr' },
  { firstName: 'Nicolas', lastName: 'Fournier', email: 'nicolas.fournier@resto.fr' },
  { firstName: 'Laure', lastName: 'Morel', email: 'laure.morel@resto.fr' },
  { firstName: 'Maxime', lastName: 'Girard', email: 'maxime.girard@resto.fr' },
  { firstName: 'Émilie', lastName: 'André', email: 'emilie.andre@resto.fr' },
  { firstName: 'Benoît', lastName: 'Mercier', email: 'benoit.mercier@resto.fr' },
  { firstName: 'Stéphanie', lastName: 'Blanc', email: 'stephanie.blanc@resto.fr' },
  { firstName: 'Arnaud', lastName: 'Guerin', email: 'arnaud.guerin@resto.fr' },
  { firstName: 'Valérie', lastName: 'Boyer', email: 'valerie.boyer@resto.fr' },
  { firstName: 'Christophe', lastName: 'Gauthier', email: 'christophe.gauthier@resto.fr' },
  { firstName: 'Sandrine', lastName: 'Robin', email: 'sandrine.robin@resto.fr' },
  { firstName: 'Guillaume', lastName: 'Clement', email: 'guillaume.clement@resto.fr' },
  { firstName: 'Céline', lastName: 'Morin', email: 'celine.morin@resto.fr' },
  { firstName: 'Sébastien', lastName: 'Nicolas', email: 'sebastien.nicolas@resto.fr' },
  { firstName: 'Amandine', lastName: 'Petit', email: 'amandine.petit@resto.fr' },
  { firstName: 'Romain', lastName: 'Durand', email: 'romain.durand@resto.fr' },
  { firstName: 'Delphine', lastName: 'Leroy', email: 'delphine.leroy@resto.fr' },
]

const RESTAURANTS: {
  name: string
  description: string
  phone: string
  email: string
  address: { street: string; city: string; postalCode: string; country: string }
  cuisineTypes: string[]
  priceRange: string
  features: string[]
}[] = [
  {
    name: 'Le Bistrot Parisien',
    description: 'Cuisine traditionnelle française dans un cadre chaleureux au cœur de Paris.',
    phone: '01 42 36 78 90',
    email: 'contact@bistrot-parisien.fr',
    address: { street: '12 Rue de Rivoli', city: 'Paris', postalCode: '75001', country: 'France' },
    cuisineTypes: ['FRENCH'],
    priceRange: 'MODERATE',
    features: ['TERRACE', 'WIFI'],
  },
  {
    name: 'La Trattoria di Roma',
    description: 'Authentique cuisine italienne, pâtes fraîches et pizzas au feu de bois.',
    phone: '04 78 52 14 63',
    email: 'contact@trattoria-roma.fr',
    address: { street: '8 Place Bellecour', city: 'Lyon', postalCode: '69002', country: 'France' },
    cuisineTypes: ['ITALIAN'],
    priceRange: 'MODERATE',
    features: ['VEGETARIAN_FRIENDLY', 'TERRACE'],
  },
  {
    name: 'Sakura Sushi',
    description: 'Sushis, sashimis et spécialités japonaises préparés par un chef tokyoïte.',
    phone: '04 91 33 22 11',
    email: 'contact@sakura-sushi.fr',
    address: {
      street: '22 Rue de la République',
      city: 'Marseille',
      postalCode: '13001',
      country: 'France',
    },
    cuisineTypes: ['JAPANESE'],
    priceRange: 'UPSCALE',
    features: ['GLUTEN_FREE', 'WIFI'],
  },
  {
    name: 'Le Bordeaux Gourmet',
    description: 'Restaurant gastronomique proposant des produits du terroir bordelais.',
    phone: '05 56 81 44 22',
    email: 'contact@bordeaux-gourmet.fr',
    address: {
      street: '3 Cours du Chapeau Rouge',
      city: 'Bordeaux',
      postalCode: '33000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'FINE_DINING',
    features: ['PARKING', 'WHEELCHAIR_ACCESSIBLE'],
  },
  {
    name: 'La Maison Toulousaine',
    description: 'Cassoulet et spécialités du Sud-Ouest dans une maison de caractère.',
    phone: '05 61 22 44 88',
    email: 'contact@maison-toulousaine.fr',
    address: {
      street: '15 Place du Capitole',
      city: 'Toulouse',
      postalCode: '31000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'MODERATE',
    features: ['TERRACE', 'PET_FRIENDLY'],
  },
  {
    name: 'Chez Nissa la Bella',
    description: 'Salade niçoise, socca et cuisine méditerranéenne face à la mer.',
    phone: '04 93 87 11 55',
    email: 'contact@nissa-bella.fr',
    address: {
      street: '7 Quai des États-Unis',
      city: 'Nice',
      postalCode: '06000',
      country: 'France',
    },
    cuisineTypes: ['MEDITERRANEAN', 'FRENCH'],
    priceRange: 'MODERATE',
    features: ['TERRACE', 'VEGETARIAN_FRIENDLY', 'GLUTEN_FREE'],
  },
  {
    name: 'La Brasserie Nantaise',
    description: 'Fruits de mer, galettes bretonnes et bières artisanales.',
    phone: '02 40 35 88 74',
    email: 'contact@brasserie-nantaise.fr',
    address: {
      street: '2 Place Graslin',
      city: 'Nantes',
      postalCode: '44000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'BUDGET',
    features: ['TERRACE', 'PET_FRIENDLY', 'WIFI'],
  },
  {
    name: 'Winstub Strasbourgeois',
    description: "Choucroute, baeckeoffe et vins d'Alsace dans un authentique winstub.",
    phone: '03 88 32 55 99',
    email: 'contact@winstub-strasbourg.fr',
    address: {
      street: '18 Rue du Vieux Marché aux Poissons',
      city: 'Strasbourg',
      postalCode: '67000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'MODERATE',
    features: ['WHEELCHAIR_ACCESSIBLE'],
  },
  {
    name: "Le Ch'ti Gourmand",
    description: 'Spécialités flamandes et moules-frites dans une ambiance conviviale.',
    phone: '03 20 57 33 21',
    email: 'contact@chti-gourmand.fr',
    address: {
      street: '5 Place du Général de Gaulle',
      city: 'Lille',
      postalCode: '59000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'BUDGET',
    features: ['TERRACE', 'PET_FRIENDLY'],
  },
  {
    name: 'Crêperie Bretonne',
    description: 'Crêpes et galettes artisanales, cidre fermier et ambiance bretonne.',
    phone: '02 99 79 55 40',
    email: 'contact@creperie-bretonne.fr',
    address: {
      street: '10 Rue Saint-Malo',
      city: 'Rennes',
      postalCode: '35000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'BUDGET',
    features: ['VEGETARIAN_FRIENDLY', 'WIFI'],
  },
  {
    name: 'Spice of India',
    description: 'Curry, tandoori et biryanis dans un décor bollywoodien coloré.',
    phone: '04 67 58 22 36',
    email: 'contact@spice-india.fr',
    address: {
      street: "33 Rue de l'Université",
      city: 'Montpellier',
      postalCode: '34000',
      country: 'France',
    },
    cuisineTypes: ['INDIAN'],
    priceRange: 'BUDGET',
    features: ['VEGAN_FRIENDLY', 'VEGETARIAN_FRIENDLY', 'HALAL'],
  },
  {
    name: 'La Table Dauphinoise',
    description: 'Gratin dauphinois, raclette et fondues dans les Alpes.',
    phone: '04 76 87 22 50',
    email: 'contact@table-dauphinoise.fr',
    address: {
      street: '6 Place Victor Hugo',
      city: 'Grenoble',
      postalCode: '38000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'MODERATE',
    features: ['PARKING', 'WHEELCHAIR_ACCESSIBLE'],
  },
  {
    name: "Dragon d'Or",
    description: 'Dim sum, canard laqué et spécialités de la cuisine cantonaise.',
    phone: '03 80 30 44 77',
    email: 'contact@dragon-or.fr',
    address: { street: '14 Rue Musette', city: 'Dijon', postalCode: '21000', country: 'France' },
    cuisineTypes: ['CHINESE'],
    priceRange: 'BUDGET',
    features: ['VEGETARIAN_FRIENDLY', 'WIFI'],
  },
  {
    name: 'Le Petit Savoyard',
    description: 'Fondue savoyarde, tartiflette et charcuteries de montagne.',
    phone: '04 50 45 55 30',
    email: 'contact@petit-savoyard.fr',
    address: {
      street: '9 Rue Sainte-Claire',
      city: 'Annecy',
      postalCode: '74000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'MODERATE',
    features: ['TERRACE', 'PARKING', 'PET_FRIENDLY'],
  },
  {
    name: 'La Belle Normande',
    description: 'Fruits de mer, camembert et cidre normand sur les bords de Seine.',
    phone: '02 35 71 16 14',
    email: 'contact@belle-normande.fr',
    address: {
      street: '25 Place du Vieux Marché',
      city: 'Rouen',
      postalCode: '76000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'MODERATE',
    features: ['TERRACE', 'WIFI'],
  },
  {
    name: 'El Rancho Mexicano',
    description: 'Tacos, guacamole et margaritas dans une ambiance festive.',
    phone: '04 72 40 88 19',
    email: 'contact@rancho-mexicano.fr',
    address: {
      street: '45 Rue de la Charité',
      city: 'Lyon',
      postalCode: '69002',
      country: 'France',
    },
    cuisineTypes: ['MEXICAN'],
    priceRange: 'BUDGET',
    features: ['VEGAN_FRIENDLY', 'VEGETARIAN_FRIENDLY', 'WIFI'],
  },
  {
    name: 'Thai Garden',
    description: 'Pad thaï, curry vert et soupes laksa dans un jardin tropical.',
    phone: '01 43 27 55 60',
    email: 'contact@thai-garden.fr',
    address: {
      street: '58 Boulevard Saint-Germain',
      city: 'Paris',
      postalCode: '75005',
      country: 'France',
    },
    cuisineTypes: ['THAI'],
    priceRange: 'MODERATE',
    features: ['VEGAN_FRIENDLY', 'GLUTEN_FREE'],
  },
  {
    name: "L'Américain",
    description: 'Burgers artisanaux, spare ribs et cheesecakes new-yorkais.',
    phone: '05 56 44 77 11',
    email: 'contact@lamericain.fr',
    address: {
      street: '11 Rue Sainte-Catherine',
      city: 'Bordeaux',
      postalCode: '33000',
      country: 'France',
    },
    cuisineTypes: ['AMERICAN'],
    priceRange: 'BUDGET',
    features: ['TERRACE', 'WIFI', 'PET_FRIENDLY'],
  },
  {
    name: 'La Pergola Méditerranéenne',
    description: 'Tapas, mezze et grillades au bord de la Méditerranée.',
    phone: '04 91 55 77 22',
    email: 'contact@pergola-med.fr',
    address: {
      street: '40 Corniche Kennedy',
      city: 'Marseille',
      postalCode: '13007',
      country: 'France',
    },
    cuisineTypes: ['MEDITERRANEAN'],
    priceRange: 'MODERATE',
    features: ['TERRACE', 'VEGETARIAN_FRIENDLY', 'VEGAN_FRIENDLY', 'WHEELCHAIR_ACCESSIBLE'],
  },
  {
    name: 'Le Grand Véfour',
    description: 'Haute gastronomie française dans un écrin du XVIIIe siècle.',
    phone: '01 42 96 56 27',
    email: 'contact@grand-vefour.fr',
    address: {
      street: '17 Rue de Beaujolais',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'FINE_DINING',
    features: ['WHEELCHAIR_ACCESSIBLE', 'PARKING'],
  },
  {
    name: 'Osaka Ramen',
    description: 'Ramen, gyoza et yakitori façon izakaya japonaise.',
    phone: '04 93 16 77 88',
    email: 'contact@osaka-ramen.fr',
    address: {
      street: '19 Rue de France',
      city: 'Nice',
      postalCode: '06000',
      country: 'France',
    },
    cuisineTypes: ['JAPANESE'],
    priceRange: 'BUDGET',
    features: ['VEGAN_FRIENDLY', 'WIFI'],
  },
  {
    name: 'La Cantine Verte',
    description: 'Restaurant 100 % végétalien et bio, cuisine créative et savoureuse.',
    phone: '02 40 48 99 33',
    email: 'contact@cantine-verte.fr',
    address: {
      street: '7 Rue Kervégan',
      city: 'Nantes',
      postalCode: '44000',
      country: 'France',
    },
    cuisineTypes: ['OTHER'],
    priceRange: 'MODERATE',
    features: ['VEGAN_FRIENDLY', 'VEGETARIAN_FRIENDLY', 'GLUTEN_FREE', 'WIFI'],
  },
  {
    name: 'Bombay Palace',
    description: "Cuisine du nord de l'Inde, spécialités halal et menu végétarien complet.",
    phone: '03 88 75 44 20',
    email: 'contact@bombay-palace.fr',
    address: {
      street: '55 Rue du Faubourg National',
      city: 'Strasbourg',
      postalCode: '67000',
      country: 'France',
    },
    cuisineTypes: ['INDIAN'],
    priceRange: 'MODERATE',
    features: ['HALAL', 'VEGETARIAN_FRIENDLY', 'VEGAN_FRIENDLY'],
  },
  {
    name: 'Le Moulin de la Galette',
    description: 'Cuisine bistronomique avec vue sur la butte Montmartre.',
    phone: '01 46 06 84 77',
    email: 'contact@moulin-galette.fr',
    address: {
      street: '83 Rue Lepic',
      city: 'Paris',
      postalCode: '75018',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'UPSCALE',
    features: ['TERRACE', 'PARKING', 'WIFI'],
  },
  {
    name: 'Fajitas & Co',
    description: 'Spécialités tex-mex conviviales, cocktails et ambiance festive.',
    phone: '04 67 92 11 44',
    email: 'contact@fajitas-co.fr',
    address: {
      street: '28 Place de la Comédie',
      city: 'Montpellier',
      postalCode: '34000',
      country: 'France',
    },
    cuisineTypes: ['MEXICAN', 'AMERICAN'],
    priceRange: 'BUDGET',
    features: ['TERRACE', 'WIFI', 'PET_FRIENDLY'],
  },
  {
    name: "L'Escargot Dijonnais",
    description: 'Escargots de Bourgogne, bœuf bourguignon et vins de la région.',
    phone: '03 80 41 88 55',
    email: 'contact@escargot-dijonnais.fr',
    address: {
      street: '3 Place de la Libération',
      city: 'Dijon',
      postalCode: '21000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'UPSCALE',
    features: ['PARKING', 'WHEELCHAIR_ACCESSIBLE'],
  },
  {
    name: "Le Comptoir de l'Isère",
    description: 'Produits locaux et cuisine de saison dans un cadre montagnard.',
    phone: '04 76 63 44 10',
    email: 'contact@comptoir-isere.fr',
    address: {
      street: '31 Allée Stéphane Jay',
      city: 'Grenoble',
      postalCode: '38000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'MODERATE',
    features: ['VEGAN_FRIENDLY', 'GLUTEN_FREE', 'WIFI'],
  },
  {
    name: 'Seoul Street Food',
    description: 'Bibimbap, tteokbokki et fried chicken coréen dans un cadre street food.',
    phone: '01 48 87 55 30',
    email: 'contact@seoul-street.fr',
    address: {
      street: '14 Rue au Maire',
      city: 'Paris',
      postalCode: '75003',
      country: 'France',
    },
    cuisineTypes: ['OTHER'],
    priceRange: 'BUDGET',
    features: ['VEGETARIAN_FRIENDLY', 'WIFI'],
  },
  {
    name: 'La Côte de Bœuf',
    description: 'Grillades au feu de bois, viandes maturées et cave à vins.',
    phone: '05 61 99 00 22',
    email: 'contact@cote-boeuf.fr',
    address: {
      street: '6 Rue des Couteliers',
      city: 'Toulouse',
      postalCode: '31000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH', 'AMERICAN'],
    priceRange: 'UPSCALE',
    features: ['PARKING', 'TERRACE'],
  },
  {
    name: 'La Bonne Franquette',
    description: 'Cuisine familiale du terroir, menu du jour généreux et accueil chaleureux.',
    phone: '02 31 86 77 44',
    email: 'contact@bonne-franquette.fr',
    address: {
      street: '12 Rue Saint-Pierre',
      city: 'Caen',
      postalCode: '14000',
      country: 'France',
    },
    cuisineTypes: ['FRENCH'],
    priceRange: 'BUDGET',
    features: ['WHEELCHAIR_ACCESSIBLE', 'PET_FRIENDLY', 'WIFI'],
  },
]

export default class RestaurantSeeder extends BaseSeeder {
  async run() {
    const hashedPassword = await hash.use('scrypt').make('password123')

    console.log('Création des utilisateurs restaurateurs...')

    for (const [i, owner] of OWNERS.entries()) {
      const restaurantData = RESTAURANTS[i]

      const user = await User.updateOrCreate(
        { email: owner.email },
        {
          email: owner.email,
          password: hashedPassword,
          firstName: owner.firstName,
          lastName: owner.lastName,
          phone: null,
          role: 'RESTAURANT_OWNER',
        }
      )

      const existing = await Restaurant.query().where('owner_id', user.id).first()
      if (existing) {
        console.log(`↩ Restaurant "${restaurantData.name}" déjà existant, ignoré.`)
        continue
      }

      await Restaurant.create({
        name: restaurantData.name,
        description: restaurantData.description,
        phone: restaurantData.phone,
        email: restaurantData.email,
        address: restaurantData.address,
        cuisineTypes: restaurantData.cuisineTypes as any,
        priceRange: restaurantData.priceRange as any,
        features: restaurantData.features as any,
        ownerId: user.id,
      })

      console.log(
        `  ✓ ${owner.firstName} ${owner.lastName} → "${restaurantData.name}" (${restaurantData.address.city})`
      )
    }

    console.log(`\nSeeder terminé : ${OWNERS.length} utilisateurs et restaurants créés.`)
    console.log('Mot de passe de tous les comptes : password123')
  }
}
