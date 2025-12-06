// Централизованное хранилище данных NFT

const nftData = {

    'cosmic-journey-124': {

        id: 'cosmic-journey-124',

        name: 'Cosmic Journey',

        number: '#124',

        fullName: 'Cosmic Journey #124',

        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',

        price: 1.2,

        lastPrice: 0.8,

        currentBid: 0.8,

        creator: {

            name: '@digitalartist',

            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',

            fullName: 'Digital Artist'

        },

        owner: {

            name: '@collector1',

            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',

            fullName: 'NFT Collector'

        },

        category: 'Искусство',

        description: 'Уникальное цифровое произведение искусства, вдохновленное космическими путешествиями. Каждый пиксель рассказывает историю далеких галактик и бесконечных возможностей.',

        collection: 'Cosmic Collection',

        edition: '1 из 1',

        properties: [

            { trait: 'Цвет', value: 'Синий' },

            { trait: 'Стиль', value: 'Абстракция' },

            { trait: 'Эпоха', value: 'Современное' },

            { trait: 'Редкость', value: 'Уникальное' }

        ],

        history: [

            { event: 'Создано', date: '2023-01-15', price: null },

            { event: 'Продано', date: '2023-02-20', price: 0.8 },

            { event: 'Выставлено', date: '2023-03-10', price: 1.2 }

        ],

        likes: 124,

        views: 2340

    },

    'digital-dreams-42': {

        id: 'digital-dreams-42',

        name: 'Digital Dreams',

        number: '#42',

        fullName: 'Digital Dreams #42',

        image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',

        price: 2.4,

        lastPrice: 1.9,

        currentBid: 1.9,

        creator: {

            name: '@nftcreator',

            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',

            fullName: 'NFT Creator'

        },

        owner: {

            name: '@artlover',

            avatar: 'https://randomuser.me/api/portraits/women/23.jpg',

            fullName: 'Art Lover'

        },

        category: 'Фотография',

        description: 'Цифровые мечты, запечатленные в пикселях. Это произведение представляет собой синтез реальности и воображения, создавая уникальный визуальный опыт.',

        collection: 'Dreams Collection',

        edition: '1 из 10',

        properties: [

            { trait: 'Цвет', value: 'Фиолетовый' },

            { trait: 'Стиль', value: 'Сюрреализм' },

            { trait: 'Эпоха', value: 'Современное' },

            { trait: 'Редкость', value: 'Редкое' }

        ],

        history: [

            { event: 'Создано', date: '2023-02-01', price: null },

            { event: 'Продано', date: '2023-02-15', price: 1.9 },

            { event: 'Выставлено', date: '2023-03-05', price: 2.4 }

        ],

        likes: 89,

        views: 1890

    },

    'abstract-mind-78': {

        id: 'abstract-mind-78',

        name: 'Abstract Mind',

        number: '#78',

        fullName: 'Abstract Mind #78',

        image: 'https://images.unsplash.com/photo-1639762681481-24c2b4b7d42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',

        price: 0.75,

        lastPrice: 0.5,

        currentBid: 0.5,

        creator: {

            name: '@artcollector',

            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',

            fullName: 'Art Collector'

        },

        owner: {

            name: '@minimalist',

            avatar: 'https://randomuser.me/api/portraits/men/56.jpg',

            fullName: 'Minimalist'

        },

        category: 'Абстракция',

        description: 'Абстрактное мышление, выраженное через цифровое искусство. Каждая форма и цвет несут глубокий смысл и эмоциональную нагрузку.',

        collection: 'Abstract Collection',

        edition: '1 из 1',

        properties: [

            { trait: 'Цвет', value: 'Многоцветное' },

            { trait: 'Стиль', value: 'Абстракция' },

            { trait: 'Эпоха', value: 'Современное' },

            { trait: 'Редкость', value: 'Уникальное' }

        ],

        history: [

            { event: 'Создано', date: '2023-01-20', price: null },

            { event: 'Продано', date: '2023-02-10', price: 0.5 },

            { event: 'Выставлено', date: '2023-03-01', price: 0.75 }

        ],

        likes: 156,

        views: 3120

    },

    'pixel-universe-15': {

        id: 'pixel-universe-15',

        name: 'Pixel Universe',

        number: '#15',

        fullName: 'Pixel Universe #15',

        image: 'https://images.unsplash.com/photo-1639762681558-3f073a7b3f0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',

        price: 3.1,

        lastPrice: 2.8,

        currentBid: 2.8,

        creator: {

            name: '@pixelmaster',

            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',

            fullName: 'Pixel Master'

        },

        owner: {

            name: '@gamer',

            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',

            fullName: 'Gamer'

        },

        category: 'Пиксель-арт',

        description: 'Вселенная, созданная из пикселей. Ностальгическое путешествие в мир ретро-графики с современным подходом к цифровому искусству.',

        collection: 'Pixel Collection',

        edition: '1 из 50',

        properties: [

            { trait: 'Цвет', value: 'Неоновое' },

            { trait: 'Стиль', value: 'Пиксель-арт' },

            { trait: 'Эпоха', value: 'Ретро' },

            { trait: 'Редкость', value: 'Обычное' }

        ],

        history: [

            { event: 'Создано', date: '2023-02-10', price: null },

            { event: 'Продано', date: '2023-02-25', price: 2.8 },

            { event: 'Выставлено', date: '2023-03-12', price: 3.1 }

        ],

        likes: 203,

        views: 4560

    },

    'ocean-waves-32': {

        id: 'ocean-waves-32',

        name: 'Ocean Waves',

        number: '#32',

        fullName: 'Ocean Waves #32',

        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',

        price: 0.45,

        lastPrice: 0.3,

        currentBid: 0.3,

        creator: {

            name: '@naturelover',

            avatar: 'https://randomuser.me/api/portraits/women/23.jpg',

            fullName: 'Nature Lover'

        },

        owner: {

            name: '@oceanfan',

            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',

            fullName: 'Ocean Fan'

        },

        category: 'Природа',

        description: 'Умиротворяющие волны океана, запечатленные в цифровом формате. Это произведение передает спокойствие и мощь природы.',

        collection: 'Nature Collection',

        edition: '1 из 1',

        properties: [

            { trait: 'Цвет', value: 'Синий' },

            { trait: 'Стиль', value: 'Реализм' },

            { trait: 'Эпоха', value: 'Современное' },

            { trait: 'Редкость', value: 'Уникальное' }

        ],

        history: [

            { event: 'Создано', date: '2023-01-25', price: null },

            { event: 'Продано', date: '2023-02-05', price: 0.3 },

            { event: 'Выставлено', date: '2023-02-28', price: 0.45 }

        ],

        likes: 67,

        views: 1230

    },

    'urban-life-19': {

        id: 'urban-life-19',

        name: 'Urban Life',

        number: '#19',

        fullName: 'Urban Life #19',

        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',

        price: 1.8,

        lastPrice: 1.2,

        currentBid: 1.2,

        creator: {

            name: '@cityexplorer',

            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',

            fullName: 'City Explorer'

        },

        owner: {

            name: '@urbanist',

            avatar: 'https://randomuser.me/api/portraits/men/68.jpg',

            fullName: 'Urbanist'

        },

        category: 'Городской пейзаж',

        description: 'Жизнь большого города, запечатленная в цифровом искусстве. Динамика и энергия мегаполиса в каждом кадре.',

        collection: 'Urban Collection',

        edition: '1 из 25',

        properties: [

            { trait: 'Цвет', value: 'Серый' },

            { trait: 'Стиль', value: 'Урбанизм' },

            { trait: 'Эпоха', value: 'Современное' },

            { trait: 'Редкость', value: 'Редкое' }

        ],

        history: [

            { event: 'Создано', date: '2023-02-15', price: null },

            { event: 'Продано', date: '2023-03-01', price: 1.2 },

            { event: 'Выставлено', date: '2023-03-15', price: 1.8 }

        ],

        likes: 98,

        views: 2100

    },

    'galaxy-explorer-7': {

        id: 'galaxy-explorer-7',

        name: 'Galaxy Explorer',

        number: '#7',

        fullName: 'Galaxy Explorer #7',

        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',

        price: 4.2,

        lastPrice: 3.5,

        currentBid: 3.5,

        creator: {

            name: '@spaceartist',

            avatar: 'https://randomuser.me/api/portraits/women/56.jpg',

            fullName: 'Space Artist'

        },

        owner: {

            name: '@astronomer',

            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',

            fullName: 'Astronomer'

        },

        category: 'Космос',

        description: 'Исследование галактик через призму цифрового искусства. Глубокий космос и бесконечность вселенной в одном произведении.',

        collection: 'Space Collection',

        edition: '1 из 1',

        properties: [

            { trait: 'Цвет', value: 'Темное' },

            { trait: 'Стиль', value: 'Космическое' },

            { trait: 'Эпоха', value: 'Современное' },

            { trait: 'Редкость', value: 'Уникальное' }

        ],

        history: [

            { event: 'Создано', date: '2023-01-10', price: null },

            { event: 'Продано', date: '2023-02-18', price: 3.5 },

            { event: 'Выставлено', date: '2023-03-08', price: 4.2 }

        ],

        likes: 312,

        views: 6780

    },

    'digital-identity-56': {

        id: 'digital-identity-56',

        name: 'Digital Identity',

        number: '#56',

        fullName: 'Digital Identity #56',

        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',

        price: 0.9,

        lastPrice: 0.7,

        currentBid: 0.7,

        creator: {

            name: '@portraitart',

            avatar: 'https://randomuser.me/api/portraits/women/32.jpg',

            fullName: 'Portrait Art'

        },

        owner: {

            name: '@identity',

            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',

            fullName: 'Identity'

        },

        category: 'Портрет',

        description: 'Цифровая идентичность в эпоху технологий. Размышление о том, как мы представляем себя в цифровом мире.',

        collection: 'Identity Collection',

        edition: '1 из 5',

        properties: [

            { trait: 'Цвет', value: 'Монохром' },

            { trait: 'Стиль', value: 'Портрет' },

            { trait: 'Эпоха', value: 'Современное' },

            { trait: 'Редкость', value: 'Редкое' }

        ],

        history: [

            { event: 'Создано', date: '2023-02-20', price: null },

            { event: 'Продано', date: '2023-03-05', price: 0.7 },

            { event: 'Выставлено', date: '2023-03-18', price: 0.9 }

        ],

        likes: 145,

        views: 2890

    }

};



// Функция для получения NFT по ID

function getNftById(id) {

    return nftData[id] || null;

}



// Функция для получения всех NFT

function getAllNfts() {

    return Object.values(nftData);

}



// Функция для получения NFT по категории

function getNftsByCategory(category) {

    return Object.values(nftData).filter(nft => nft.category === category);

}



