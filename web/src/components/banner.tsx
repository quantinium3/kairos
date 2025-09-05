import { useState, useEffect } from 'react';
import { Button } from './ui/button';

const banners = [
    {
        imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/185660-NdXFgzcYmcDz.jpg",
        title: "DAN DA DAN Season 2",
        description: "An occult-obsessed boy and a spiritualist girl get caught up in an interdimensional battle between aliens and yokai.",
        altText: "DAN DA DAN Season 2",
        status: "releasing",
        episodes: 12,
        studio: "cloverworks",
        tags: ["comedy", 'sci-fi', "slice of life", "funny"]
    },
    {
        imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/154768-EuZd63IcqsVq.jpg",
        title: "My Dress-Up Darling Season 2",
        description: "Wakana Gojo, a Hina doll craftsman, befriends Marin Kitagawa, an outgoing gyaru who wants to get into cosplay.",
        altText: "My Dress-Up Darling Season 2",
        status: "releasing",
        episodes: 12,
        studio: "cloverworks",
        tags: ["comedy", 'sci-fi', "slice of life", "funny"]
    },
    {
        imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/189117-SEvEg0G0Rcv7.jpg",
        title: "Dr. STONE SCIENCE FUTURE Cour 2",
        description: "In a world petrified by a mysterious light, science prodigy Senku Ishigami awakens to rebuild human civilization.",
        altText: "Dr. STONE SCIENCE FUTURE Cour 2",
        status: "releasing",
        episodes: 12,
        studio: "cloverworks",
        tags: ["comedy", 'sci-fi', "slice of life", "funny"]
    }
];

const BannerCarousel = () => {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBannerIndex(prevIndex => (prevIndex + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full">
            {banners.map((banner, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentBannerIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                        }`}
                >
                    <div className="relative w-full h-full">
                        <img
                            src={banner.imageUrl}
                            alt={banner.altText}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10"></div>
                    </div>
                </div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-8">
                <div className="max-w-2xl text-white">
                    <div className="mb-2">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${banners[currentBannerIndex].status === 'releasing' ? 'bg-green-500 text-green-100' : 'bg-blue-500 text-blue-100'
                            }`}>
                            {banners[currentBannerIndex].status.toUpperCase()}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold mb-3 leading-tight">{banners[currentBannerIndex].title}</h1>
                    <p className="text-lg mb-4 leading-relaxed opacity-90">{banners[currentBannerIndex].description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {banners[currentBannerIndex].tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="bg-white/20 backdrop-blur-sm text-sm px-3 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-6 mb-6 text-sm opacity-80">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Episodes:</span>
                            <span>{banners[currentBannerIndex].episodes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Studio:</span>
                            <span className="capitalize">{banners[currentBannerIndex].studio}</span>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <Button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                            Watch Now
                        </Button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentBannerIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentBannerIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;
