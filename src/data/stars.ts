export interface Project {
  name: string
  role: string
  genre: string
  coStars: string[]
  imdbRating: number
  streamingOn?: string
  year: number
}

export interface Star {
  id: number
  name: string
  type: 'actor' | 'actress'
  image: string
  currentProject?: string
  genre: string
  biography: {
    birthDate: string
    birthPlace: string
    education?: string
    careerStart: number
    achievements: string[]
  }
  filmography: Project[]
  socialMedia: {
    instagram?: string
    twitter?: string
    facebook?: string
  }
}

export const stars: { [key: string]: Star } = {
  "1": {
    id: 1,
    name: 'Burak Özçivit',
    type: 'actor',
    image: '/img/actor/burak-ozcivit.jpg',
    currentProject: 'Kuruluş Osman',
    genre: 'Historical',
    biography: {
      birthDate: '1984-12-24',
      birthPlace: 'Istanbul, Turkey',
      education: 'Marmara University, Fine Arts Faculty',
      careerStart: 2006,
      achievements: [
        'Best Actor Award - Turkey Youth Awards 2019',
        'Golden Butterfly Award for Best Actor 2019',
        'GQ Men of the Year Award'
      ]
    },
    filmography: [
      {
        name: 'Kuruluş Osman',
        role: 'Osman Bey',
        genre: 'Historical Drama',
        coStars: ['Özge Törer', 'Yıldız Çağrı Atiksoy'],
        imdbRating: 7.8,
        streamingOn: 'ATV',
        year: 2019
      },
      {
        name: 'Diriliş: Ertuğrul',
        role: 'Osman Bey',
        genre: 'Historical Drama',
        coStars: ['Engin Altan Düzyatan'],
        imdbRating: 7.9,
        year: 2018
      }
    ],
    socialMedia: {
      instagram: '@burakozcivit',
      twitter: '@burakozcivit',
      facebook: '/burakozcivit'
    }
  },
  "2": {
    id: 2,
    name: 'Can Yaman',
    type: 'actor',
    image: '/img/actor/can-yaman.jpg',
    currentProject: 'El Turco',
    genre: 'Action',
    biography: {
      birthDate: '1989-11-08',
      birthPlace: 'Istanbul, Turkey',
      education: 'Yeditepe University, Law Faculty',
      careerStart: 2014,
      achievements: [
        'Best Actor Award - Murex d\'Or 2019',
        'Rising Star Award - Venice Film Festival 2019'
      ]
    },
    filmography: [
      {
        name: 'El Turco',
        role: 'Balaban Ağa',
        genre: 'Historical Action',
        coStars: ['Greta Ferro'],
        imdbRating: 7.5,
        streamingOn: 'Disney+',
        year: 2024
      },
      {
        name: 'Bay Yanlış',
        role: 'Özgür Atasoy',
        genre: 'Romantic Comedy',
        coStars: ['Özge Gürel'],
        imdbRating: 7.3,
        year: 2020
      }
    ],
    socialMedia: {
      instagram: '@canyaman',
      twitter: '@canyaman'
    }
  },
  "6": {
    id: 6,
    name: 'Fahriye Evcen',
    type: 'actress',
    image: '/img/actress/fahriye-evcen.jpg',
    genre: 'Drama',
    biography: {
      birthDate: '1986-06-04',
      birthPlace: 'Solingen, Germany',
      education: 'Boğaziçi University, History',
      careerStart: 2005,
      achievements: [
        'Best Actress Award - Turkey Youth Awards 2018',
        'Golden Butterfly Award for Best Actress 2017'
      ]
    },
    filmography: [
      {
        name: 'Alparslan: Büyük Selçuklu',
        role: 'Akça Hatun',
        genre: 'Historical Drama',
        coStars: ['Barış Arduç'],
        imdbRating: 7.6,
        streamingOn: 'TRT 1',
        year: 2021
      }
    ],
    socialMedia: {
      instagram: '@evcenf',
      twitter: '@evcenf'
    }
  }
} 