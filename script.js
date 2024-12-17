function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  }

//DARK MODE

function applyTheme(theme) {
    const themeStylesheet = document.getElementById('themeStylesheet');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const logoDark = document.getElementById('logoDark');

    if (theme === 'dark') {
        themeStylesheet.setAttribute('href', 'styleDark.css');
        themeToggleBtn.classList.add('dark');
        if (window.location.pathname.split("/").pop() === 'index.html'){
            logoDark.setAttribute('src', 'assets/logoDark.png');
        }
        if (window.location.pathname.split("/").pop() === 'projects.html'){
            logoDark.setAttribute('src', 'assets/logoDark.png');
        }
        if (window.location.pathname.split("/").pop() === 'contact.html'){
            logoDark.setAttribute('src', 'assets/logoDark.png');
        }
        if (window.location.pathname.split("/").pop() === 'arduino.html'){
            logoDark.setAttribute('src', 'assets/logoDark.png');
        }
        if (window.location.pathname.split("/").pop() === 'projects.html'){
            document.getElementById('projectLogoDark').setAttribute('src', 'assets/logoDark.png');
        }
        if (window.location.pathname.split("/").pop() === 'arduino.html'){
            document.getElementById('closeArduino').setAttribute('src', 'assets/close-circle-dark.svg');
        }
        if (window.location.pathname.split("/").pop() === 'index.html'){
            document.getElementById('linkedin').setAttribute('src', 'assets/whiteLinkedin.png');
            document.getElementById('github').setAttribute('src', 'assets/whiteGithub.png');
        }

    } else {
        themeStylesheet.setAttribute('href', 'style.css');
        themeToggleBtn.classList.remove('dark');
        if (window.location.pathname.split("/").pop() === 'index.html'){
            logoDark.setAttribute('src', 'assets/logo.png');
        }
        if (window.location.pathname.split("/").pop() === 'projects.html'){
            logoDark.setAttribute('src', 'assets/logo.png');
        }
        if (window.location.pathname.split("/").pop() === 'contact.html'){
            logoDark.setAttribute('src', 'assets/logo.png');
        }
        if (window.location.pathname.split("/").pop() === 'arduino.html'){
            logoDark.setAttribute('src', 'assets/logo.png');
        }
        if (window.location.pathname.split("/").pop() === 'projects.html'){
            document.getElementById('projectLogoDark').setAttribute('src', 'assets/logo.png');
        }
        if (window.location.pathname.split("/").pop() === 'arduino.html'){
            document.getElementById('closeArduino').setAttribute('src', 'assets/close-circle.svg');
        }
        if (window.location.pathname.split("/").pop() === 'index.html'){
            document.getElementById('linkedin').setAttribute('src', 'assets/linkedin.png');
            document.getElementById('github').setAttribute('src', 'assets/github.png');
        }

    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
}

document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);


// Arudino Expand

function expandItem(item, title, description, imageSrc, videoSrc) {
    let expandedItem = document.getElementById('expanded-item');
    let expandedImageContainer = expandedItem.querySelector('.expanded-image');
    let expandedImage = expandedItem.querySelector('.expanded-image img');
    let expandedTitle = expandedItem.querySelector('.expanded-description h3');
    let expandedDescription = expandedItem.querySelector('.expanded-description p');
    let expandedVideoContainer = expandedItem.querySelector('.expanded-video');
    let expandedVideo = expandedItem.querySelector('.expanded-video iframe');

    expandedImage.src = imageSrc;
    expandedImage.alt = title;
    expandedTitle.textContent = title;
    expandedDescription.textContent = description;
    expandedVideo.src = videoSrc;

    if (videoSrc == '') {
        expandedVideoContainer.style.display = 'none';
        expandedVideo.src = '';
    } else {
        expandedVideoContainer.style.display = 'block';
        expandedVideo.src = videoSrc;
    }

    if (imageSrc == '') {
        expandedImageContainer.style.display = 'none';
        expandedImage.src = '';
    } else {
        expandedImageContainer.style.display = 'block';
        expandedImage.src = imageSrc;
    }

    expandedItem.classList.add('active');
}

    function collapseItem() {
        let expandedItem = document.getElementById('expanded-item');
        let expandedVideo = expandedItem.querySelector('.expanded-video iframe');

        expandedItem.classList.remove('active');
        expandedVideo.src = '';
    }

    //paper
    if (window.location.pathname.split("/").pop() === 'paperTrader.html'){
        const API_KEY = 'ZKYPVBUN3C4RYZ09';
        const BASE_URL = 'https://www.alphavantage.co/query?';
    
        const tradeForm = document.getElementById('tradeForm');
        const tradeLog = document.getElementById('tradeLog');
        const portfolioContainer = document.getElementById('portfolioContainer');
        const assetsContainer = document.getElementById('assetsContainer');
        const cashContainer = document.getElementById('cashContainer');
    
        let portfolio = JSON.parse(localStorage.getItem('port')) || {};
        let totalCash = JSON.parse(localStorage.getItem('cash')) || 10000;
        let totalAssets = JSON.parse(localStorage.getItem('assets')) || 0;
    
        function updatePortfolioDisplay() {
            portfolioContainer.innerHTML = '';
            totalAssets = 0;
            let fetchPromises = [];
    
            for (let symbol in portfolio) {
                let url = `${BASE_URL}function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
                fetchPromises.push(
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            const price = parseFloat(data['Global Quote']['05. price']);
                            const priceChange = ((price - (portfolio[symbol].totalValue / portfolio[symbol].quantity)) / (portfolio[symbol].totalValue / portfolio[symbol].quantity) * 100).toFixed(2);
                            
                            portfolio[symbol].totalValue = price * portfolio[symbol].quantity;
                            portfolioContainer.innerHTML += `<p>${symbol}: ${portfolio[symbol].quantity} shares, Total Value: $${portfolio[symbol].totalValue.toFixed(2)} (${priceChange}%)</p>`;
                            totalAssets += portfolio[symbol].totalValue;
                        })
                );
            }
    
            Promise.all(fetchPromises).then(() => {
                assetsContainer.innerHTML = "Total Value: $" + totalAssets.toFixed(2);
                cashContainer.innerHTML = "$" + totalCash.toFixed(2);
            });
        }
    
        updatePortfolioDisplay();
    
        buy.addEventListener('click', (event) => {
            event.preventDefault();
            const symbol = tradeForm.elements['symbol'].value.toUpperCase();
            const quantity = parseInt(tradeForm.elements['quantity'].value);
            if (!symbol || isNaN(quantity)) {
                tradeLog.innerHTML = 'Please enter a valid stock symbol and quantity.';
                return;
            }
            
            const url = `${BASE_URL}function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const price = parseFloat(data['Global Quote']['05. price']);
                    if (isNaN(price)) {
                        tradeLog.innerHTML = "Undefined Stock Symbol.";
                        return;
                    }
                    if (portfolio[symbol]) {
                        portfolio[symbol].quantity += quantity;
                        portfolio[symbol].totalValue += price * quantity;
                    } else {
                        portfolio[symbol] = { quantity: quantity, totalValue: price * quantity };
                    }
    
                    totalCash -= price * quantity;
    
                    tradeLog.innerHTML += `<p>Bought ${quantity} shares of ${symbol} at $${price} each.</p>`;
                    localStorage.setItem('port', JSON.stringify(portfolio));
                    localStorage.setItem('cash', JSON.stringify(totalCash));
                    localStorage.setItem('assets', JSON.stringify(totalAssets));
                    updatePortfolioDisplay();
                });
        });
    
        sell.addEventListener('click', (event) => {
            event.preventDefault();
            const symbol = tradeForm.elements['symbol'].value.toUpperCase();
            const quantity = parseInt(tradeForm.elements['quantity'].value);
            if (!symbol || isNaN(quantity)) {
                tradeLog.innerHTML = 'Please enter a valid stock symbol and quantity.';
                return;
            }
            
            const url = `${BASE_URL}function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const price = parseFloat(data['Global Quote']['05. price']);
                    if (isNaN(price)) {
                        tradeLog.innerHTML = "Undefined Stock Symbol.";
                        return;
                    }
                    if (portfolio[symbol]) {
                        totalCash += price * quantity;
                        portfolio[symbol].quantity -= quantity;
                        portfolio[symbol].totalValue -= price * quantity;
                        if (portfolio[symbol].quantity <= 0) {
                            delete portfolio[symbol];
                        }
                    } else {
                        tradeLog.innerHTML += `${symbol} not owned`;
                        return;
                    }
    
                    tradeLog.innerHTML += `<p>Sold ${quantity} shares of ${symbol} at $${price} each.</p>`;
                    localStorage.setItem('port', JSON.stringify(portfolio));
                    localStorage.setItem('cash', JSON.stringify(totalCash));
                    localStorage.setItem('assets', JSON.stringify(totalAssets));
                    updatePortfolioDisplay();
                });
        });
    
        reset.addEventListener('click', (event) => {
            localStorage.removeItem('port');
            localStorage.removeItem('cash');
            localStorage.removeItem('assets');
            location.reload();
        });
    }
    