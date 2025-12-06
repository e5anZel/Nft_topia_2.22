// Статистика и рейтинги



document.addEventListener('DOMContentLoaded', function() {

    loadTopNfts();

    loadTopAuthors();

    loadSalesHistory();

});



function loadTopNfts() {

    const container = document.getElementById('top-nfts');

    if (!container) return;

    

    const allNfts = getAllNfts();

    // Сортируем по цене (по убыванию)

    const sortedNfts = allNfts.sort((a, b) => b.price - a.price).slice(0, 10);

    

    container.innerHTML = sortedNfts.map((nft, index) => `

        <div class="flex items-center justify-between p-4 bg-[#242629] rounded-lg hover:bg-[#2a2b32] transition-all">

            <div class="flex items-center space-x-4">

                <div class="text-2xl font-bold text-[#7f5af0] w-8">${index + 1}</div>

                <img src="${nft.image}" alt="${nft.name}" class="w-16 h-16 rounded-lg object-cover">

                <div>

                    <h3 class="font-bold">${nft.name}</h3>

                    <p class="text-sm text-gray-400">${nft.creator.name}</p>

                </div>

            </div>

            <div class="text-right">

                <div class="text-lg font-bold text-[#2cb67d]">${nft.price} ETH</div>

                <div class="text-sm text-gray-400">${nft.views || 0} просмотров</div>

            </div>

        </div>

    `).join('');

}



function loadTopAuthors() {

    const container = document.getElementById('top-authors');

    if (!container) return;

    

    const allNfts = getAllNfts();

    const authorsMap = {};

    

    // Подсчитываем статистику по авторам

    allNfts.forEach(nft => {

        const creatorName = nft.creator.name;

        if (!authorsMap[creatorName]) {

            authorsMap[creatorName] = {

                name: creatorName,

                avatar: nft.creator.avatar,

                nftCount: 0,

                totalVolume: 0,

                followers: Math.floor(Math.random() * 5000) + 1000

            };

        }

        authorsMap[creatorName].nftCount++;

        authorsMap[creatorName].totalVolume += nft.price;

    });

    

    const topAuthors = Object.values(authorsMap)

        .sort((a, b) => b.totalVolume - a.totalVolume)

        .slice(0, 10);

    

    container.innerHTML = topAuthors.map((author, index) => `

        <div class="flex items-center justify-between p-4 bg-[#242629] rounded-lg hover:bg-[#2a2b32] transition-all">

            <div class="flex items-center space-x-4">

                <div class="text-2xl font-bold text-[#7f5af0] w-8">${index + 1}</div>

                <div class="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" 

                     style="background: ${generateColorFromString(author.name)};">

                    ${getInitials(author.name)}

                </div>

                <div>

                    <h3 class="font-bold">${author.name}</h3>

                    <p class="text-sm text-gray-400">${author.nftCount} NFT • ${author.followers} подписчиков</p>

                </div>

            </div>

            <div class="text-right">

                <div class="text-lg font-bold text-[#2cb67d]">${author.totalVolume.toFixed(2)} ETH</div>

                <div class="text-sm text-gray-400">Объем продаж</div>

            </div>

        </div>

    `).join('');

}



function loadSalesHistory() {

    const container = document.getElementById('sales-history');

    if (!container) return;

    

    const allNfts = getAllNfts();

    // Создаем историю продаж на основе данных NFT

    const salesHistory = allNfts

        .filter(nft => nft.history && nft.history.length > 0)

        .flatMap(nft => 

            nft.history.map(event => ({

                nft: nft,

                event: event

            }))

        )

        .sort((a, b) => new Date(b.event.date) - new Date(a.event.date))

        .slice(0, 20);

    

    if (salesHistory.length === 0) {

        container.innerHTML = '<p class="text-gray-400 text-center py-8">История продаж пока пуста</p>';

        return;

    }

    

    container.innerHTML = salesHistory.map(sale => `

        <div class="flex items-center justify-between p-4 bg-[#242629] rounded-lg hover:bg-[#2a2b32] transition-all">

            <div class="flex items-center space-x-4">

                <img src="${sale.nft.image}" alt="${sale.nft.name}" class="w-16 h-16 rounded-lg object-cover">

                <div>

                    <h3 class="font-bold">${sale.nft.name}</h3>

                    <p class="text-sm text-gray-400">${sale.event.type} • ${new Date(sale.event.date).toLocaleDateString('ru-RU')}</p>

                </div>

            </div>

            <div class="text-right">

                <div class="text-lg font-bold text-[#2cb67d]">${sale.event.price || sale.nft.price} ETH</div>

                <div class="text-sm text-gray-400">${sale.event.from} → ${sale.event.to}</div>

            </div>

        </div>

    `).join('');

}



