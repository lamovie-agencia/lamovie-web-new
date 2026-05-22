
/**
 * --------------------------------------------------------------------------
 * CENTRAL ASSET MANAGER
 * --------------------------------------------------------------------------
 * This file contains all the links to images, videos, and media used across the app.
 * To update an image, simply replace the URL string here.
 * 
 * BENEFIT: You don't have to hunt through components to change a photo.
 */

export const ASSETS = {
    // ======================================================================
    // 1. HERO SECTION (Main Banner)
    // ======================================================================
    hero: {
        // Background video loop - Drone CTG Footage
        backgroundVideo: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FiuBpWg2dsu19YxDo-DJI%2520CTG.mp4",
        // Floating "Viral" vertical video
        floatingReel: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FmPkITcRpSsHc9DWE-WhatsApp%2520Video%25202025-02-12%2520at%252013.25.43.mp4",
        // Floating right image
        floatingImage: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FzpX6RGPZgMm6FjEx-_DSC0650.jpg"
    },

    // ======================================================================
    // 2. ABOUT SECTION
    // ======================================================================
    about: {
        teamImage: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FOAaBtgQ6K3IAlCRg-_DSC0367.jpg",
        fallbackTeamImage: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=1000&auto=format&fit=crop"
    },

    // ======================================================================
    // 2.1 EVENTS SECTION (New)
    // ======================================================================
    events: {
        heroVideo: "https://videos.pexels.com/video-files/855428/855428-hd_1920_1080_30fps.mp4", // Concert/Event Crowd
        weddingImage: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2Fdlw7y5dCLTkVEIsx-_DSC0528.jpg",
        corporateImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop",
        droneVideo: "https://videos.pexels.com/video-files/2928256/2928256-uhd_3840_2160_24fps.mp4", // Drone shot
        streamingImage: "https://images.unsplash.com/photo-1588152850766-932f94b8e309?q=80&w=1000&auto=format&fit=crop", // Broadcast setup
    },

    // ======================================================================
    // 3. PORTFOLIO SECTION (Work & Reels)
    // ======================================================================
    portfolio: {
        works: [
            {
                id: 1,
                category: "Fotografía",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FzpX6RGPZgMm6FjEx-_DSC0650.jpg",
                title: "Retrato Lifestyle",
                client: "Personal Brand",
                desc: "Sesión de marca personal con iluminación natural."
            },
            {
                id: 2,
                category: "Fotografía",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FAO8by9Xva3tGYX6U-_DSC0930-Enhanced-NR.jpg",
                title: "Evento Corporativo",
                client: "Corporate",
                desc: "Cobertura de evento de alto nivel en Cartagena."
            },
            {
                id: 3,
                category: "Fotografía",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2Fdlw7y5dCLTkVEIsx-_DSC0528.jpg",
                title: "Momentos Reales",
                client: "Social Event",
                desc: "Captura documental de momentos espontáneos."
            },
            {
                id: 4,
                category: "Branding",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2Fcq6lKugYZqyKpBtl-INTENSIVO%2520SLIDE%2520%2520vr2.png",
                title: "Diseño Publicitario",
                client: "Intensivo",
                desc: "Diseño gráfico para campaña de lanzamiento."
            },
            {
                id: 5,
                category: "Fotografía",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2F6nzMJZfpBJ1xCQxd-COCTEL%25201.png",
                title: "Fotografía Producto",
                client: "Bar & Mixology",
                desc: "Fotografía gastronómica de coctelería premium."
            },
            {
                id: 6,
                category: "Fotografía",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FXn8iYhrwsrvfFBaK-_DSC0521.jpg",
                title: "Social Experience",
                client: "Event",
                desc: "Experiencias sociales y networking."
            },
            {
                id: 7,
                category: "Branding",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FjBj4NXU7YZv69tHy-Sin%2520t%25C3%25ADtulo-1.png",
                title: "Identidad Visual",
                client: "Studio",
                desc: "Desarrollo de línea gráfica minimalista."
            },
            {
                id: 8,
                category: "Fotografía",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FkbYos2f2RMFukqBC-20-DSC09088.png",
                title: "Producto Detalle",
                client: "Commercial",
                desc: "Fotografía macro de producto."
            }
        ],
        reels: [
            {
                id: 101,
                title: "Promo Olivos",
                views: "18.5K",
                likes: "1.2K",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FOAaBtgQ6K3IAlCRg-_DSC0367.jpg",
                video: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FZ3X3c2rE7WDg01M3-VID%2520PROMO%2520OLIVOS.mp4"
            },
            {
                id: 102,
                title: "Drone CTG Experience",
                views: "45K",
                likes: "3.5K",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FzpX6RGPZgMm6FjEx-_DSC0650.jpg",
                video: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FiuBpWg2dsu19YxDo-DJI%2520CTG.mp4"
            },
            {
                id: 103,
                title: "Pulpa Crisam",
                views: "12K",
                likes: "890",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2F6nzMJZfpBJ1xCQxd-COCTEL%25201.png",
                video: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FU9CDqhs7kWCI1bkV-PULPA%2520CRISAM.mp4"
            },
            {
                id: 104,
                title: "Tramitar Visa Story",
                views: "9.2K",
                likes: "450",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FjBj4NXU7YZv69tHy-Sin%2520t%25C3%25ADtulo-1.png",
                video: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FhnFSdxpdYc89OqGZ-TRAMITAR%2520VISA.mp4"
            },
            {
                id: 105,
                title: "Los Lagos Real Estate",
                views: "22K",
                likes: "1.5K",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FAO8by9Xva3tGYX6U-_DSC0930-Enhanced-NR.jpg",
                video: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FbCDo7mycPD2UQFjA-30%2520M%2520LOS%2520LAGOS.mp4"
            },
            {
                id: 106,
                title: "Lifestyle 0925",
                views: "15K",
                likes: "980",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FXn8iYhrwsrvfFBaK-_DSC0521.jpg",
                video: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FCN5eqd3Qszrbb9iQ-0925.mp4"
            },
            {
                id: 107,
                title: "Viral Reel",
                views: "100K+",
                likes: "5K",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FK08Kgjsq728rvyhQ-315290587_927393354899733_8558055110712543238_n.jpg",
                video: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FR28URsTddhgWgLmk-SaveInsta.App%2520-%25202982183741343690570.mp4"
            },
            {
                id: 108,
                title: "SaberEs Edu",
                views: "8.5K",
                likes: "320",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2Fdlw7y5dCLTkVEIsx-_DSC0528.jpg",
                video: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FFD6khbrlEPMQ3T67-saberEs%2520Cristian%2520Bueno.mov"
            },
            {
                id: 109,
                title: "Eventos Sociales",
                views: "10.2K",
                likes: "500",
                img: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2F6nzMJZfpBJ1xCQxd-COCTEL%25201.png",
                video: "https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FG2XSIMDxK5Ps9JfE-WhatsApp%2520Video%25202024-01-11%2520at%25203.48.21%2520PM.mp4"
            }
        ]
    },

    // ======================================================================
    // 4. WEB SHOWCASE (Interactive Demos)
    // ======================================================================
    // INSTRUCCIONES PARA EL USUARIO:
    // 1. Toma una captura de pantalla COMPLETA (Full Page Screenshot) de tu sitio web en Desktop.
    // 2. Toma otra captura en versión Móvil.
    // 3. Sube esas imágenes a tu proyecto o usa URLs externas.
    // 4. Reemplaza los enlaces abajo.
    webProjects: [
        {
            id: 1,
            title: "Luxe Sneakers Store",
            category: "E-Commerce",
            url: "www.luxesneakers.co",
            description: "Tienda online de alto rendimiento con pasarela de pagos, inventario en tiempo real y carga en 0.8s.",
            // CAMBIA ESTAS URLs POR TUS PROPIAS CAPTURAS DE PANTALLA
            desktopImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop", // Full page screenshot desktop
            mobileImg: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1000&auto=format&fit=crop",   // Full page screenshot mobile
            color: "bg-purple-600"
        },
        {
            id: 2,
            title: "Alma Restaurante",
            category: "Reservas & Menú",
            url: "www.almarestaurante.com",
            description: "Sistema de reservas automatizado, menú QR interactivo y galería gastronómica inmersiva.",
            // CAMBIA ESTAS URLs POR TUS PROPIAS CAPTURAS DE PANTALLA
            desktopImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
            mobileImg: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=1000&auto=format&fit=crop",
            color: "bg-orange-500"
        },
        {
            id: 3,
            title: "Constructora Elite",
            category: "Corporativo",
            url: "www.eliteconstructora.com",
            description: "Sitio corporativo para generación de leads, catálogo de proyectos inmobiliarios y chat IA integrado.",
            // CAMBIA ESTAS URLs POR TUS PROPIAS CAPTURAS DE PANTALLA
            desktopImg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
            mobileImg: "https://images.unsplash.com/photo-1481487484168-9b930d5b7d9d?q=80&w=1000&auto=format&fit=crop",
            color: "bg-blue-600"
        }
    ],

    // ======================================================================
    // 5. TESTIMONIALS & CLIENTS
    // ======================================================================
    testimonials: [
        {
            quote: "La estética que lograron para nuestra marca superó todas las expectativas. Los videos tienen una calidad de cine que nos diferencia totalmente de la competencia.",
            author: "Maria F.",
            role: "Gerente, Mar de Corales",
            image: "/assets/images/clients/client-1.jpg",
            fallback: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60"
        },
        {
            quote: "Entienden perfecto que no se trata solo de hacer videos bonitos, sino de vender. Desde que trabajamos con LA MOVIE, nuestras consultas aumentaron un 40%.",
            author: "Carlos R.",
            role: "CEO, Money Exchange",
            image: "/assets/images/clients/client-2.jpg",
            fallback: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60"
        },
        {
            quote: "Profesionalismo puro. La entrega fue puntual y el resultado final capturó exactamente la esencia que queríamos transmitir para el evento.",
            author: "Laura D.",
            role: "Event Planner, Cajasai",
            image: "/assets/images/clients/client-3.jpg",
            fallback: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60"
        }
    ]
};
